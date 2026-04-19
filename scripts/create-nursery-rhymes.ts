import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const MIDI_DIR = join(ROOT, 'public', 'midi', 'journey');

interface NoteData {
  midi: number;
  time: number;
  duration: number;
}

function createMidi(
  name: string,
  bpm: number,
  timeSignature: [number, number],
  notes: NoteData[],
): void {
  const midi = new Midi();
  midi.header.setTempo(bpm);
  midi.header.timeSignatures = [{ ticks: 0, timeSignature }];
  midi.header.name = name;

  const rh = midi.addTrack();
  rh.name = 'Right Hand';
  rh.channel = 0;
  for (const n of notes) {
    rh.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: 0.7 });
  }

  // Empty left hand track
  const lh = midi.addTrack();
  lh.name = 'Left Hand';
  lh.channel = 1;

  const buf = Buffer.from(midi.toArray());
  const dest = join(MIDI_DIR, `${name}.mid`);
  writeFileSync(dest, buf);
  const check = new Midi(buf);
  const noteCount = check.tracks[0]?.notes.length ?? 0;
  console.log(`  ${name}.mid — ${noteCount} notes, ${buf.length} bytes`);
}

// Quarter note duration in seconds
function q(bpm: number) { return 60 / bpm; }
function h(bpm: number) { return 2 * q(bpm); }
function e(bpm: number) { return q(bpm) / 2; }

// MIDI note numbers
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69;

function buildTwinkle(): NoteData[] {
  const bpm = 100;
  const qn = q(bpm);
  const hn = h(bpm);
  const notes: NoteData[] = [];
  let t = 0;

  const phrase = (pitches: [number, number][]) => {
    for (const [midi, dur] of pitches) {
      notes.push({ midi, time: t, duration: dur * 0.95 });
      t += dur;
    }
  };

  // Twinkle twinkle little star (C C G G A A G-)
  phrase([[C4,qn],[C4,qn],[G4,qn],[G4,qn],[A4,qn],[A4,qn],[G4,hn]]);
  // How I wonder what you are (F F E E D D C-)
  phrase([[F4,qn],[F4,qn],[E4,qn],[E4,qn],[D4,qn],[D4,qn],[C4,hn]]);
  // Up above the world so high (G G F F E E D-)
  phrase([[G4,qn],[G4,qn],[F4,qn],[F4,qn],[E4,qn],[E4,qn],[D4,hn]]);
  // Like a diamond in the sky (G G F F E E D-)
  phrase([[G4,qn],[G4,qn],[F4,qn],[F4,qn],[E4,qn],[E4,qn],[D4,hn]]);
  // Twinkle twinkle little star (C C G G A A G-)
  phrase([[C4,qn],[C4,qn],[G4,qn],[G4,qn],[A4,qn],[A4,qn],[G4,hn]]);
  // How I wonder what you are (F F E E D D C-)
  phrase([[F4,qn],[F4,qn],[E4,qn],[E4,qn],[D4,qn],[D4,qn],[C4,hn]]);

  return notes;
}

function buildHotCrossBuns(): NoteData[] {
  const bpm = 120;
  const qn = q(bpm);
  const hn = h(bpm);
  const en = e(bpm);
  const notes: NoteData[] = [];
  let t = 0;

  const add = (midi: number, dur: number) => {
    notes.push({ midi, time: t, duration: dur * 0.95 });
    t += dur;
  };
  const rest = (dur: number) => { t += dur; };

  // Hot cross buns (E D C-)
  add(E4, qn); add(D4, qn); add(C4, hn);
  // Hot cross buns (E D C-)
  add(E4, qn); add(D4, qn); add(C4, hn);
  // One a penny two a penny (C C C C D D D D)
  add(C4, en); add(C4, en); add(C4, en); add(C4, en);
  add(D4, en); add(D4, en); add(D4, en); add(D4, en);
  // Hot cross buns (E D C-)
  add(E4, qn); add(D4, qn); add(C4, hn);

  return notes;
}

function buildOdeToJoy(): NoteData[] {
  const bpm = 100;
  const qn = q(bpm);
  const hn = h(bpm);
  const dqn = qn * 1.5; // dotted quarter
  const en = e(bpm);
  const notes: NoteData[] = [];
  let t = 0;

  const add = (midi: number, dur: number) => {
    notes.push({ midi, time: t, duration: dur * 0.95 });
    t += dur;
  };

  // Line 1: E E F G | G F E D | C C D E | E. D D-
  add(E4,qn); add(E4,qn); add(F4,qn); add(G4,qn);
  add(G4,qn); add(F4,qn); add(E4,qn); add(D4,qn);
  add(C4,qn); add(C4,qn); add(D4,qn); add(E4,qn);
  add(E4,dqn); add(D4,en); add(D4,hn);

  // Line 2: E E F G | G F E D | C C D E | D. C C-
  add(E4,qn); add(E4,qn); add(F4,qn); add(G4,qn);
  add(G4,qn); add(F4,qn); add(E4,qn); add(D4,qn);
  add(C4,qn); add(C4,qn); add(D4,qn); add(E4,qn);
  add(D4,dqn); add(C4,en); add(C4,hn);

  return notes;
}

mkdirSync(MIDI_DIR, { recursive: true });
console.log('Creating nursery rhyme MIDI files...\n');

createMidi('twinkle-twinkle', 100, [4, 4], buildTwinkle());
createMidi('hot-cross-buns', 120, [4, 4], buildHotCrossBuns());
createMidi('ode-to-joy', 100, [4, 4], buildOdeToJoy());

console.log('\nDone!');
