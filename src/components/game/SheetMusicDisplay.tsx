import { useRef, useEffect, useCallback } from 'react';
import { Renderer } from 'vexflow';
import type { Note } from '../../types';
import { quantizeToNotationCached } from '../../utils/midi-to-notation';
import { renderScore, getTotalWidth, type RenderedMeasure } from '../../utils/vexflow-adapter';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface Props {
  notes: Note[];
  bpm: number;
  timeSignature?: [number, number];
  keySignature?: string;
  timeRef: React.RefObject<number>;
  playing: boolean;
  width: number;
  height: number;
}

function getSheetColors(): { note: string; staff: string; active: string; bg: string } {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') {
    return {
      note: 'rgba(0, 0, 0, 0.85)',
      staff: 'rgba(0, 0, 0, 0.3)',
      active: '#6366f1',
      bg: 'rgba(255, 255, 255, 0.9)',
    };
  }
  return {
    note: 'rgba(255, 255, 255, 0.85)',
    staff: 'rgba(255, 255, 255, 0.25)',
    active: '#818cf8',
    bg: 'rgba(10, 10, 26, 0.8)',
  };
}

export function SheetMusicDisplay({
  notes,
  bpm,
  timeSignature = [4, 4],
  keySignature = 'C',
  timeRef,
  playing,
  width,
  height,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const measuresRef = useRef<RenderedMeasure[]>([]);
  const scrollXRef = useRef(0);
  const renderedRef = useRef(false);

  const renderSheet = useCallback(() => {
    if (!svgContainerRef.current || notes.length === 0) return;

    svgContainerRef.current.innerHTML = '';
    const measures = quantizeToNotationCached(notes, bpm, timeSignature, keySignature);
    const totalWidth = getTotalWidth(measures.length);
    const colors = getSheetColors();

    const renderer = new Renderer(svgContainerRef.current, Renderer.Backends.SVG);
    renderer.resize(totalWidth, height - 10);
    const context = renderer.getContext();

    const beatsPerMeasure = timeSignature[0] * (4 / timeSignature[1]);
    const currentBeat = ((timeRef.current ?? 0) * bpm) / 60;

    measuresRef.current = renderScore(
      context,
      measures,
      timeSignature,
      keySignature,
      colors.note,
      colors.staff,
      colors.active,
      currentBeat >= 0 ? currentBeat : undefined,
    );

    renderedRef.current = true;
  }, [notes, bpm, timeSignature, keySignature, height]);

  useEffect(() => {
    renderSheet();
  }, [renderSheet]);

  const updateScroll = useCallback(() => {
    if (!containerRef.current || !svgContainerRef.current || measuresRef.current.length === 0) return;

    const currentTime = timeRef.current ?? 0;
    const currentBeat = (currentTime * bpm) / 60;
    const beatsPerMeasure = timeSignature[0] * (4 / timeSignature[1]);

    let targetX = 0;
    for (const m of measuresRef.current) {
      if (currentBeat >= m.startBeat && currentBeat < m.startBeat + beatsPerMeasure) {
        const frac = (currentBeat - m.startBeat) / beatsPerMeasure;
        targetX = m.x + frac * m.width - width / 2 + m.width / 2;
        break;
      }
      targetX = m.x + m.width - width / 2;
    }

    targetX = Math.max(0, targetX);
    scrollXRef.current += (targetX - scrollXRef.current) * 0.15;
    svgContainerRef.current.style.transform = `translateX(${-scrollXRef.current}px)`;

    renderSheet();
  }, [bpm, timeSignature, width, renderSheet]);

  useAnimationFrame(updateScroll, playing);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: 'var(--sheet-bg, rgba(10,10,26,0.8))',
      }}
    >
      <div
        ref={svgContainerRef}
        className="absolute top-0 left-0"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
