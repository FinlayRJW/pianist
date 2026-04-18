import type { Note } from '../types';
import { getNoteX } from './PianoKeyRenderer';
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

function binarySearchStart(notes: Note[], minTime: number): number {
  let lo = 0;
  let hi = notes.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (notes[mid].startTime + notes[mid].duration < minTime) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
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
) {
  const theme = getCanvasTheme();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBackground(ctx, canvasWidth, canvasHeight, theme);

  const playLineY = canvasHeight - PLAY_LINE_BOTTOM_OFFSET;

  const minTime = currentTime - LOOK_BEHIND_SEC;
  const maxTime = currentTime + LOOK_AHEAD_SEC;

  const startIdx = binarySearchStart(notes, minTime);

  const activeNoteMap = new Map<number, number>();
  for (let i = startIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.startTime > maxTime) break;
    if (missedNotes.has(i)) continue;
    if (!activeNotes.has(note.midi)) continue;
    const timeDelta = note.startTime - currentTime;
    if (timeDelta < -0.15 && hitNotes.has(i)) continue;
    if (Math.abs(timeDelta) > 0.35) continue;
    const existing = activeNoteMap.get(note.midi);
    if (existing === undefined) {
      activeNoteMap.set(note.midi, i);
    } else {
      const existingDelta = Math.abs(notes[existing].startTime - currentTime);
      if (Math.abs(timeDelta) < existingDelta) {
        activeNoteMap.set(note.midi, i);
      }
    }
  }

  for (let i = startIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.startTime > maxTime) break;

    drawNote(ctx, note, i, currentTime, playLineY, canvasWidth, canvasHeight, pxPerSec, activeNoteMap, hitNotes, missedNotes, theme);
  }

  drawPlayLine(ctx, playLineY, canvasWidth, theme);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ReturnType<typeof getCanvasTheme>,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.bgTop);
  gradient.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = theme.grid;
  ctx.lineWidth = 1;
  const keyPositions = getAllWhiteKeyXPositions(width);
  for (const x of keyPositions) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function getAllWhiteKeyXPositions(canvasWidth: number): number[] {
  const positions: number[] = [];
  const whiteKeyCount = 52;
  const whiteKeyWidth = canvasWidth / whiteKeyCount;
  for (let i = 0; i <= whiteKeyCount; i++) {
    positions.push(i * whiteKeyWidth);
  }
  return positions;
}

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
) {
  const keyInfo = getNoteX(canvasWidth, note.midi);
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
  roundRect(ctx, x, y, width, noteHeight, NOTE_BORDER_RADIUS);
  ctx.fill();

  if (glowIntensity > 0) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
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
