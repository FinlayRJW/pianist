import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'midi', 'beginner');

interface SimpleNote {
  midi: number;
  time: number;
  duration: number;
  velocity?: number;
}

function createMidi(name: string, bpm: number, notes: SimpleNote[]): void {
  const midi = new Midi();
  midi.header.setTempo(bpm);
  midi.header.name = name;

  const track = midi.addTrack();
  track.name = 'Right Hand';

  for (const n of notes) {
    track.addNote({
      midi: n.midi,
      time: n.time,
      duration: n.duration,
      velocity: (n.velocity ?? 80) / 127,
    });
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const filename = name.toLowerCase().replace(/\s+/g, '-') + '.mid';
  writeFileSync(join(OUT_DIR, filename), Buffer.from(midi.toArray()));
  console.log(`Generated: ${filename}`);
}

function beatsToTime(beat: number, bpm: number): number {
  return (beat * 60) / bpm;
}

function melody(midiNotes: number[], rhythm: number[], bpm: number, velocity = 80): SimpleNote[] {
  const notes: SimpleNote[] = [];
  let beat = 0;
  for (let i = 0; i < midiNotes.length; i++) {
    const dur = rhythm[i] ?? 1;
    if (midiNotes[i] > 0) {
      notes.push({
        midi: midiNotes[i],
        time: beatsToTime(beat, bpm),
        duration: beatsToTime(dur * 0.9, bpm),
        velocity,
      });
    }
    beat += dur;
  }
  return notes;
}

const G3 = 55;
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71, C5 = 72;

// ── Middle C March ─────────────────────────────────────────
// Tutorial: C4 in various rhythms. 64 beats at 90 BPM ≈ 43s
createMidi('Middle C March', 90, melody(
  [
    // A: steady quarter-note march
    C4, C4, C4, C4, C4, C4, C4,  C4, C4, C4, C4, C4, C4, C4,
    // B: half notes
    C4, C4, C4, C4, C4, C4, C4, C4,
    // C: mixed with eighth notes
    C4, C4, C4,  C4, C4, C4,  C4, C4, C4, C4, C4, C4, C4, C4,  C4, C4,
    // D: ending
    C4, C4, C4, C4,  C4, C4, C4,  C4, C4, C4,  C4, C4,
  ],
  [
    // A: |q q q q|q q h|q q q q|q q h| (16 beats)
    1, 1, 1, 1,  1, 1, 2,  1, 1, 1, 1,  1, 1, 2,
    // B: |h h|h h|h h|h h| (16 beats)
    2, 2,  2, 2,  2, 2,  2, 2,
    // C: |q q h|q q h|e e e e e e e e|h h| (16 beats)
    1, 1, 2,  1, 1, 2,  .5, .5, .5, .5, .5, .5, .5, .5,  2, 2,
    // D: |q q q q|h q q|q q h|q W| (16 beats)
    1, 1, 1, 1,  2, 1, 1,  1, 1, 2,  1, 3,
  ],
  90,
));

// ── C Scale Climb ──────────────────────────────────────────
// Scale exercise: up/down at different speeds. 68 beats at 80 BPM ≈ 51s
createMidi('C Scale Climb', 80, melody(
  [
    // Up quarter notes
    C4, D4, E4, F4, G4, A4, B4, C5,
    // Down quarter notes
    C5, B4, A4, G4, F4, E4, D4, C4,
    // Up half notes (slow practice)
    C4, D4, E4, F4, G4, A4, B4, C5,
    // Down half notes
    C5, B4, A4, G4, F4, E4, D4, C4,
    // Quick up and down finale
    C4, D4, E4, F4, G4, A4, B4, C5,  C5, B4, A4, G4, F4, E4, D4, C4,
  ],
  [
    // Up (9 beats)
    1, 1, 1, 1, 1, 1, 1, 2,
    // Down (9 beats)
    1, 1, 1, 1, 1, 1, 1, 2,
    // Up slow (16 beats)
    2, 2, 2, 2, 2, 2, 2, 2,
    // Down slow (16 beats)
    2, 2, 2, 2, 2, 2, 2, 2,
    // Quick finale (18 beats)
    1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 3,
  ],
  80,
));

// ── Mary Had a Little Lamb ─────────────────────────────────
// Full song, 3 verses. 90 beats at 100 BPM ≈ 54s
const maryNotes = [
  E4, D4, C4, D4, E4, E4, E4, D4, D4, D4, E4, G4, G4,
  E4, D4, C4, D4, E4, E4, E4, E4, D4, D4, E4, D4, C4,
];
const maryRhythm = [
  1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
];

createMidi('Mary Had a Little Lamb', 100, melody(
  [...maryNotes, ...maryNotes, ...maryNotes],
  [...maryRhythm, ...maryRhythm, ...maryRhythm],
  100,
));

// ── Twinkle Twinkle Little Star ────────────────────────────
// Full verse (AABBA) played twice. 96 beats at 100 BPM ≈ 58s
const twinkleNotes = [
  C4, C4, G4, G4, A4, A4, G4,  F4, F4, E4, E4, D4, D4, C4,
  G4, G4, F4, F4, E4, E4, D4,  G4, G4, F4, F4, E4, E4, D4,
  C4, C4, G4, G4, A4, A4, G4,  F4, F4, E4, E4, D4, D4, C4,
];
const twinkleRhythm = [
  1, 1, 1, 1, 1, 1, 2,  1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 2,  1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 2,  1, 1, 1, 1, 1, 1, 2,
];

createMidi('Twinkle Twinkle', 100, melody(
  [...twinkleNotes, ...twinkleNotes],
  [...twinkleRhythm, ...twinkleRhythm],
  100,
));

// ── Ode to Joy ─────────────────────────────────────────────
// Full AABA' theme, played twice. 128 beats at 108 BPM ≈ 71s
const odeA = {
  notes:  [E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, E4, D4, D4],
  rhythm: [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1.5, 0.5, 2],
};
const odeA2 = {
  notes:  [E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, D4, C4, C4],
  rhythm: [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1.5, 0.5, 2],
};
const odeB = {
  notes:  [D4, D4, E4, C4, D4, E4, F4, E4, C4, D4, E4, F4, E4, D4, C4, D4, G3],
  rhythm: [1,  1,  1,  1,  .5, .5, 1,  1,  1,  .5, .5, 1,  1,  1,  1,  1,  2],
};

const odeThemeNotes = [...odeA.notes, ...odeA2.notes, ...odeB.notes, ...odeA2.notes];
const odeThemeRhythm = [...odeA.rhythm, ...odeA2.rhythm, ...odeB.rhythm, ...odeA2.rhythm];

createMidi('Ode to Joy', 108, melody(
  [...odeThemeNotes, ...odeThemeNotes],
  [...odeThemeRhythm, ...odeThemeRhythm],
  108,
));

console.log('Done! All MIDI files generated.');
