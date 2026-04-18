import { useRef, useCallback } from 'react';
import { useMicInput } from './useMicInput';

export function usePlayerInput(enabled: boolean, sensitivityRef?: React.RefObject<number>) {
  const mic = useMicInput(enabled, sensitivityRef);

  const noteOnCallbacks = useRef<((midi: number) => void)[]>([]);
  const noteOffCallbacks = useRef<((midi: number) => void)[]>([]);

  mic.onNoteOn.current = (midi: number) => {
    for (const cb of noteOnCallbacks.current) cb(midi);
  };
  mic.onNoteOff.current = (midi: number) => {
    for (const cb of noteOffCallbacks.current) cb(midi);
  };

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
    activeNotes: mic.activeNotes,
    activeNotesState: mic.activeNotesState,
    isListening: mic.isListening,
    calibrated: mic.calibrated,
    error: mic.error,
    detectedNote: mic.detectedNote,
    rmsLevel: mic.rmsLevel,
    clarity: mic.clarity,
    onNoteOn,
    onNoteOff,
  };
}
