import type { Note } from '../types';
import { getNoteX } from './PianoKeyRenderer';
import {
  PLAY_LINE_BOTTOM_OFFSET,
  PIXELS_PER_SECOND,
  LOOK_AHEAD_SEC,
  LOOK_BEHIND_SEC,
  NOTE_COLORS,
  PLAY_LINE_COLOR,
  PLAY_LINE_GLOW,
  PLAY_LINE_BAND_HEIGHT,
  NOTE_BORDER_RADIUS,
  NOTE_MIN_HEIGHT,
  NOTE_GAP,
} from './constants';

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
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBackground(ctx, canvasWidth, canvasHeight);

  const playLineY = canvasHeight - PLAY_LINE_BOTTOM_OFFSET;

  const minTime = currentTime - LOOK_BEHIND_SEC;
  const maxTime = currentTime + LOOK_AHEAD_SEC;

  const startIdx = binarySearchStart(notes, minTime);

  for (let i = startIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.startTime > maxTime) break;

    drawNote(ctx, note, i, currentTime, playLineY, canvasWidth, canvasHeight, pxPerSec, activeNotes, hitNotes, missedNotes);
  }

  drawPlayLine(ctx, playLineY, canvasWidth);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a0a1a');
  gradient.addColorStop(1, '#12122a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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
  activeNotes: Set<number>,
  hitNotes: Set<number>,
  missedNotes: Set<number>,
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
    color = NOTE_COLORS.active;
    glowIntensity = 8;
  } else if (missedNotes.has(noteIndex)) {
    color = NOTE_COLORS.miss;
  } else if (activeNotes.has(note.midi) && Math.abs(timeDelta) < 0.35) {
    color = NOTE_COLORS.active;
    glowIntensity = 12;
  } else {
    color = note.track === 0 ? NOTE_COLORS.right : NOTE_COLORS.left;
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
) {
  const bandH = PLAY_LINE_BAND_HEIGHT;

  const bandGrad = ctx.createLinearGradient(0, y - bandH, 0, y + bandH);
  bandGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
  bandGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.15)');
  bandGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
  bandGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.15)');
  bandGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, y - bandH * 3, width, bandH * 6);

  ctx.save();
  ctx.shadowColor = PLAY_LINE_GLOW;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = PLAY_LINE_COLOR;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();

  ctx.shadowBlur = 40;
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
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
