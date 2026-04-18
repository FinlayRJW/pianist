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

const C3 = 48, E3 = 52, G3 = 55, A3 = 57, B3 = 59;
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71, C5 = 72;

// Middle C March — just C repeated in a simple rhythm
createMidi('Middle C March', 90, melody(
  [C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4, C4],
  [1,  1,  2,  1,  1,  2,  1,  1,  1,  1,  2,  1,  1,  1,  1,  2],
  90,
));

// C Scale Climb
createMidi('C Scale Climb', 80, melody(
  [C4, D4, E4, F4, G4, A4, B4, C5, C5, B4, A4, G4, F4, E4, D4, C4],
  [1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  2],
  80,
));

// Mary Had a Little Lamb
createMidi('Mary Had a Little Lamb', 100, melody(
  [E4, D4, C4, D4, E4, E4, E4, D4, D4, D4, E4, G4, G4,
   E4, D4, C4, D4, E4, E4, E4, E4, D4, D4, E4, D4, C4],
  [1,  1,  1,  1,  1,  1,  2,  1,  1,  2,  1,  1,  2,
   1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2],
  100,
));

// Twinkle Twinkle Little Star
createMidi('Twinkle Twinkle', 100, melody(
  [C4, C4, G4, G4, A4, A4, G4,  F4, F4, E4, E4, D4, D4, C4,
   G4, G4, F4, F4, E4, E4, D4,  G4, G4, F4, F4, E4, E4, D4,
   C4, C4, G4, G4, A4, A4, G4,  F4, F4, E4, E4, D4, D4, C4],
  [1,  1,  1,  1,  1,  1,  2,   1,  1,  1,  1,  1,  1,  2,
   1,  1,  1,  1,  1,  1,  2,   1,  1,  1,  1,  1,  1,  2,
   1,  1,  1,  1,  1,  1,  2,   1,  1,  1,  1,  1,  1,  2],
  100,
));

// Ode to Joy (right hand)
createMidi('Ode to Joy', 108, melody(
  [E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, E4, D4, D4,
   E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, D4, C4, C4],
  [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1.5,0.5,2,
   1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1.5,0.5,2],
  108,
));

// Simple Chords — C, Am, F, G progression with block chords
{
  const bpm = 80;
  const notes: SimpleNote[] = [];

  function chord(midis: number[], beat: number, dur: number) {
    for (const midi of midis) {
      notes.push({
        midi,
        time: beatsToTime(beat, bpm),
        duration: beatsToTime(dur * 0.9, bpm),
        velocity: 75,
      });
    }
  }

  // 4 repetitions of C - Am - F - G (each chord = 2 beats)
  for (let rep = 0; rep < 4; rep++) {
    const offset = rep * 8;
    chord([C4, E4, G4], offset,     2);  // C major
    chord([A3, C4, E4], offset + 2, 2);  // A minor
    chord([F4, A4, C5], offset + 4, 2);  // F major (higher voicing)
    chord([G3, B3, D4], offset + 6, 2);  // G major
  }

  createMidi('Simple Chords', bpm, notes);
}

console.log('Done! All MIDI files generated.');
