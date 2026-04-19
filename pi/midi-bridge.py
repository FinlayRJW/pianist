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
import signal
import socket
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path

import mido
from aiohttp import web
from zeroconf.asyncio import AsyncZeroconf
from zeroconf import ServiceInfo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("midi-bridge")

clients: set[web.WebSocketResponse] = set()
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


# ── REST API handlers ────────────────────────────────────────────────

async def api_list_users(_request: web.Request) -> web.Response:
    users_file = data_path / "users.json"
    async with get_lock("users"):
        users = read_json(users_file, [])
    return web.json_response(users)


async def api_create_user(request: web.Request) -> web.Response:
    body = await request.json()
    name = body.get("name", "").strip()
    if not name:
        return web.json_response({"error": "Name is required"}, status=400)

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

    return web.json_response(user, status=201)


async def api_delete_user(request: web.Request) -> web.Response:
    user_id = request.match_info["user_id"]
    users_file = data_path / "users.json"
    async with get_lock("users"):
        users = read_json(users_file, [])
        filtered = [u for u in users if u["id"] != user_id]
        if len(filtered) == len(users):
            return web.json_response({"error": "User not found"}, status=404)
        write_json_atomic(users_file, filtered)

    progress_file = data_path / "progress" / f"{user_id}.json"
    if progress_file.exists():
        progress_file.unlink()

    return web.Response(status=204)


async def api_get_progress(request: web.Request) -> web.Response:
    user_id = request.match_info["user_id"]
    progress_file = data_path / "progress" / f"{user_id}.json"
    async with get_lock(f"progress-{user_id}"):
        progress = read_json(progress_file, {
            "version": 3,
            "scores": {},
            "bestStars": {},
            "adventureBestStars": {},
            "journeyBestStars": {},
            "onboardingCompleted": False,
        })
    return web.json_response(progress)


async def api_put_progress(request: web.Request) -> web.Response:
    user_id = request.match_info["user_id"]
    users_file = data_path / "users.json"
    users = read_json(users_file, [])
    if not any(u["id"] == user_id for u in users):
        return web.json_response({"error": "User not found"}, status=404)

    body = await request.json()
    progress_file = data_path / "progress" / f"{user_id}.json"
    async with get_lock(f"progress-{user_id}"):
        write_json_atomic(progress_file, body)
    return web.Response(status=204)


async def api_list_songs(_request: web.Request) -> web.Response:
    songs_file = data_path / "songs" / "meta.json"
    async with get_lock("songs"):
        songs = read_json(songs_file, [])
    return web.json_response(songs)


async def api_create_song(request: web.Request) -> web.Response:
    body = await request.json()
    meta = body.get("meta")
    midi_b64 = body.get("midi")
    if not meta or not midi_b64:
        return web.json_response({"error": "meta and midi are required"}, status=400)

    song_id = meta.get("id")
    if not song_id:
        return web.json_response({"error": "meta.id is required"}, status=400)

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

    return web.json_response(meta, status=201)


async def api_delete_song(request: web.Request) -> web.Response:
    song_id = request.match_info["song_id"]
    songs_file = data_path / "songs" / "meta.json"
    async with get_lock("songs"):
        songs = read_json(songs_file, [])
        filtered = [s for s in songs if s.get("id") != song_id]
        if len(filtered) == len(songs):
            return web.json_response({"error": "Song not found"}, status=404)
        write_json_atomic(songs_file, filtered)

    midi_file = data_path / "songs" / "midi" / f"{song_id}.mid"
    if midi_file.exists():
        midi_file.unlink()

    return web.Response(status=204)


async def api_get_song_midi(request: web.Request) -> web.Response:
    song_id = request.match_info["song_id"]
    midi_file = data_path / "songs" / "midi" / f"{song_id}.mid"
    if not midi_file.exists():
        return web.json_response({"error": "MIDI file not found"}, status=404)

    body = midi_file.read_bytes()
    return web.Response(
        body=body,
        content_type="application/octet-stream",
    )


# ── WebSocket + Static fallback ──────────────────────────────────────

async def ws_handler(request: web.Request) -> web.WebSocketResponse:
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    clients.add(ws)
    log.info("Client connected (%d total)", len(clients))

    try:
        await ws.send_str(json.dumps({
            "type": "hello",
            "device": device_name,
        }))
        async for msg in ws:
            if msg.type == web.WSMsgType.TEXT:
                data = json.loads(msg.data)
                if data.get("type") == "ping":
                    await ws.send_str(json.dumps({"type": "pong"}))
            elif msg.type in (web.WSMsgType.ERROR, web.WSMsgType.CLOSE):
                break
    except Exception:
        pass
    finally:
        clients.discard(ws)
        log.info("Client disconnected (%d remaining)", len(clients))

    return ws


def serve_static_file(request_path: str) -> web.Response:
    if www_path is None:
        raise web.HTTPNotFound()

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
        raise web.HTTPNotFound()

    body = file_path.read_bytes()
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"

    return web.Response(
        body=body,
        content_type=content_type,
        headers={"Cache-Control": "no-cache"},
    )


# ── Middleware ────────────────────────────────────────────────────────

@web.middleware
async def cors_middleware(request: web.Request, handler):
    if request.method == "OPTIONS":
        return web.Response(status=204, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        })
    response = await handler(request)
    if not isinstance(response, web.WebSocketResponse):
        response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@web.middleware
async def fallback_middleware(request: web.Request, handler):
    try:
        return await handler(request)
    except web.HTTPNotFound:
        ws_resp = web.WebSocketResponse()
        if ws_resp.can_prepare(request):
            return await ws_handler(request)
        return serve_static_file(request.path)


# ── MIDI ──────────────────────────────────────────────────────────────

async def broadcast(message: dict) -> None:
    if not clients:
        return
    data = json.dumps(message)
    dead = set()
    for ws in list(clients):
        try:
            await ws.send_str(data)
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


def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


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
                        await broadcast({"type": "noteOn", "note": msg.note, "velocity": msg.velocity})
                    elif msg.type == "note_off" or (msg.type == "note_on" and msg.velocity == 0):
                        await broadcast({"type": "noteOff", "note": msg.note})
        except (OSError, IOError) as e:
            log.warning("MIDI device disconnected (%s), retrying in 2s...", e)
            device_name = None
            await asyncio.sleep(2)


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


# ── Main ──────────────────────────────────────────────────────────────

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

    app = web.Application(middlewares=[cors_middleware, fallback_middleware])

    app.router.add_get("/api/users", api_list_users)
    app.router.add_post("/api/users", api_create_user)
    app.router.add_delete("/api/users/{user_id}", api_delete_user)
    app.router.add_get("/api/users/{user_id}/progress", api_get_progress)
    app.router.add_put("/api/users/{user_id}/progress", api_put_progress)
    app.router.add_get("/api/songs", api_list_songs)
    app.router.add_post("/api/songs", api_create_song)
    app.router.add_delete("/api/songs/{song_id}", api_delete_song)
    app.router.add_get("/api/songs/{song_id}/midi", api_get_song_midi)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()

    if www_path:
        log.info("Serving web app from %s on port %d", www_path, port)
    log.info("WebSocket + HTTP + API server listening on port %d", port)

    midi_task = asyncio.create_task(midi_reader(preferred_device))

    stop = asyncio.Event()
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)

    await stop.wait()

    midi_task.cancel()
    try:
        await midi_task
    except asyncio.CancelledError:
        pass

    await runner.cleanup()
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
