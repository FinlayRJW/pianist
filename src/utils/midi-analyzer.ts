import { Midi } from '@tonejs/midi';

export interface MidiAnalysis {
  bpm: number;
  durationSec: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  keySignature?: string;
  timeSignature?: [number, number];
  noteCount: number;
  trackCount: number;
}

export function analyzeMidi(arrayBuffer: ArrayBuffer): MidiAnalysis {
  const midi = new Midi(arrayBuffer);

  const allNotes: { midi: number; time: number; duration: number }[] = [];
  for (const track of midi.tracks) {
    for (const note of track.notes) {
      allNotes.push({ midi: note.midi, time: note.time, duration: note.duration });
    }
  }
  allNotes.sort((a, b) => a.time - b.time);

  const lastNote = allNotes[allNotes.length - 1];
  const durationSec = lastNote ? Math.round(lastNote.time + lastNote.duration) : 0;

  const bpm = midi.header.tempos.length > 0 ? Math.round(midi.header.tempos[0].bpm) : 120;

  const ts = midi.header.timeSignatures[0];
  const timeSignature: [number, number] | undefined = ts
    ? [ts.timeSignature[0], ts.timeSignature[1]]
    : undefined;

  const ks = midi.header.keySignatures[0];
  const keySignature = ks ? ks.key : undefined;

  const difficulty = computeDifficulty(allNotes, durationSec, bpm);

  return {
    bpm,
    durationSec,
    difficulty,
    keySignature,
    timeSignature,
    noteCount: allNotes.length,
    trackCount: midi.tracks.filter(t => t.notes.length > 0).length,
  };
}

function computeDifficulty(
  notes: { midi: number; time: number; duration: number }[],
  durationSec: number,
  bpm: number,
): 1 | 2 | 3 | 4 | 5 {
  if (notes.length === 0 || durationSec === 0) return 1;

  const noteDensity = notes.length / durationSec;

  let minPitch = 127, maxPitch = 0;
  for (const n of notes) {
    if (n.midi < minPitch) minPitch = n.midi;
    if (n.midi > maxPitch) maxPitch = n.midi;
  }
  const pitchRange = maxPitch - minPitch;

  let totalInterval = 0;
  for (let i = 1; i < notes.length; i++) {
    totalInterval += Math.abs(notes[i].midi - notes[i - 1].midi);
  }
  const avgInterval = notes.length > 1 ? totalInterval / (notes.length - 1) : 0;

  let maxPolyphony = 1;
  for (let i = 0; i < notes.length; i++) {
    let count = 1;
    for (let j = i + 1; j < notes.length && notes[j].time - notes[i].time < 0.05; j++) {
      count++;
    }
    if (count > maxPolyphony) maxPolyphony = count;
  }

  const score =
    (Math.min(noteDensity / 12, 1) * 25) +
    (Math.min(pitchRange / 60, 1) * 15) +
    (Math.min(avgInterval / 12, 1) * 15) +
    (Math.min(maxPolyphony / 8, 1) * 20) +
    (Math.min(bpm / 180, 1) * 10) +
    15;

  if (score < 30) return 1;
  if (score < 45) return 2;
  if (score < 60) return 3;
  if (score < 75) return 4;
  return 5;
}
