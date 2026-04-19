#!/usr/bin/env python3
"""
MIDI Bridge — forwards USB MIDI from a piano to WebSocket clients over WiFi.
Run on a Raspberry Pi connected to the piano via USB MIDI adapter.

Serves both HTTP (web app) and WebSocket (MIDI data) on a single port,
which is required because iPad Safari blocks cross-port WebSocket connections.

Usage:
    python3 midi-bridge.py [--port 8080] [--device "USB MIDI"] [--www ./www]
"""

import argparse
import asyncio
import json
import logging
import mimetypes
import signal
import socket
from http import HTTPStatus
from pathlib import Path

import mido
from websockets.asyncio.server import serve, ServerConnection
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
    """Serve a static file from www_path, or None if not configured."""
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
        return Response(HTTPStatus.NOT_FOUND, "Not Found", b"404 Not Found")

    body = file_path.read_bytes()
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"

    return Response(
        HTTPStatus.OK,
        "OK",
        body,
        headers={"Content-Type": content_type, "Cache-Control": "no-cache"},
    )


async def process_request(connection, request):
    """Route HTTP requests to static files, let WebSocket upgrades through."""
    if request.headers.get("Upgrade", "").lower() == "websocket":
        return None
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


async def main(port: int, preferred_device: str | None, www_dir: str | None) -> None:
    global www_path

    if www_dir:
        www_path = Path(www_dir).resolve()
        if not www_path.is_dir():
            log.error("--www directory does not exist: %s", www_path)
            www_path = None

    azc = await register_mdns(port)

    stop = asyncio.Event()
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)

    async with serve(ws_handler, "0.0.0.0", port, process_request=process_request):
        if www_path:
            log.info("Serving web app from %s on port %d", www_path, port)
        log.info("WebSocket + HTTP server listening on port %d", port)
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
    args = parser.parse_args()

    asyncio.run(main(args.port, args.device, args.www))
