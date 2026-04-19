import type { NoteRange } from '../types';
import {
  PIANO_FIRST_MIDI,
  PIANO_LAST_MIDI,
  BLACK_KEY_WIDTH_RATIO,
} from './constants';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_NOTES = new Set([1, 3, 6, 8, 10]);

export function isBlackKey(midi: number): boolean {
  return BLACK_NOTES.has(midi % 12);
}

export function getNoteName(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

export function getPitchLetter(midi: number): string {
  return NOTE_NAMES[midi % 12];
}

export interface KeyLayout {
  midi: number;
  x: number;
  width: number;
  isBlack: boolean;
}

export function buildKeyLayout(canvasWidth: number, range?: NoteRange): KeyLayout[] {
  const first = range?.firstMidi ?? PIANO_FIRST_MIDI;
  const last = range?.lastMidi ?? PIANO_LAST_MIDI;

  const whiteKeys: { midi: number; index: number }[] = [];
  for (let midi = first; midi <= last; midi++) {
    if (!isBlackKey(midi)) {
      whiteKeys.push({ midi, index: whiteKeys.length });
    }
  }

  const whiteKeyWidth = canvasWidth / whiteKeys.length;
  const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_RATIO;

  const layout: KeyLayout[] = [];

  for (const wk of whiteKeys) {
    layout.push({
      midi: wk.midi,
      x: wk.index * whiteKeyWidth,
      width: whiteKeyWidth,
      isBlack: false,
    });
  }

  for (let midi = first; midi <= last; midi++) {
    if (isBlackKey(midi)) {
      const prevWhite = whiteKeys.find(
        (wk) => wk.midi === midi - 1 || (midi % 12 === 6 && wk.midi === midi - 1) || wk.midi === midi - 1
      );
      if (prevWhite) {
        const x = (prevWhite.index + 1) * whiteKeyWidth - blackKeyWidth / 2;
        layout.push({ midi, x, width: blackKeyWidth, isBlack: true });
      }
    }
  }

  return layout;
}

let cachedLayout: KeyLayout[] | null = null;
let cachedWidth = 0;
let cachedFirst = PIANO_FIRST_MIDI;
let cachedLast = PIANO_LAST_MIDI;
let noteXMap: Map<number, { x: number; width: number }> | null = null;

export function getKeyLayout(canvasWidth: number, range?: NoteRange): KeyLayout[] {
  const first = range?.firstMidi ?? PIANO_FIRST_MIDI;
  const last = range?.lastMidi ?? PIANO_LAST_MIDI;
  if (cachedLayout && cachedWidth === canvasWidth && cachedFirst === first && cachedLast === last) {
    return cachedLayout;
  }
  cachedLayout = buildKeyLayout(canvasWidth, range);
  cachedWidth = canvasWidth;
  cachedFirst = first;
  cachedLast = last;
  noteXMap = null;
  return cachedLayout;
}

export function getNoteX(canvasWidth: number, midi: number, range?: NoteRange): { x: number; width: number } | undefined {
  const first = range?.firstMidi ?? PIANO_FIRST_MIDI;
  const last = range?.lastMidi ?? PIANO_LAST_MIDI;
  if (!noteXMap || cachedWidth !== canvasWidth || cachedFirst !== first || cachedLast !== last) {
    const layout = getKeyLayout(canvasWidth, range);
    noteXMap = new Map();
    for (const key of layout) {
      noteXMap.set(key.midi, { x: key.x, width: key.width });
    }
  }
  return noteXMap.get(midi);
}
