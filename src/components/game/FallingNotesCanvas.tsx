import { useRef, useEffect, useCallback } from 'react';
import type { Note, NoteRange } from '../../types';
import { drawFrame } from '../../canvas/FallingNotesRenderer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface Props {
  notes: Note[];
  timeRef: React.RefObject<number>;
  playing: boolean;
  width: number;
  height: number;
  activeNotes: Set<number>;
  hitNotes: Set<number>;
  missedNotes: Set<number>;
  range?: NoteRange;
  octaveEquivalence?: boolean;
}

export function FallingNotesCanvas({
  notes,
  timeRef,
  playing,
  width,
  height,
  activeNotes,
  hitNotes,
  missedNotes,
  range,
  octaveEquivalence,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, [width, height]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawFrame(
      ctx,
      notes,
      timeRef.current ?? 0,
      width,
      height,
      activeNotes,
      hitNotes,
      missedNotes,
      undefined,
      range,
      octaveEquivalence,
    );
  }, [notes, timeRef, width, height, activeNotes, hitNotes, missedNotes, range, octaveEquivalence]);

  useAnimationFrame(render, true);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className={`block ${playing ? '' : 'opacity-90'}`}
    />
  );
}
