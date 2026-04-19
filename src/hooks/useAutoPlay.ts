import { useRef, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import type { Note } from '../types';

export function useAutoPlay(
  notes: Note[],
  timeRef: React.RefObject<number>,
  playing: boolean,
  enabled: boolean,
) {
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const lastTriggeredRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
        A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
        A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
        A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
        A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
        A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
        A6: 'A6.mp3', C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
        A7: 'A7.mp3', C8: 'C8.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      volume: -12,
    }).toDestination();
    samplerRef.current = sampler;

    return () => {
      samplerRef.current = null;
      setTimeout(() => {
        sampler.releaseAll();
        sampler.dispose();
      }, 0);
    };
  }, [enabled]);

  useEffect(() => {
    if (!playing) {
      lastTriggeredRef.current.clear();
    }
  }, [playing]);

  const tick = useCallback(() => {
    if (!enabled || !playing || !samplerRef.current) return;

    const currentTime = timeRef.current ?? 0;
    const triggered = lastTriggeredRef.current;

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.startTime > currentTime + 0.05) break;
      if (note.startTime < currentTime - 0.05) continue;
      if (triggered.has(i)) continue;

      triggered.add(i);
      try {
        const freq = Tone.Frequency(note.midi, 'midi').toFrequency();
        samplerRef.current.triggerAttackRelease(freq, note.duration, undefined, note.velocity / 127);
      } catch {
        // Sampler may be disposed or not yet loaded
      }
    }
  }, [notes, timeRef, playing, enabled]);

  return { tick };
}
