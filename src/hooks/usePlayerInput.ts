import { useRef, useCallback } from 'react';
import { useMicInput } from './useMicInput';
import { useMidiInput } from './useMidiInput';
import { useWebSocketMidi } from './useWebSocketMidi';
import { useOnboardingStore } from '../stores/onboardingStore';

export type InputMode = 'auto' | 'mic' | 'midi';

export function usePlayerInput(
  inputMode: InputMode,
  micEnabled: boolean,
  sensitivityRef?: React.RefObject<number>,
) {
  const calibration = useOnboardingStore((s) => s.calibration);
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);

  const hasBridgeConfig = midiBridgeUrl !== null;
  const midi = useMidiInput(inputMode !== 'mic' && !hasBridgeConfig);
  const bridge = useWebSocketMidi(inputMode !== 'mic' ? midiBridgeUrl : null);

  const midiAvailable = midi.isConnected || bridge.isConnected;
  const effectiveMicEnabled = inputMode === 'mic' || (inputMode === 'auto' && !midiAvailable && !hasBridgeConfig);
  const mic = useMicInput(effectiveMicEnabled && micEnabled, sensitivityRef, calibration);

  const usingMidi = inputMode === 'midi' || (inputMode === 'auto' && midiAvailable);
  const usingBridge = usingMidi && !midi.isConnected && bridge.isConnected;
  const activeMidi = usingBridge ? bridge : midi;

  const noteOnCallbacks = useRef<((midi: number) => void)[]>([]);
  const noteOffCallbacks = useRef<((midi: number) => void)[]>([]);

  const fireNoteOn = useCallback((note: number) => {
    for (const cb of noteOnCallbacks.current) cb(note);
  }, []);

  const fireNoteOff = useCallback((note: number) => {
    for (const cb of noteOffCallbacks.current) cb(note);
  }, []);

  if (usingMidi) {
    activeMidi.onNoteOn.current = fireNoteOn;
    activeMidi.onNoteOff.current = fireNoteOff;
    if (usingBridge) {
      midi.onNoteOn.current = null;
      midi.onNoteOff.current = null;
    } else {
      bridge.onNoteOn.current = null;
      bridge.onNoteOff.current = null;
    }
    mic.onNoteOn.current = null;
    mic.onNoteOff.current = null;
  } else {
    mic.onNoteOn.current = fireNoteOn;
    mic.onNoteOff.current = fireNoteOff;
    midi.onNoteOn.current = null;
    midi.onNoteOff.current = null;
    bridge.onNoteOn.current = null;
    bridge.onNoteOff.current = null;
  }

  const onNoteOn = useCallback((cb: (midi: number) => void) => {
    noteOnCallbacks.current.push(cb);
    return () => {
      noteOnCallbacks.current = noteOnCallbacks.current.filter((c) => c !== cb);
    };
  }, []);

  const onNoteOff = useCallback((cb: (midi: number) => void) => {
    noteOffCallbacks.current.push(cb);
    return () => {
      noteOffCallbacks.current = noteOffCallbacks.current.filter((c) => c !== cb);
    };
  }, []);

  const source = usingMidi ? activeMidi : mic;

  return {
    activeNotes: source.activeNotes,
    activeNotesState: usingMidi ? activeMidi.activeNotesState : mic.activeNotesState,
    isListening: usingMidi ? activeMidi.isConnected : mic.isListening,
    calibrated: usingMidi ? true : mic.calibrated,
    error: usingMidi ? activeMidi.error : mic.error,
    detectedNote: usingMidi ? null : mic.detectedNote,
    rmsLevel: usingMidi ? 0 : mic.rmsLevel,
    clarity: usingMidi ? 0 : mic.clarity,
    usingMidi,
    midiConnected: midi.isConnected,
    midiBridgeConnected: bridge.isConnected,
    midiDeviceName: usingBridge ? bridge.deviceName : midi.deviceName,
    onNoteOn,
    onNoteOff,
  };
}
