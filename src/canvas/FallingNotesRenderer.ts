import type { Note, NoteRange } from '../types';
import { getNoteX, getKeyLayout, getPitchLetter, isBlackKey } from './PianoKeyRenderer';
import {
  PLAY_LINE_BOTTOM_OFFSET,
  PIXELS_PER_SECOND,
  LOOK_AHEAD_SEC,
  LOOK_BEHIND_SEC,
  PLAY_LINE_BAND_HEIGHT,
  NOTE_BORDER_RADIUS,
  NOTE_MIN_HEIGHT,
  NOTE_GAP,
} from './constants';
import { getCanvasTheme } from './theme';

let cachedNotesRef: Note[] | null = null;
let cachedMaxDur = 0;
function getMaxDuration(notes: Note[]): number {
  if (notes !== cachedNotesRef) {
    cachedNotesRef = notes;
    cachedMaxDur = 0;
    for (const n of notes) if (n.duration > cachedMaxDur) cachedMaxDur = n.duration;
  }
  return cachedMaxDur;
}

function binarySearchStart(notes: Note[], minStartTime: number): number {
  let lo = 0;
  let hi = notes.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (notes[mid].startTime < minStartTime) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function hasMatchingPitchClass(set: Set<number>, midi: number): boolean {
  const pc = midi % 12;
  for (const n of set) {
    if (n % 12 === pc) return true;
  }
  return false;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  notes: Note[],
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number,
  activeNotes: Set<number>,
  hitNotes: Set<number>,
  missedNotes: Set<number>,
  pxPerSec: number = PIXELS_PER_SECOND,
  range?: NoteRange,
  octaveEquivalence?: boolean,
) {
  const theme = getCanvasTheme();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBackground(ctx, canvasWidth, canvasHeight, theme, range);

  const playLineY = canvasHeight - PLAY_LINE_BOTTOM_OFFSET;

  const minTime = currentTime - LOOK_BEHIND_SEC;
  const maxTime = currentTime + LOOK_AHEAD_SEC;
  const maxDur = getMaxDuration(notes);

  const startIdx = binarySearchStart(notes, minTime - maxDur);

  drawNextNoteHighlight(ctx, notes, currentTime, canvasWidth, canvasHeight, hitNotes, missedNotes, theme, range);

  const activeNoteMap = new Map<number, number>();
  for (let i = startIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.startTime > maxTime) break;
    if (note.startTime + note.duration < minTime) continue;
    if (missedNotes.has(i)) continue;

    const isActive = octaveEquivalence
      ? hasMatchingPitchClass(activeNotes, note.midi)
      : activeNotes.has(note.midi);
    if (!isActive) continue;

    const timeDelta = note.startTime - currentTime;

    if (hitNotes.has(i)) {
      if (currentTime > note.startTime + note.duration + 0.1) continue;
    } else {
      if (Math.abs(timeDelta) > 0.35) continue;
    }

    const existing = activeNoteMap.get(note.midi);
    if (existing === undefined) {
      activeNoteMap.set(note.midi, i);
    } else {
      const existingDelta = notes[existing].startTime - currentTime;
      if (timeDelta <= 0 && existingDelta > 0) {
        activeNoteMap.set(note.midi, i);
      } else if (timeDelta > 0 && existingDelta <= 0) {
        // keep existing — at/past play line takes priority
      } else if (Math.abs(timeDelta) < Math.abs(existingDelta)) {
        activeNoteMap.set(note.midi, i);
      }
    }
  }

  for (let i = startIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.startTime > maxTime) break;
    if (note.startTime + note.duration < minTime) continue;

    drawNote(ctx, note, i, currentTime, playLineY, canvasWidth, canvasHeight, pxPerSec, activeNoteMap, hitNotes, missedNotes, theme, range);
  }

  drawPlayLine(ctx, playLineY, canvasWidth, theme);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ReturnType<typeof getCanvasTheme>,
  range?: NoteRange,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.bgTop);
  gradient.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = theme.grid;
  ctx.lineWidth = 1;
  const layout = getKeyLayout(width, range);
  for (const key of layout) {
    if (key.isBlack) continue;
    ctx.beginPath();
    ctx.moveTo(key.x, 0);
    ctx.lineTo(key.x, height);
    ctx.stroke();
  }
  const lastWhite = layout.filter(k => !k.isBlack).at(-1);
  if (lastWhite) {
    const rightEdge = lastWhite.x + lastWhite.width;
    ctx.beginPath();
    ctx.moveTo(rightEdge, 0);
    ctx.lineTo(rightEdge, height);
    ctx.stroke();
  }
}

function drawNextNoteHighlight(
  ctx: CanvasRenderingContext2D,
  notes: Note[],
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number,
  hitNotes: Set<number>,
  missedNotes: Set<number>,
  theme: ReturnType<typeof getCanvasTheme>,
  range?: NoteRange,
) {
  for (let i = 0; i < notes.length; i++) {
    if (hitNotes.has(i) || missedNotes.has(i)) continue;
    if (notes[i].startTime < currentTime - 0.5) continue;

    const targetTime = notes[i].startTime;
    const seen = new Set<number>();
    for (let j = i; j < notes.length && notes[j].startTime - targetTime < 0.03; j++) {
      if (hitNotes.has(j) || missedNotes.has(j)) continue;
      if (seen.has(notes[j].midi)) continue;
      seen.add(notes[j].midi);
      const keyInfo = getNoteX(canvasWidth, notes[j].midi, range);
      if (!keyInfo) continue;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, `rgba(${theme.nextColRgb}, 0)`);
      gradient.addColorStop(0.7, `rgba(${theme.nextColRgb}, 0.05)`);
      gradient.addColorStop(1, `rgba(${theme.nextColRgb}, 0.12)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(keyInfo.x, 0, keyInfo.width, canvasHeight);
    }
    break;
  }
}

const NOTE_LABEL_MIN_HEIGHT = 20;

function drawNote(
  ctx: CanvasRenderingContext2D,
  note: Note,
  noteIndex: number,
  currentTime: number,
  playLineY: number,
  canvasWidth: number,
  _canvasHeight: number,
  pxPerSec: number,
  activeNoteMap: Map<number, number>,
  hitNotes: Set<number>,
  missedNotes: Set<number>,
  theme: ReturnType<typeof getCanvasTheme>,
  range?: NoteRange,
) {
  const keyInfo = getNoteX(canvasWidth, note.midi, range);
  if (!keyInfo) return;

  const timeDelta = note.startTime - currentTime;
  const noteY = playLineY - timeDelta * pxPerSec;
  const noteHeight = Math.max(note.duration * pxPerSec - NOTE_GAP, NOTE_MIN_HEIGHT);

  const x = keyInfo.x + 1;
  const width = keyInfo.width - 2;
  const y = noteY - noteHeight;

  let color: string;
  let glowIntensity = 0;

  if (hitNotes.has(noteIndex)) {
    color = theme.noteActive;
    glowIntensity = 8;
  } else if (missedNotes.has(noteIndex)) {
    color = theme.noteMiss;
  } else if (activeNoteMap.get(note.midi) === noteIndex) {
    color = theme.noteActive;
    glowIntensity = 12;
  } else {
    color = note.track === 0 ? theme.noteRight : theme.noteLeft;
  }

  if (glowIntensity > 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = glowIntensity;
  }

  ctx.fillStyle = color;
  const taperRatio = note.duration > 0.3
    ? Math.max(0.3, 1 - note.duration * 0.25)
    : 1;
  if (taperRatio < 1) {
    const topWidth = width * taperRatio;
    taperRect(ctx, x, y, width, topWidth, noteHeight, NOTE_BORDER_RADIUS);
  } else {
    roundRect(ctx, x, y, width, noteHeight, NOTE_BORDER_RADIUS);
  }
  ctx.fill();

  if (glowIntensity > 0) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  if (noteHeight >= NOTE_LABEL_MIN_HEIGHT) {
    const letter = getPitchLetter(note.midi);
    const fontSize = Math.min(12, width * 0.45);
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelY = y + noteHeight - Math.min(noteHeight / 2, fontSize + 4);
    ctx.fillStyle = isBlackKey(note.midi) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.85)';
    ctx.fillText(letter, x + width / 2, labelY);
  }
}

function drawPlayLine(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  theme: ReturnType<typeof getCanvasTheme>,
) {
  const bandH = PLAY_LINE_BAND_HEIGHT;
  const rgb = theme.playBandRgb;

  const bandGrad = ctx.createLinearGradient(0, y - bandH, 0, y + bandH);
  bandGrad.addColorStop(0, `rgba(${rgb}, 0)`);
  bandGrad.addColorStop(0.3, `rgba(${rgb}, 0.15)`);
  bandGrad.addColorStop(0.5, `rgba(${rgb}, 0.25)`);
  bandGrad.addColorStop(0.7, `rgba(${rgb}, 0.15)`);
  bandGrad.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, y - bandH * 3, width, bandH * 6);

  ctx.save();
  ctx.shadowColor = theme.playGlow;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = theme.playLine;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();

  ctx.shadowBlur = 40;
  ctx.strokeStyle = `rgba(${rgb}, 0.6)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = theme.text;
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('PLAY HERE', width - 12, y - 10);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function taperRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bottomW: number,
  topW: number,
  h: number,
  r: number,
) {
  const topX = x + (bottomW - topW) / 2;
  r = Math.min(r, topW / 2, h / 2);

  ctx.beginPath();
  ctx.moveTo(topX + r, y);
  ctx.lineTo(topX + topW - r, y);
  ctx.quadraticCurveTo(topX + topW, y, topX + topW, y + r);
  ctx.lineTo(x + bottomW, y + h - r);
  ctx.quadraticCurveTo(x + bottomW, y + h, x + bottomW - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(topX, y + r);
  ctx.quadraticCurveTo(topX, y, topX + r, y);
  ctx.closePath();
}
