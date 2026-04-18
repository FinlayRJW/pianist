import { useRef, useCallback } from 'react';
import { useMicInput } from './useMicInput';
import { useMidiInput } from './useMidiInput';

export type InputMode = 'auto' | 'mic' | 'midi';

export function usePlayerInput(
  inputMode: InputMode,
  micEnabled: boolean,
  sensitivityRef?: React.RefObject<number>,
) {
  const midi = useMidiInput(inputMode !== 'mic');
  const effectiveMicEnabled = inputMode === 'mic' || (inputMode === 'auto' && !midi.isConnected);
  const mic = useMicInput(effectiveMicEnabled && micEnabled, sensitivityRef);

  const usingMidi = inputMode === 'midi' || (inputMode === 'auto' && midi.isConnected);

  const noteOnCallbacks = useRef<((midi: number) => void)[]>([]);
  const noteOffCallbacks = useRef<((midi: number) => void)[]>([]);

  const fireNoteOn = useCallback((note: number) => {
    for (const cb of noteOnCallbacks.current) cb(note);
  }, []);

  const fireNoteOff = useCallback((note: number) => {
    for (const cb of noteOffCallbacks.current) cb(note);
  }, []);

  if (usingMidi) {
    midi.onNoteOn.current = fireNoteOn;
    midi.onNoteOff.current = fireNoteOff;
    mic.onNoteOn.current = null;
    mic.onNoteOff.current = null;
  } else {
    mic.onNoteOn.current = fireNoteOn;
    mic.onNoteOff.current = fireNoteOff;
    midi.onNoteOn.current = null;
    midi.onNoteOff.current = null;
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

  const source = usingMidi ? midi : mic;

  return {
    activeNotes: source.activeNotes,
    activeNotesState: usingMidi ? midi.activeNotesState : mic.activeNotesState,
    isListening: usingMidi ? midi.isConnected : mic.isListening,
    calibrated: usingMidi ? true : mic.calibrated,
    error: usingMidi ? midi.error : mic.error,
    detectedNote: usingMidi ? null : mic.detectedNote,
    rmsLevel: usingMidi ? 0 : mic.rmsLevel,
    clarity: usingMidi ? 0 : mic.clarity,
    usingMidi,
    midiConnected: midi.isConnected,
    midiDeviceName: midi.deviceName,
    onNoteOn,
    onNoteOff,
  };
}
