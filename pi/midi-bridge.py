#!/usr/bin/env python3
"""
MIDI Bridge — forwards USB MIDI from a piano to WebSocket clients over WiFi.
Run on a Raspberry Pi connected to the piano via USB MIDI adapter.

Usage:
    python3 midi-bridge.py [--port 3141] [--device "USB MIDI"]
"""

import argparse
import asyncio
import json
import logging
import signal
import socket

import mido
import websockets
from zeroconf import ServiceInfo, Zeroconf

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("midi-bridge")

clients: set[websockets.WebSocketServerProtocol] = set()
device_name: str | None = None


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
        except websockets.ConnectionClosed:
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


async def ws_handler(ws: websockets.WebSocketServerProtocol) -> None:
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
    except websockets.ConnectionClosed:
        pass
    finally:
        clients.discard(ws)
        log.info("Client disconnected (%d remaining)", len(clients))


def register_mdns(port: int) -> Zeroconf:
    ip = get_local_ip()
    log.info("Local IP: %s", ip)

    zc = Zeroconf()
    info = ServiceInfo(
        "_midi-bridge._tcp.local.",
        "Piano MIDI Bridge._midi-bridge._tcp.local.",
        addresses=[socket.inet_aton(ip)],
        port=port,
        properties={"version": "1"},
    )
    zc.register_service(info)
    log.info("mDNS registered: _midi-bridge._tcp on port %d", port)
    return zc


async def main(port: int, preferred_device: str | None) -> None:
    zc = register_mdns(port)

    stop = asyncio.Event()
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop.set)

    async with websockets.serve(ws_handler, "0.0.0.0", port):
        log.info("WebSocket server listening on port %d", port)
        midi_task = asyncio.create_task(midi_reader(preferred_device))

        await stop.wait()

        midi_task.cancel()
        try:
            await midi_task
        except asyncio.CancelledError:
            pass

    zc.unregister_all_services()
    zc.close()
    log.info("Shutdown complete")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MIDI to WebSocket bridge")
    parser.add_argument("--port", type=int, default=3141)
    parser.add_argument("--device", type=str, default=None, help="Preferred MIDI device name (partial match)")
    args = parser.parse_args()

    asyncio.run(main(args.port, args.device))
