import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

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

interface SongData {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  rightHand: { notes: number[]; rhythm: number[] };
  leftHand?: { notes: number[]; rhythm: number[] };
}

function generateMidi(song: SongData): void {
  const midi = new Midi();
  midi.header.setTempo(song.bpm);
  midi.header.name = song.title;

  const rhNotes = melody(song.rightHand.notes, song.rightHand.rhythm, song.bpm);
  const rhTrack = midi.addTrack();
  rhTrack.name = 'Right Hand';
  for (const n of rhNotes) {
    rhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: (n.velocity ?? 80) / 127 });
  }

  if (song.leftHand) {
    const lhNotes = melody(song.leftHand.notes, song.leftHand.rhythm, song.bpm, 70);
    const lhTrack = midi.addTrack();
    lhTrack.name = 'Left Hand';
    for (const n of lhNotes) {
      lhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: (n.velocity ?? 70) / 127 });
    }
  }

  const outDir = join(PUBLIC_DIR, song.genre);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${song.id}.mid`), Buffer.from(midi.toArray()));
  console.log(`  ✓ ${song.genre}/${song.id}.mid`);
}

// ============================================================
// BEGINNER SONGS
// ============================================================

const beginnerSongs: SongData[] = [
  {
    id: 'middle-c-march', title: 'Middle C March', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [60, 60, 60, 60, 60, 60, 60, 60, 62, 62, 62, 62, 60, 60, 60, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'c-scale-climb', title: 'C Scale Climb', genre: 'beginner', bpm: 80,
    rightHand: {
      notes: [60, 62, 64, 65, 67, 69, 71, 72, 72, 71, 69, 67, 65, 64, 62, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'hot-cross-buns', title: 'Hot Cross Buns', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [64, 62, 60, 0, 64, 62, 60, 0, 60, 60, 60, 60, 62, 62, 62, 62, 64, 62, 60, 0],
      rhythm: [1, 1, 2, 1, 1, 1, 2, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 2, 1],
    },
  },
  {
    id: 'mary-had-a-little-lamb', title: 'Mary Had a Little Lamb', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [64, 62, 60, 62, 64, 64, 64, 0, 62, 62, 62, 0, 64, 67, 67, 0, 64, 62, 60, 62, 64, 64, 64, 64, 62, 62, 64, 62, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'london-bridge', title: 'London Bridge', genre: 'beginner', bpm: 110,
    rightHand: {
      notes: [67, 69, 67, 65, 64, 65, 67, 0, 62, 64, 65, 0, 64, 65, 67, 0, 67, 69, 67, 65, 64, 65, 67, 0, 62, 0, 67, 0, 64, 0, 60],
      rhythm: [1.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 0.5, 1, 0.5, 1, 0.5, 2],
    },
  },
  {
    id: 'twinkle-twinkle', title: 'Twinkle Twinkle Little Star', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [60, 60, 67, 67, 69, 69, 67, 0, 65, 65, 64, 64, 62, 62, 60, 0, 67, 67, 65, 65, 64, 64, 62, 0, 67, 67, 65, 65, 64, 64, 62, 0, 60, 60, 67, 67, 69, 69, 67, 0, 65, 65, 64, 64, 62, 62, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'jingle-bells', title: 'Jingle Bells', genre: 'beginner', bpm: 110,
    rightHand: {
      notes: [64, 64, 64, 0, 64, 64, 64, 0, 64, 67, 60, 62, 64, 0, 65, 65, 65, 65, 65, 64, 64, 64, 64, 62, 62, 64, 62, 0, 67],
      rhythm: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'happy-birthday', title: 'Happy Birthday', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [60, 60, 62, 60, 65, 64, 0, 60, 60, 62, 60, 67, 65, 0, 60, 60, 72, 69, 65, 64, 62, 0, 70, 70, 69, 65, 67, 65],
      rhythm: [0.75, 0.25, 1, 1, 1, 2, 1, 0.75, 0.25, 1, 1, 1, 2, 1, 0.75, 0.25, 1, 1, 1, 1, 2, 1, 0.75, 0.25, 1, 1, 1, 2],
    },
  },
  {
    id: 'row-row-row', title: 'Row Row Row Your Boat', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [60, 0, 60, 0, 60, 62, 64, 0, 64, 62, 64, 65, 67, 0, 72, 72, 72, 67, 67, 67, 64, 64, 64, 60, 60, 60, 67, 65, 64, 62, 60],
      rhythm: [1, 0.5, 1, 0.5, 0.75, 0.25, 1, 0.5, 0.75, 0.25, 0.75, 0.25, 2, 1, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.75, 0.25, 0.75, 0.25, 2],
    },
  },
  {
    id: 'baa-baa-black-sheep', title: 'Baa Baa Black Sheep', genre: 'beginner', bpm: 95,
    rightHand: {
      notes: [60, 60, 67, 67, 69, 69, 67, 0, 65, 65, 64, 64, 62, 62, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'g-scale-exercise', title: 'G Scale Exercise', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [67, 69, 71, 72, 74, 76, 78, 79, 79, 78, 76, 74, 72, 71, 69, 67],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'ode-to-joy', title: 'Ode to Joy', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62, 0, 64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 62, 60, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2],
    },
  },
  {
    id: 'd-scale-exercise', title: 'D Scale Exercise', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [62, 64, 66, 67, 69, 71, 73, 74, 74, 73, 71, 69, 67, 66, 64, 62],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'f-scale-exercise', title: 'F Scale Exercise', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [65, 67, 69, 70, 72, 74, 76, 77, 77, 76, 74, 72, 70, 69, 67, 65],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'a-minor-scale', title: 'A Minor Scale', genre: 'beginner', bpm: 85,
    rightHand: {
      notes: [57, 59, 60, 62, 64, 65, 67, 69, 69, 67, 65, 64, 62, 60, 59, 57],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'frere-jacques', title: 'Frère Jacques', genre: 'beginner', bpm: 110,
    rightHand: {
      notes: [60, 62, 64, 60, 60, 62, 64, 60, 64, 65, 67, 0, 64, 65, 67, 0, 67, 69, 67, 65, 64, 60, 67, 69, 67, 65, 64, 60, 60, 55, 60, 0, 60, 55, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 2],
    },
  },
  {
    id: 'old-macdonald', title: 'Old MacDonald', genre: 'beginner', bpm: 110,
    rightHand: {
      notes: [67, 67, 67, 64, 65, 65, 64, 0, 62, 62, 60, 62, 64, 67, 0, 67, 67, 67, 64, 65, 65, 64, 0, 62, 62, 60, 62, 64, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'yankee-doodle', title: 'Yankee Doodle', genre: 'beginner', bpm: 120,
    rightHand: {
      notes: [60, 60, 62, 64, 60, 64, 62, 55, 60, 60, 62, 64, 60, 0, 59, 0, 60, 60, 62, 64, 65, 64, 62, 60, 59, 55, 57, 59, 60, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    },
  },
  {
    id: 'camptown-races', title: 'Camptown Races', genre: 'beginner', bpm: 120,
    rightHand: {
      notes: [67, 67, 64, 67, 69, 67, 64, 62, 64, 67, 67, 64, 67, 69, 67, 0, 64, 62, 64, 67, 64, 62, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 2, 1, 1, 1, 2],
    },
  },
  {
    id: 'skip-to-my-lou', title: 'Skip to My Lou', genre: 'beginner', bpm: 115,
    rightHand: {
      notes: [65, 65, 67, 67, 69, 69, 67, 0, 65, 65, 64, 64, 62, 0, 65, 65, 67, 67, 69, 69, 67, 0, 65, 64, 62, 64, 65],
      rhythm: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'this-old-man', title: 'This Old Man', genre: 'beginner', bpm: 110,
    rightHand: {
      notes: [64, 62, 64, 0, 64, 62, 64, 65, 67, 0, 60, 60, 60, 60, 62, 64, 62, 60, 62, 64, 0, 60],
      rhythm: [1, 1, 1, 0.5, 1, 1, 1, 1, 2, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 2],
    },
  },
  {
    id: 'aura-lee', title: 'Aura Lee', genre: 'beginner', bpm: 90,
    rightHand: {
      notes: [64, 64, 65, 67, 67, 65, 64, 67, 69, 69, 67, 65, 64, 62, 60, 0, 64, 64, 65, 67, 67, 65, 64, 67, 69, 69, 67, 65, 64, 62, 64, 60],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'lightly-row', title: 'Lightly Row', genre: 'beginner', bpm: 100,
    rightHand: {
      notes: [67, 64, 64, 0, 65, 62, 62, 0, 60, 62, 64, 65, 67, 67, 67, 0, 67, 64, 64, 64, 65, 62, 62, 62, 60, 64, 67, 67, 64],
      rhythm: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
  {
    id: 'lavenders-blue', title: "Lavender's Blue", genre: 'beginner', bpm: 95,
    rightHand: {
      notes: [67, 65, 64, 62, 64, 65, 67, 67, 67, 0, 69, 67, 65, 64, 62, 60, 60, 62, 64, 0, 67, 65, 64, 62, 64, 65, 67, 67, 67, 65, 64, 62, 60],
      rhythm: [2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    },
  },
  {
    id: 'simple-chords-c', title: 'Simple Chords in C', genre: 'beginner', bpm: 80,
    rightHand: {
      notes: [60, 64, 67, 60, 64, 67, 60, 65, 69, 60, 65, 69, 60, 64, 67, 55, 59, 62, 60, 64, 67, 60, 64, 67],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
    leftHand: {
      notes: [48, 0, 0, 48, 0, 0, 53, 0, 0, 53, 0, 0, 48, 0, 0, 43, 0, 0, 48, 0, 0, 48, 0, 0],
      rhythm: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    },
  },
];

// ============================================================
// MAIN: Generate beginner songs only
// ============================================================

mkdirSync(join(PUBLIC_DIR, 'beginner'), { recursive: true });

console.log(`Generating ${beginnerSongs.length} beginner songs from note arrays...\n`);

for (const song of beginnerSongs) {
  generateMidi(song);
}

console.log(`\nDone! ${beginnerSongs.length} MIDI files generated.`);
console.log(`\nNote: Other genres use real MIDI files from download scripts.`);
console.log(`Run: npx tsx scripts/download-all-midis.ts`);
console.log(`Run: npx tsx scripts/download-maestro.ts`);
