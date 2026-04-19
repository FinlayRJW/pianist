import { useRef, useCallback, useState } from 'react';
import type { SongMeta } from '../../types';
import type { SheetTimingMap } from '../../types/sheet-music';
import { useSheetMusic, type FlatSystem } from '../../hooks/useSheetMusic';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

interface Props {
  songMeta: SongMeta;
  timeRef: React.RefObject<number>;
  playing: boolean;
  width: number;
  height: number;
  singleRow?: boolean;
}

function findCurrentMeasure(measures: SheetTimingMap['measures'], time: number): number {
  let lo = 0;
  let hi = measures.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (measures[mid].timeEnd <= time) lo = mid + 1;
    else if (measures[mid].timeStart > time) hi = mid - 1;
    else return mid;
  }
  return Math.max(0, Math.min(lo, measures.length - 1));
}

function findSystemForMeasure(flatSystems: FlatSystem[], measureIdx: number): number {
  for (let i = 0; i < flatSystems.length; i++) {
    const sys = flatSystems[i].system;
    if (measureIdx >= sys.firstMeasure && measureIdx < sys.firstMeasure + sys.measureCount) {
      return i;
    }
  }
  return flatSystems.length - 1;
}

export function SheetMusicDisplay({ songMeta, timeRef, playing, width, height }: Props) {
  const { timingMap, svgContents, flatSystems, loading, error } = useSheetMusic(songMeta);
  const [displayIdx, setDisplayIdx] = useState(0);
  const currentSysRef = useRef(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(-1);

  const animate = useCallback(() => {
    if (!timingMap || flatSystems.length === 0) return;

    const time = timeRef.current ?? 0;
    const measures = timingMap.measures;
    if (measures.length === 0) return;

    const rawMeasureIdx = findCurrentMeasure(measures, time);
    const totalVisualMeasures = flatSystems.reduce((sum, fs) => sum + fs.system.measureCount, 0);
    const measureIdx = totalVisualMeasures > 0 && rawMeasureIdx >= totalVisualMeasures
      ? rawMeasureIdx % totalVisualMeasures
      : rawMeasureIdx;
    const sysIdx = findSystemForMeasure(flatSystems, measureIdx);

    if (sysIdx !== currentSysRef.current) {
      currentSysRef.current = sysIdx;
      setDisplayIdx(sysIdx);
    }
  }, [timingMap, flatSystems, timeRef]);

  useAnimationFrame(animate, playing);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height, background: 'var(--sheet-bg)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
          Loading sheet music...
        </span>
      </div>
    );
  }

  if (error || !timingMap || flatSystems.length === 0) {
    return null;
  }

  const fs = flatSystems[displayIdx];
  if (!fs) return null;

  const svgContent = svgContents[fs.pageIdx];
  const [pageW, pageH] = fs.viewBox;
  const svgWidth = width * 0.85;
  const svgScale = svgWidth / pageW;
  const fullSvgHeight = pageH * svgScale;
  const svgLeftOffset = (width - svgWidth) / 2;

  const sysTopPx = fs.system.y * svgScale;
  const sysHeightPx = fs.system.height * svgScale;

  const paddingAbove = Math.max(0, (height - sysHeightPx) * 0.35);
  const scrollY = -sysTopPx + paddingAbove;

  const pageChanged = fs.pageIdx !== prevPageRef.current;
  prevPageRef.current = fs.pageIdx;

  return (
    <div
      style={{ width, height, background: 'var(--sheet-bg)' }}
      className="relative overflow-hidden"
    >
      <div
        ref={innerRef}
        style={{
          width: svgWidth,
          height: fullSvgHeight,
          marginLeft: svgLeftOffset,
          transform: `translateY(${scrollY}px)`,
          transition: pageChanged ? 'none' : 'transform 0.4s ease',
          willChange: 'transform',
          color: 'var(--sheet-note)',
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
