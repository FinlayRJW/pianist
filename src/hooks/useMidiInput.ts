import { useRef, useEffect, useCallback, useState } from 'react';

interface MidiInputState {
  activeNotes: Set<number>;
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
}

export function useMidiInput(enabled: boolean) {
  const [state, setState] = useState<MidiInputState>({
    activeNotes: new Set(),
    isConnected: false,
    deviceName: null,
    error: null,
  });

  const activeNotesRef = useRef<Set<number>>(new Set());
  const onNoteOnRef = useRef<((midi: number) => void) | null>(null);
  const onNoteOffRef = useRef<((midi: number) => void) | null>(null);
  const midiAccessRef = useRef<MIDIAccess | null>(null);

  const handleMidiMessage = useCallback((e: MIDIMessageEvent) => {
    const data = e.data;
    if (!data || data.length < 3) return;

    const status = data[0] & 0xf0;
    const midi = data[1];
    const velocity = data[2];

    if (status === 0x90 && velocity > 0) {
      activeNotesRef.current.add(midi);
      onNoteOnRef.current?.(midi);
      setState((prev) => ({
        ...prev,
        activeNotes: new Set(activeNotesRef.current),
      }));
    } else if (status === 0x80 || (status === 0x90 && velocity === 0)) {
      activeNotesRef.current.delete(midi);
      onNoteOffRef.current?.(midi);
      setState((prev) => ({
        ...prev,
        activeNotes: new Set(activeNotesRef.current),
      }));
    }
  }, []);

  const bindInputs = useCallback((access: MIDIAccess) => {
    let firstName: string | null = null;
    let count = 0;

    access.inputs.forEach((input) => {
      input.onmidimessage = handleMidiMessage;
      if (!firstName) firstName = input.name ?? 'MIDI Device';
      count++;
    });

    setState((prev) => ({
      ...prev,
      isConnected: count > 0,
      deviceName: firstName,
    }));
  }, [handleMidiMessage]);

  const startMidi = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      setState((prev) => ({ ...prev, error: 'Web MIDI not supported' }));
      return;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      midiAccessRef.current = access;

      bindInputs(access);

      access.onstatechange = () => {
        bindInputs(access);
      };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: (err as Error).message,
        isConnected: false,
      }));
    }
  }, [bindInputs]);

  const stopMidi = useCallback(() => {
    if (midiAccessRef.current) {
      midiAccessRef.current.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
      midiAccessRef.current.onstatechange = null;
      midiAccessRef.current = null;
    }
    activeNotesRef.current.clear();
    setState({
      activeNotes: new Set(),
      isConnected: false,
      deviceName: null,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (enabled) {
      startMidi();
    } else {
      stopMidi();
    }
    return stopMidi;
  }, [enabled, startMidi, stopMidi]);

  return {
    activeNotes: activeNotesRef,
    activeNotesState: state.activeNotes,
    isConnected: state.isConnected,
    deviceName: state.deviceName,
    error: state.error,
    onNoteOn: onNoteOnRef,
    onNoteOff: onNoteOffRef,
  };
}
