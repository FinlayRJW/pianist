import { useRef, useCallback } from 'react';
import type { Note, NoteHit, SongScore } from '../types';

const TIMING_WINDOWS = {
  perfect: 100,
  great: 200,
  good: 350,
};

const POINTS = { perfect: 100, great: 75, good: 50, miss: 0 };

function comboMultiplier(combo: number): number {
  if (combo >= 50) return 2.0;
  if (combo >= 25) return 1.5;
  if (combo >= 10) return 1.2;
  return 1.0;
}

function calculateStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 0.85) return 3;
  if (accuracy >= 0.65) return 2;
  if (accuracy >= 0.35) return 1;
  return 0;
}

export function useScoring(notes: Note[], timeRef: React.RefObject<number>) {
  const hitsRef = useRef<NoteHit[]>([]);
  const matchedRef = useRef<Set<number>>(new Set());
  const hitNotesRef = useRef<Set<number>>(new Set());
  const missedNotesRef = useRef<Set<number>>(new Set());
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const scoreRef = useRef(0);
  const lastRatingRef = useRef<{ rating: string; time: number } | null>(null);

  const reset = useCallback(() => {
    hitsRef.current = [];
    matchedRef.current.clear();
    hitNotesRef.current.clear();
    missedNotesRef.current.clear();
    comboRef.current = 0;
    maxComboRef.current = 0;
    scoreRef.current = 0;
    lastRatingRef.current = null;
  }, []);

  const onNoteDetected = useCallback(
    (midiNote: number) => {
      const currentTime = (timeRef.current ?? 0) * 1000;

      let bestIdx = -1;
      let bestDelta = Infinity;

      for (let i = 0; i < notes.length; i++) {
        if (matchedRef.current.has(i)) continue;
        const noteTimeMs = notes[i].startTime * 1000;
        const delta = Math.abs(noteTimeMs - currentTime);
        if (delta > TIMING_WINDOWS.good) continue;
        if (notes[i].midi !== midiNote) continue;
        if (delta < bestDelta) {
          bestDelta = delta;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) return;

      const delta = notes[bestIdx].startTime * 1000 - currentTime;
      let rating: NoteHit['rating'];
      if (Math.abs(delta) <= TIMING_WINDOWS.perfect) rating = 'perfect';
      else if (Math.abs(delta) <= TIMING_WINDOWS.great) rating = 'great';
      else rating = 'good';

      matchedRef.current.add(bestIdx);
      hitNotesRef.current.add(bestIdx);
      comboRef.current++;
      if (comboRef.current > maxComboRef.current) {
        maxComboRef.current = comboRef.current;
      }
      scoreRef.current += POINTS[rating] * comboMultiplier(comboRef.current);

      const hit: NoteHit = { noteIndex: bestIdx, timingDeltaMs: delta, rating };
      hitsRef.current.push(hit);
      lastRatingRef.current = { rating, time: performance.now() };
    },
    [notes, timeRef],
  );

  const checkMisses = useCallback(() => {
    const currentTime = (timeRef.current ?? 0) * 1000;

    for (let i = 0; i < notes.length; i++) {
      if (matchedRef.current.has(i)) continue;
      if (missedNotesRef.current.has(i)) continue;
      const noteTimeMs = notes[i].startTime * 1000;
      if (noteTimeMs + TIMING_WINDOWS.good < currentTime) {
        missedNotesRef.current.add(i);
        matchedRef.current.add(i);
        comboRef.current = 0;
        hitsRef.current.push({
          noteIndex: i,
          timingDeltaMs: currentTime - noteTimeMs,
          rating: 'miss',
        });
      }
    }
  }, [notes, timeRef]);

  const getResults = useCallback((): SongScore => {
    const hits = hitsRef.current;
    const breakdown = { perfect: 0, great: 0, good: 0, miss: 0 };
    for (const h of hits) breakdown[h.rating]++;
    const totalScored = breakdown.perfect + breakdown.great + breakdown.good;
    const totalNotes = notes.length;
    const accuracy = totalNotes > 0 ? totalScored / totalNotes : 0;

    return {
      songId: '',
      timestamp: Date.now(),
      totalNotes,
      hits: breakdown,
      maxCombo: maxComboRef.current,
      accuracy,
      stars: calculateStars(accuracy),
    };
  }, [notes]);

  return {
    onNoteDetected,
    checkMisses,
    reset,
    getResults,
    hitNotes: hitNotesRef,
    missedNotes: missedNotesRef,
    comboRef,
    scoreRef,
    lastRatingRef,
  };
}
