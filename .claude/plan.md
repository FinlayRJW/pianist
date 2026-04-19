# MIDI Bridge: Raspberry Pi to iPad over WebSocket

## Overview

The iPad doesn't support the Web MIDI API (Safari limitation). We'll use a Raspberry Pi as a WiFi bridge: Pi reads USB MIDI from the Yamaha P35, broadcasts note events over WebSocket, and the web app connects to it.

## Raspberry Pi Side

### `pi/midi-bridge.py` — single Python script (~80 lines)

- Uses `mido` (with `python-rtmidi` backend) to read MIDI from the Yamaha P35 via USB
- Runs a WebSocket server on port `3141` using `websockets`
- Broadcasts JSON messages to all connected clients: `{"type":"noteOn","note":60,"velocity":100}` / `{"type":"noteOff","note":60}`
- Auto-discovers the MIDI device (first available input), reconnects on disconnect
- Advertises via mDNS (`_midi-bridge._tcp`) using `zeroconf` so the iPad can find it without knowing the IP

### `pi/midi-bridge.service` — systemd unit file

- Starts on boot, restarts on failure
- README with setup instructions (install deps, enable service)

## Web App Side

### 1. Store: add bridge settings to `onboardingStore.ts`

Add to the store:
- `midiBridgeUrl: string | null` — WebSocket URL (e.g., `ws://192.168.1.50:3141`), null means disabled
- `setMidiBridgeUrl(url: string | null)` — setter

### 2. New hook: `src/hooks/useWebSocketMidi.ts`

Same interface as `useMidiInput` (activeNotes ref, activeNotesState, isConnected, deviceName, error, onNoteOn/onNoteOff refs).

- Connects to the configured WebSocket URL
- Parses JSON messages and fires note-on/note-off callbacks
- Auto-reconnects on disconnect (with backoff)
- Reports connection state (connecting/connected/error)

### 3. Update `usePlayerInput.ts`

- Import `useWebSocketMidi` and the bridge URL from the store
- Priority: Web MIDI (native) > WebSocket MIDI (bridge) > Microphone
- When bridge is configured and connected, `usingMidi` is true and it behaves identically to native MIDI
- Expose `midiBridgeConnected` flag for UI

### 4. Settings UI in `CalibrationModal.tsx`

Add a "MIDI Bridge" section (between Progress and Input Calibration):

- Toggle: Enable/Disable bridge
- When enabled: text input for Pi address (e.g., `raspberrypi.local` or IP)
- Connection status indicator (green dot = connected, yellow = connecting, red = error)
- "Scan" button that tries mDNS discovery (fetches `ws://<hostname>:3141` and tests connection)
- "Test" button that connects and shows status

### 5. GameScreen header status

- When using bridge MIDI, show device name as "MIDI Bridge" (or the Pi's reported device name) in the existing emerald status text
- No other header changes needed — the existing input mode selector (Auto/MIDI/Mic) works as-is

## Files Changed

| File | Change |
|------|--------|
| `pi/midi-bridge.py` | **New** — Pi MIDI→WebSocket bridge script |
| `pi/midi-bridge.service` | **New** — systemd service unit |
| `pi/README.md` | **New** — setup instructions |
| `src/stores/onboardingStore.ts` | Add `midiBridgeUrl` state |
| `src/hooks/useWebSocketMidi.ts` | **New** — WebSocket MIDI hook |
| `src/hooks/usePlayerInput.ts` | Integrate WebSocket MIDI as input source |
| `src/components/onboarding/CalibrationModal.tsx` | Add MIDI Bridge settings section |

## What stays the same

- `useMidiInput.ts` — untouched, still handles native Web MIDI
- `useMicInput.ts` — untouched
- `useScoring.ts`, `GameScreen.tsx` header — no changes needed (input abstraction handles it)
- Onboarding flow — untouched per user request

## Data flow

```
Yamaha P35 --USB MIDI--> Raspberry Pi --WebSocket/WiFi--> iPad Browser
                                                            |
                                                    useWebSocketMidi
                                                            |
                                                    usePlayerInput
                                                            |
                                                      useScoring
```
