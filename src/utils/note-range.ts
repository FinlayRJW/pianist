import type { Note, NoteRange } from '../types';
import { PIANO_FIRST_MIDI, PIANO_LAST_MIDI } from '../canvas/constants';
import { isBlackKey } from '../canvas/PianoKeyRenderer';

const MIN_SEMITONES = 24;
const PAD_SEMITONES = 5;

export function computeSongRange(notes: Note[]): NoteRange {
  if (notes.length === 0) {
    return { firstMidi: PIANO_FIRST_MIDI, lastMidi: PIANO_LAST_MIDI };
  }

  let min = Infinity;
  let max = -Infinity;
  for (const n of notes) {
    if (n.midi < min) min = n.midi;
    if (n.midi > max) max = n.midi;
  }

  min -= PAD_SEMITONES;
  max += PAD_SEMITONES;

  // snap start down to nearest C
  min = Math.floor(min / 12) * 12;
  // snap end up to nearest B
  max = Math.ceil((max + 1) / 12) * 12 - 1;

  const span = max - min + 1;
  if (span < MIN_SEMITONES) {
    const expand = MIN_SEMITONES - span;
    const half = Math.floor(expand / 2);
    min -= half;
    max += expand - half;
    // re-snap after expansion
    min = Math.floor(min / 12) * 12;
    max = Math.ceil((max + 1) / 12) * 12 - 1;
  }

  min = Math.max(min, PIANO_FIRST_MIDI);
  max = Math.min(max, PIANO_LAST_MIDI);

  // ensure we start/end on white keys
  while (min > PIANO_FIRST_MIDI && isBlackKey(min)) min--;
  while (max < PIANO_LAST_MIDI && isBlackKey(max)) max++;

  return { firstMidi: min, lastMidi: max };
}
