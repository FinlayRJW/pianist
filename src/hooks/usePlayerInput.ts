import { useRef, useCallback } from 'react';
import { useMidiInput } from './useMidiInput';
import { useWebSocketMidi } from './useWebSocketMidi';
import { useOnboardingStore } from '../stores/onboardingStore';

export type InputMode = 'auto' | 'midi';

export function usePlayerInput(inputMode: InputMode) {
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);

  const hasBridgeConfig = midiBridgeUrl !== null;
  const midi = useMidiInput(!hasBridgeConfig);
  const bridge = useWebSocketMidi(midiBridgeUrl);

  const usingBridge = !midi.isConnected && bridge.isConnected;
  const activeMidi = usingBridge ? bridge : midi;

  const noteOnCallbacks = useRef<((midi: number) => void)[]>([]);
  const noteOffCallbacks = useRef<((midi: number) => void)[]>([]);

  const fireNoteOn = useCallback((note: number) => {
    for (const cb of noteOnCallbacks.current) cb(note);
  }, []);

  const fireNoteOff = useCallback((note: number) => {
    for (const cb of noteOffCallbacks.current) cb(note);
  }, []);

  activeMidi.onNoteOn.current = fireNoteOn;
  activeMidi.onNoteOff.current = fireNoteOff;
  if (usingBridge) {
    midi.onNoteOn.current = null;
    midi.onNoteOff.current = null;
  } else {
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

  return {
    activeNotes: activeMidi.activeNotes,
    activeNotesState: activeMidi.activeNotesState,
    isListening: activeMidi.isConnected,
    error: activeMidi.error,
    hasBridgeConfig,
    midiConnected: midi.isConnected,
    midiBridgeConnected: bridge.isConnected,
    midiDeviceName: usingBridge ? bridge.deviceName : midi.deviceName,
    onNoteOn,
    onNoteOff,
  };
}
