import { useRef, useCallback, useMemo } from 'react';
import type { Note, NoteHit, SongScore } from '../types';
import { buildChordGroups } from '../utils/chord-groups';

const TIMING = { perfect: 50, great: 100, good: 200 };

const POINTS = { perfect: 100, great: 75, good: 50, miss: 0 };

const SUSTAIN_MIN_DURATION = 0.4;
const SUSTAIN_GRACE = 0.1;

interface SustainCheck {
  midi: number;
  graceTime: number;
  endTime: number;
  pointsAwarded: number;
  penalized: boolean;
}

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

function hasMatchingPitchClass(set: Set<number>, midi: number): boolean {
  const pc = midi % 12;
  for (const n of set) {
    if (n % 12 === pc) return true;
  }
  return false;
}

export function useScoring(
  notes: Note[],
  timeRef: React.RefObject<number>,
  speedRef?: React.RefObject<number>,
  octaveEquivalence: boolean = false,
) {
  const hitsRef = useRef<NoteHit[]>([]);
  const matchedRef = useRef<Set<number>>(new Set());
  const hitNotesRef = useRef<Set<number>>(new Set());
  const missedNotesRef = useRef<Set<number>>(new Set());
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const scoreRef = useRef(0);
  const lastRatingRef = useRef<{ rating: string; time: number } | null>(null);
  const sustainChecksRef = useRef<Map<number, SustainCheck>>(new Map());

  const chordData = useMemo(() => buildChordGroups(notes), [notes]);

  const reset = useCallback(() => {
    hitsRef.current = [];
    matchedRef.current.clear();
    hitNotesRef.current.clear();
    missedNotesRef.current.clear();
    comboRef.current = 0;
    maxComboRef.current = 0;
    scoreRef.current = 0;
    lastRatingRef.current = null;
    sustainChecksRef.current.clear();
  }, []);

  const onNoteDetected = useCallback(
    (midiNote: number) => {
      const currentTime = (timeRef.current ?? 0) * 1000;
      const { groups, noteToGroup } = chordData;

      let bestIdx = -1;
      let bestDelta = Infinity;

      for (let i = 0; i < notes.length; i++) {
        if (matchedRef.current.has(i)) continue;
        const noteTimeMs = notes[i].startTime * 1000;
        const delta = Math.abs(noteTimeMs - currentTime);
        if (delta > TIMING.good) continue;

        let midiMatch = octaveEquivalence
          ? (notes[i].midi % 12 === midiNote % 12)
          : (notes[i].midi === midiNote);
        if (!midiMatch) {
          const groupIdx = noteToGroup.get(i);
          if (groupIdx !== undefined) {
            if (octaveEquivalence) {
              const pc = midiNote % 12;
              for (const m of groups[groupIdx].midiNotes) {
                if (m % 12 === pc) { midiMatch = true; break; }
              }
            } else {
              midiMatch = groups[groupIdx].midiNotes.has(midiNote);
            }
          }
        }
        if (!midiMatch) continue;

        if (delta < bestDelta) {
          bestDelta = delta;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) {
        comboRef.current = 0;
        lastRatingRef.current = { rating: 'miss', time: performance.now() };
        return;
      }

      const delta = notes[bestIdx].startTime * 1000 - currentTime;
      let rating: NoteHit['rating'];
      if (Math.abs(delta) <= TIMING.perfect) rating = 'perfect';
      else if (Math.abs(delta) <= TIMING.great) rating = 'great';
      else rating = 'good';

      const speedMul = speedRef?.current ?? 1;

      const groupIdx = noteToGroup.get(bestIdx);
      const indicesToMark = (groupIdx !== undefined)
        ? groups[groupIdx].noteIndices.filter(ni => !matchedRef.current.has(ni))
        : [bestIdx];

      for (const ni of indicesToMark) {
        matchedRef.current.add(ni);
        hitNotesRef.current.add(ni);
        comboRef.current++;
        if (comboRef.current > maxComboRef.current) {
          maxComboRef.current = comboRef.current;
        }
        const pts = POINTS[rating] * comboMultiplier(comboRef.current) * speedMul;
        scoreRef.current += pts;
        hitsRef.current.push({ noteIndex: ni, timingDeltaMs: delta, rating });

        const noteDur = notes[ni].duration;
        if (noteDur > SUSTAIN_MIN_DURATION) {
          sustainChecksRef.current.set(ni, {
            midi: notes[ni].midi,
            graceTime: notes[ni].startTime + SUSTAIN_GRACE,
            endTime: notes[ni].startTime + noteDur,
            pointsAwarded: pts,
            penalized: false,
          });
        }
      }

      lastRatingRef.current = { rating, time: performance.now() };
    },
    [notes, timeRef, chordData, octaveEquivalence],
  );

  const checkMisses = useCallback(() => {
    const currentTime = (timeRef.current ?? 0) * 1000;
    const { groups, noteToGroup } = chordData;
    const processedGroups = new Set<number>();

    for (let i = 0; i < notes.length; i++) {
      if (matchedRef.current.has(i)) continue;
      if (missedNotesRef.current.has(i)) continue;
      const noteTimeMs = notes[i].startTime * 1000;
      if (noteTimeMs + TIMING.good < currentTime) {
        const groupIdx = noteToGroup.get(i);
        if (groupIdx !== undefined && !processedGroups.has(groupIdx)) {
          processedGroups.add(groupIdx);
          const group = groups[groupIdx];
          for (const ni of group.noteIndices) {
            if (!matchedRef.current.has(ni) && !missedNotesRef.current.has(ni)) {
              missedNotesRef.current.add(ni);
              matchedRef.current.add(ni);
              hitsRef.current.push({
                noteIndex: ni,
                timingDeltaMs: currentTime - notes[ni].startTime * 1000,
                rating: 'miss',
              });
            }
          }
          comboRef.current = 0;
        } else if (groupIdx === undefined) {
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
    }
  }, [notes, timeRef, chordData]);

  const penalizeSustain = useCallback((noteIdx: number, check: SustainCheck) => {
    check.penalized = true;
    scoreRef.current -= check.pointsAwarded;
    if (scoreRef.current < 0) scoreRef.current = 0;
    hitNotesRef.current.delete(noteIdx);
    missedNotesRef.current.add(noteIdx);
    const hitRecord = hitsRef.current.find(h => h.noteIndex === noteIdx);
    if (hitRecord) hitRecord.rating = 'miss';
    comboRef.current = 0;
    lastRatingRef.current = { rating: 'miss', time: performance.now() };
  }, []);

  const checkSustain = useCallback((activeNotes: Set<number>) => {
    const currentTime = timeRef.current ?? 0;
    const checks = sustainChecksRef.current;

    for (const [noteIdx, check] of checks) {
      if (currentTime > check.endTime) {
        checks.delete(noteIdx);
        continue;
      }
      if (check.penalized) continue;
      if (currentTime < check.graceTime) continue;

      const held = octaveEquivalence
        ? hasMatchingPitchClass(activeNotes, check.midi)
        : activeNotes.has(check.midi);
      if (!held) {
        penalizeSustain(noteIdx, check);
      }
    }
  }, [timeRef, penalizeSustain, octaveEquivalence]);

  const onNoteReleased = useCallback((midiNote: number) => {
    const currentTime = timeRef.current ?? 0;
    const checks = sustainChecksRef.current;

    for (const [noteIdx, check] of checks) {
      if (octaveEquivalence) {
        if (check.midi % 12 !== midiNote % 12) continue;
      } else {
        if (check.midi !== midiNote) continue;
      }
      if (check.penalized) continue;
      if (currentTime < check.graceTime) continue;
      if (currentTime > check.endTime) continue;
      penalizeSustain(noteIdx, check);
    }
  }, [timeRef, penalizeSustain, octaveEquivalence]);

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
    onNoteReleased,
    checkMisses,
    checkSustain,
    reset,
    getResults,
    hitNotes: hitNotesRef,
    missedNotes: missedNotesRef,
    comboRef,
    scoreRef,
    lastRatingRef,
  };
}
