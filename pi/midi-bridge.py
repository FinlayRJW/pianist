#!/usr/bin/env python3
"""
MIDI Bridge — forwards USB MIDI from a piano to WebSocket clients over WiFi.
Run on a Raspberry Pi connected to the piano via USB MIDI adapter.

Serves HTTP (web app), REST API (users/progress/songs), and WebSocket (MIDI data)
on a single port, required because iPad Safari blocks cross-port WebSocket connections.

Usage:
    python3 midi-bridge.py [--port 8080] [--device "USB MIDI"] [--www ./www] [--data ./data]
"""

import argparse
import asyncio
import base64
import json
import logging
import mimetypes
import os
import re
import signal
import socket
import tempfile
import uuid
from datetime import datetime, timezone
from http import HTTPStatus
from pathlib import Path

import mido
from websockets.asyncio.server import serve, ServerConnection
from websockets.datastructures import Headers
from websockets.http11 import Response
from zeroconf.asyncio import AsyncZeroconf
from zeroconf import ServiceInfo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("midi-bridge")

clients: set[ServerConnection] = set()
device_name: str | None = None
www_path: Path | None = None
data_path: Path | None = None

_locks: dict[str, asyncio.Lock] = {}


def get_lock(key: str) -> asyncio.Lock:
    if key not in _locks:
        _locks[key] = asyncio.Lock()
    return _locks[key]


def write_json_atomic(path: Path, data) -> None:
    tmp_fd, tmp_path = tempfile.mkstemp(dir=path.parent, suffix=".tmp")
    try:
        with os.fdopen(tmp_fd, "w") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp_path, str(path))
    except Exception:
        os.unlink(tmp_path)
        raise


def read_json(path: Path, default=None):
    if not path.exists():
        return default
    with open(path) as f:
        return json.load(f)


def json_response(data, status=HTTPStatus.OK) -> Response:
    body = json.dumps(data).encode()
    return Response(
        status,
        status.phrase,
        Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }),
        body,
    )


def no_content_response() -> Response:
    return Response(
        HTTPStatus.NO_CONTENT,
        "No Content",
        Headers({"Access-Control-Allow-Origin": "*"}),
        b"",
    )


def error_response(status: HTTPStatus, message: str) -> Response:
    return json_response({"error": message}, status)


def cors_preflight_response() -> Response:
    return Response(
        HTTPStatus.NO_CONTENT,
        "No Content",
        Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        }),
        b"",
    )


# ── REST API ──────────────────────────────────────────────────────────

async def handle_api(request) -> Response:
    path = request.path
    method = request.method if hasattr(request, "method") else "GET"

    if method == "OPTIONS":
        return cors_preflight_response()

    try:
        body = request.body if hasattr(request, "body") else b""
    except Exception:
        body = b""

    try:
        # GET /api/users
        if path == "/api/users" and method == "GET":
            return await api_list_users()

        # POST /api/users
        if path == "/api/users" and method == "POST":
            data = json.loads(body) if body else {}
            return await api_create_user(data)

        # DELETE /api/users/:id
        m = re.match(r"^/api/users/([^/]+)$", path)
        if m and method == "DELETE":
            return await api_delete_user(m.group(1))

        # GET /api/users/:id/progress
        m = re.match(r"^/api/users/([^/]+)/progress$", path)
        if m and method == "GET":
            return await api_get_progress(m.group(1))

        # PUT /api/users/:id/progress
        m = re.match(r"^/api/users/([^/]+)/progress$", path)
        if m and method == "PUT":
            data = json.loads(body) if body else {}
            return await api_put_progress(m.group(1), data)

        # GET /api/songs
        if path == "/api/songs" and method == "GET":
            return await api_list_songs()

        # POST /api/songs
        if path == "/api/songs" and method == "POST":
            data = json.loads(body) if body else {}
            return await api_create_song(data)

        # DELETE /api/songs/:id
        m = re.match(r"^/api/songs/([^/]+)$", path)
        if m and method == "DELETE":
            return await api_delete_song(m.group(1))

        # GET /api/songs/:id/midi
        m = re.match(r"^/api/songs/([^/]+)/midi$", path)
        if m and method == "GET":
            return await api_get_song_midi(m.group(1))

        return error_response(HTTPStatus.NOT_FOUND, "Not found")

    except json.JSONDecodeError:
        return error_response(HTTPStatus.BAD_REQUEST, "Invalid JSON")
    except Exception as e:
        log.exception("API error: %s", e)
        return error_response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))


# ── User endpoints ────────────────────────────────────────────────────

async def api_list_users() -> Response:
    users_file = data_path / "users.json"
    async with get_lock("users"):
        users = read_json(users_file, [])
    return json_response(users)


async def api_create_user(body: dict) -> Response:
    name = body.get("name", "").strip()
    if not name:
        return error_response(HTTPStatus.BAD_REQUEST, "Name is required")

    user = {
        "id": uuid.uuid4().hex[:8],
        "name": name,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    users_file = data_path / "users.json"
    async with get_lock("users"):
        users = read_json(users_file, [])
        users.append(user)
        write_json_atomic(users_file, users)

    return json_response(user, HTTPStatus.CREATED)


async def api_delete_user(user_id: str) -> Response:
    users_file = data_path / "users.json"
    async with get_lock("users"):
        users = read_json(users_file, [])
        filtered = [u for u in users if u["id"] != user_id]
        if len(filtered) == len(users):
            return error_response(HTTPStatus.NOT_FOUND, "User not found")
        write_json_atomic(users_file, filtered)

    progress_file = data_path / "progress" / f"{user_id}.json"
    if progress_file.exists():
        progress_file.unlink()

    return no_content_response()


# ── Progress endpoints ────────────────────────────────────────────────

async def api_get_progress(user_id: str) -> Response:
    progress_file = data_path / "progress" / f"{user_id}.json"
    async with get_lock(f"progress-{user_id}"):
        progress = read_json(progress_file, {
            "version": 3,
            "scores": {},
            "bestStars": {},
            "adventureBestStars": {},
            "journeyBestStars": {},
        })
    return json_response(progress)


async def api_put_progress(user_id: str, body: dict) -> Response:
    users_file = data_path / "users.json"
    users = read_json(users_file, [])
    if not any(u["id"] == user_id for u in users):
        return error_response(HTTPStatus.NOT_FOUND, "User not found")

    progress_file = data_path / "progress" / f"{user_id}.json"
    async with get_lock(f"progress-{user_id}"):
        write_json_atomic(progress_file, body)
    return no_content_response()


# ── Song endpoints ────────────────────────────────────────────────────

async def api_list_songs() -> Response:
    songs_file = data_path / "songs" / "meta.json"
    async with get_lock("songs"):
        songs = read_json(songs_file, [])
    return json_response(songs)


async def api_create_song(body: dict) -> Response:
    meta = body.get("meta")
    midi_b64 = body.get("midi")
    if not meta or not midi_b64:
        return error_response(HTTPStatus.BAD_REQUEST, "meta and midi are required")

    song_id = meta.get("id")
    if not song_id:
        return error_response(HTTPStatus.BAD_REQUEST, "meta.id is required")

    midi_data = base64.b64decode(midi_b64)

    midi_dir = data_path / "songs" / "midi"
    midi_dir.mkdir(parents=True, exist_ok=True)
    midi_file = midi_dir / f"{song_id}.mid"
    midi_file.write_bytes(midi_data)

    songs_file = data_path / "songs" / "meta.json"
    async with get_lock("songs"):
        songs = read_json(songs_file, [])
        songs = [s for s in songs if s.get("id") != song_id]
        songs.append(meta)
        write_json_atomic(songs_file, songs)

    return json_response(meta, HTTPStatus.CREATED)


async def api_delete_song(song_id: str) -> Response:
    songs_file = data_path / "songs" / "meta.json"
    async with get_lock("songs"):
        songs = read_json(songs_file, [])
        filtered = [s for s in songs if s.get("id") != song_id]
        if len(filtered) == len(songs):
            return error_response(HTTPStatus.NOT_FOUND, "Song not found")
        write_json_atomic(songs_file, filtered)

    midi_file = data_path / "songs" / "midi" / f"{song_id}.mid"
    if midi_file.exists():
        midi_file.unlink()

    return no_content_response()


async def api_get_song_midi(song_id: str) -> Response:
    midi_file = data_path / "songs" / "midi" / f"{song_id}.mid"
    if not midi_file.exists():
        return error_response(HTTPStatus.NOT_FOUND, "MIDI file not found")

    body = midi_file.read_bytes()
    return Response(
        HTTPStatus.OK,
        "OK",
        Headers({
            "Content-Type": "application/octet-stream",
            "Access-Control-Allow-Origin": "*",
        }),
        body,
    )


# ── Existing server functions ─────────────────────────────────────────

def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


def broadcast(message: dict) -> None:
    if not clients:
        return
    data = json.dumps(message)
    dead = set()
    for ws in clients:
        try:
            ws.send_nowait(data)
        except Exception:
            dead.add(ws)
    clients.difference_update(dead)


def find_midi_device(preferred: str | None) -> str | None:
    names = mido.get_input_names()
    if not names:
        return None
    if preferred:
        for name in names:
            if preferred.lower() in name.lower():
                return name
    for name in names:
        if "through" not in name.lower():
            return name
    return names[0]


def serve_static(request_path: str) -> Response | None:
    if www_path is None:
        return None

    path = request_path.split("?")[0]

    if path.startswith("/pianist/"):
        path = path[len("/pianist"):]
    elif path == "/pianist":
        path = "/"

    file_path = www_path / path.lstrip("/")

    if file_path.is_dir():
        file_path = file_path / "index.html"

    if not file_path.exists() or not file_path.is_file():
        file_path = www_path / "index.html"

    if not file_path.exists():
        return Response(
            HTTPStatus.NOT_FOUND,
            "Not Found",
            Headers({"Content-Type": "text/plain"}),
            b"404 Not Found",
        )

    body = file_path.read_bytes()
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"

    return Response(
        HTTPStatus.OK,
        "OK",
        Headers({"Content-Type": content_type, "Cache-Control": "no-cache"}),
        body,
    )


async def process_request(connection, request):
    if request.headers.get("Upgrade", "").lower() == "websocket":
        return None

    if request.path.startswith("/api/"):
        return await handle_api(request)

    response = serve_static(request.path)
    if response:
        return response
    return None


async def midi_reader(preferred_device: str | None) -> None:
    global device_name

    while True:
        name = find_midi_device(preferred_device)
        if not name:
            log.info("No MIDI device found, retrying in 2s...")
            device_name = None
            await asyncio.sleep(2)
            continue

        device_name = name
        log.info("Opened MIDI device: %s", name)

        try:
            with mido.open_input(name) as port:
                while True:
                    msg = await asyncio.get_event_loop().run_in_executor(
                        None, lambda: port.receive(block=True)
                    )
                    if msg.type == "note_on" and msg.velocity > 0:
                        broadcast({"type": "noteOn", "note": msg.note, "velocity": msg.velocity})
                    elif msg.type == "note_off" or (msg.type == "note_on" and msg.velocity == 0):
                        broadcast({"type": "noteOff", "note": msg.note})
        except (OSError, IOError) as e:
            log.warning("MIDI device disconnected (%s), retrying in 2s...", e)
            device_name = None
            await asyncio.sleep(2)


async def ws_handler(ws: ServerConnection) -> None:
    clients.add(ws)
    log.info("Client connected (%d total)", len(clients))

    try:
        await ws.send(json.dumps({
            "type": "hello",
            "device": device_name,
        }))
        async for raw in ws:
            msg = json.loads(raw)
            if msg.get("type") == "ping":
                await ws.send(json.dumps({"type": "pong"}))
    except Exception:
        pass
    finally:
        clients.discard(ws)
        log.info("Client disconnected (%d remaining)", len(clients))


async def register_mdns(port: int) -> AsyncZeroconf:
    ip = get_local_ip()
    log.info("Local IP: %s", ip)

    info = ServiceInfo(
        "_midi-bridge._tcp.local.",
        "Piano MIDI Bridge._midi-bridge._tcp.local.",
        addresses=[socket.inet_aton(ip)],
        port=port,
        properties={"version": "1"},
    )
    azc = AsyncZeroconf()
    await azc.async_register_service(info)
    log.info("mDNS registered: _midi-bridge._tcp on port %d", port)
    return azc


async def main(port: int, preferred_device: str | None, www_dir: str | None, data_dir: str) -> None:
    global www_path, data_path

    if www_dir:
        www_path = Path(www_dir).resolve()
        if not www_path.is_dir():
            log.error("--www directory does not exist: %s", www_path)
            www_path = None

    data_path = Path(data_dir).resolve()
    data_path.mkdir(parents=True, exist_ok=True)
    (data_path / "progress").mkdir(exist_ok=True)
    (data_path / "songs").mkdir(exist_ok=True)
    (data_path / "songs" / "midi").mkdir(exist_ok=True)
    log.info("Data directory: %s", data_path)

    azc = await register_mdns(port)

    stop = asyncio.Event()
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)

    async with serve(ws_handler, "0.0.0.0", port, process_request=process_request):
        if www_path:
            log.info("Serving web app from %s on port %d", www_path, port)
        log.info("WebSocket + HTTP + API server listening on port %d", port)
        midi_task = asyncio.create_task(midi_reader(preferred_device))

        await stop.wait()

        midi_task.cancel()
        try:
            await midi_task
        except asyncio.CancelledError:
            pass

    await azc.async_unregister_all_services()
    await azc.async_close()
    log.info("Shutdown complete")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MIDI to WebSocket bridge")
    parser.add_argument("--port", type=int, default=8080, help="Server port for HTTP + WebSocket (default: 8080)")
    parser.add_argument("--device", type=str, default=None, help="Preferred MIDI device name (partial match)")
    parser.add_argument("--www", type=str, default=None, help="Directory to serve as web app")
    parser.add_argument("--data", type=str, default="./data", help="Directory for persistent data (default: ./data)")
    args = parser.parse_args()

    asyncio.run(main(args.port, args.device, args.www, args.data))
