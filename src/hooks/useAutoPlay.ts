import { useRef, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import type { Note } from '../types';

export function useAutoPlay(
  notes: Note[],
  timeRef: React.RefObject<number>,
  playing: boolean,
  enabled: boolean,
) {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const lastTriggeredRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.8 },
      volume: -12,
    }).toDestination();
    synthRef.current = synth;

    return () => {
      synth.releaseAll();
      synth.dispose();
      synthRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!playing) {
      lastTriggeredRef.current.clear();
    }
  }, [playing]);

  const tick = useCallback(() => {
    if (!enabled || !playing || !synthRef.current) return;

    const currentTime = timeRef.current ?? 0;
    const triggered = lastTriggeredRef.current;

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.startTime > currentTime + 0.05) break;
      if (note.startTime < currentTime - 0.05) continue;
      if (triggered.has(i)) continue;

      triggered.add(i);
      const freq = Tone.Frequency(note.midi, 'midi').toFrequency();
      synthRef.current.triggerAttackRelease(freq, note.duration, undefined, note.velocity / 127);
    }
  }, [notes, timeRef, playing, enabled]);

  return { tick };
}
