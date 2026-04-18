import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import { ALL_SONG_DEFINITIONS } from '../src/data/song-definitions/index.js';
import type { SongDefinition } from '../src/data/song-definitions/types.js';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');

interface SimpleNote {
  midi: number;
  time: number;
  duration: number;
  velocity?: number;
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

function generateFromDefinition(def: SongDefinition): void {
  const midi = new Midi();
  midi.header.setTempo(def.bpm);
  midi.header.name = def.title;

  const rhNotes = melody(def.rightHand.notes, def.rightHand.rhythm, def.bpm);
  const rhTrack = midi.addTrack();
  rhTrack.name = 'Right Hand';
  for (const n of rhNotes) {
    rhTrack.addNote({
      midi: n.midi,
      time: n.time,
      duration: n.duration,
      velocity: (n.velocity ?? 80) / 127,
    });
  }

  if (def.leftHand) {
    const lhNotes = melody(def.leftHand.notes, def.leftHand.rhythm, def.bpm);
    const lhTrack = midi.addTrack();
    lhTrack.name = 'Left Hand';
    for (const n of lhNotes) {
      lhTrack.addNote({
        midi: n.midi,
        time: n.time,
        duration: n.duration,
        velocity: (n.velocity ?? 70) / 127,
      });
    }
  }

  const outDir = join(PUBLIC_DIR, def.genre);
  mkdirSync(outDir, { recursive: true });
  const filename = `${def.id}.mid`;
  writeFileSync(join(outDir, filename), Buffer.from(midi.toArray()));
  console.log(`  ${def.genre}/${filename}`);
}

console.log(`Generating ${ALL_SONG_DEFINITIONS.length} songs...\n`);

for (const def of ALL_SONG_DEFINITIONS) {
  generateFromDefinition(def);
}

console.log(`\nDone! ${ALL_SONG_DEFINITIONS.length} MIDI files generated.`);
