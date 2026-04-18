import type { Note, QuantizedNote, RestData, MeasureData } from '../types';

const DURATION_MAP: [number, string][] = [
  [4, 'w'],
  [3, 'hd'],
  [2, 'h'],
  [1.5, 'qd'],
  [1, 'q'],
  [0.75, '8d'],
  [0.5, '8'],
  [0.25, '16'],
];

export function durationToVexflow(beats: number): string {
  for (const [dur, vf] of DURATION_MAP) {
    if (Math.abs(beats - dur) < 0.05) return vf;
  }
  if (beats >= 3.5) return 'w';
  if (beats >= 2.5) return 'hd';
  if (beats >= 1.75) return 'h';
  if (beats >= 1.25) return 'qd';
  if (beats >= 0.875) return 'q';
  if (beats >= 0.625) return '8d';
  if (beats >= 0.375) return '8';
  return '16';
}

const PITCH_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function midiToVexflowPitch(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = midi % 12;
  return `${PITCH_NAMES[pitchClass]}/${octave}`;
}

const KEY_SIGNATURE_SHARPS: Record<string, Set<number>> = {
  C: new Set(),
  G: new Set([6]),
  D: new Set([6, 1]),
  A: new Set([6, 1, 8]),
  E: new Set([6, 1, 8, 3]),
  F: new Set([10]),
  Bb: new Set([10, 3]),
  Eb: new Set([10, 3, 8]),
};

export function quantizeToNotation(
  notes: Note[],
  bpm: number,
  timeSignature: [number, number] = [4, 4],
  _keySignature: string = 'C',
): MeasureData[] {
  const beatsPerMeasure = timeSignature[0] * (4 / timeSignature[1]);

  const quantized: QuantizedNote[] = notes.map((note) => {
    const beat = (note.startTime * bpm) / 60;
    const durBeats = (note.duration * bpm) / 60;
    const qBeat = Math.round(beat * 4) / 4;
    const qDur = Math.max(0.25, Math.round(durBeats * 4) / 4);
    return {
      midi: note.midi,
      beat: qBeat,
      durationBeats: qDur,
      track: note.track,
    };
  });

  const splitNotes: QuantizedNote[] = [];
  for (const note of quantized) {
    const measureStart = Math.floor(note.beat / beatsPerMeasure) * beatsPerMeasure;
    const measureEnd = measureStart + beatsPerMeasure;
    if (note.beat + note.durationBeats > measureEnd + 0.01) {
      const firstPart = measureEnd - note.beat;
      if (firstPart >= 0.25) {
        splitNotes.push({ ...note, durationBeats: firstPart });
      }
      let remaining = note.durationBeats - firstPart;
      let currentBeat = measureEnd;
      while (remaining > 0.01) {
        const thisPart = Math.min(remaining, beatsPerMeasure);
        splitNotes.push({ ...note, beat: currentBeat, durationBeats: Math.max(0.25, Math.round(thisPart * 4) / 4) });
        remaining -= thisPart;
        currentBeat += thisPart;
      }
    } else {
      splitNotes.push(note);
    }
  }

  const maxBeat = splitNotes.reduce((max, n) => Math.max(max, n.beat + n.durationBeats), 0);
  const measureCount = Math.max(1, Math.ceil(maxBeat / beatsPerMeasure));

  const measures: MeasureData[] = [];
  for (let m = 0; m < measureCount; m++) {
    const mStart = m * beatsPerMeasure;
    const mEnd = mStart + beatsPerMeasure;

    const measureNotes = splitNotes.filter(
      (n) => n.beat >= mStart - 0.01 && n.beat < mEnd - 0.01,
    );

    const trebleNotes = measureNotes
      .filter((n) => n.midi >= 60 || n.track === 0)
      .map((n) => ({ ...n, beat: n.beat - mStart }));
    const bassNotes = measureNotes
      .filter((n) => n.midi < 60 && n.track !== 0)
      .map((n) => ({ ...n, beat: n.beat - mStart }));

    const trebleRests = inferRests(trebleNotes, beatsPerMeasure);
    const bassRests = inferRests(bassNotes, beatsPerMeasure);

    measures.push({
      number: m + 1,
      trebleNotes,
      bassNotes,
      trebleRests,
      bassRests,
    });
  }

  return measures;
}

function inferRests(notes: QuantizedNote[], beatsPerMeasure: number): RestData[] {
  const rests: RestData[] = [];
  const sorted = [...notes].sort((a, b) => a.beat - b.beat);

  let cursor = 0;
  for (const note of sorted) {
    if (note.beat > cursor + 0.01) {
      const gap = note.beat - cursor;
      rests.push(...splitRestDuration(cursor, gap));
    }
    cursor = Math.max(cursor, note.beat + note.durationBeats);
  }

  if (cursor < beatsPerMeasure - 0.01) {
    rests.push(...splitRestDuration(cursor, beatsPerMeasure - cursor));
  }

  return rests;
}

function splitRestDuration(beat: number, duration: number): RestData[] {
  const rests: RestData[] = [];
  let remaining = duration;
  let pos = beat;

  const restValues = [4, 2, 1, 0.5, 0.25];
  while (remaining > 0.01) {
    let bestVal = 0.25;
    for (const rv of restValues) {
      if (rv <= remaining + 0.01) {
        bestVal = rv;
        break;
      }
    }
    rests.push({ beat: pos, durationBeats: bestVal });
    pos += bestVal;
    remaining -= bestVal;
  }

  return rests;
}

let cachedResult: { key: string; data: MeasureData[] } | null = null;

export function quantizeToNotationCached(
  notes: Note[],
  bpm: number,
  timeSignature?: [number, number],
  keySignature?: string,
): MeasureData[] {
  const key = `${notes.length}-${bpm}-${notes[0]?.startTime ?? 0}-${notes[notes.length - 1]?.startTime ?? 0}`;
  if (cachedResult?.key === key) return cachedResult.data;
  const data = quantizeToNotation(notes, bpm, timeSignature, keySignature);
  cachedResult = { key, data };
  return data;
}
