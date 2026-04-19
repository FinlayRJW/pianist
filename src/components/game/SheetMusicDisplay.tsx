import { useRef, useCallback, useState, useLayoutEffect } from 'react';
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

interface SystemLayout {
  svgHeight: number;
  visibleHeight: number;
  offsetY: number;
}

function computeSystemLayout(fs: FlatSystem, containerWidth: number): SystemLayout {
  const pageW = fs.viewBox[0];
  const pageH = fs.viewBox[1];
  const sys = fs.system;

  // No extra padding — the compile script already includes padding in y/height
  const clipTop = Math.max(0, sys.y);
  const clipBottom = Math.min(pageH, sys.y + sys.height);

  const svgHeight = containerWidth * (pageH / pageW);
  const visibleHeight = svgHeight * ((clipBottom - clipTop) / pageH);
  const offsetY = -(clipTop / pageH) * svgHeight;

  return { svgHeight, visibleHeight, offsetY };
}

function SystemRow({
  fs,
  svgContent,
  containerWidth,
  rowHeight,
  dimmed,
}: {
  fs: FlatSystem;
  svgContent: string;
  containerWidth: number;
  rowHeight: number;
  dimmed: boolean;
}) {
  const layout = computeSystemLayout(fs, containerWidth);

  const scale = layout.visibleHeight > rowHeight
    ? rowHeight / layout.visibleHeight
    : 1;
  const scaledVisibleHeight = layout.visibleHeight * scale;
  const svgWidth = containerWidth * scale;
  const svgLeftOffset = (containerWidth - svgWidth) / 2;
  const verticalOffset = (rowHeight - scaledVisibleHeight) / 2;

  return (
    <div
      className="overflow-hidden"
      style={{
        height: rowHeight,
        width: containerWidth,
        opacity: dimmed ? 'var(--sheet-dim)' : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Inner clip: sized exactly to the system's visible band to prevent adjacent systems leaking */}
      <div
        className="overflow-hidden"
        style={{
          width: svgWidth,
          height: scaledVisibleHeight,
          transform: `translate(${svgLeftOffset}px, ${verticalOffset}px)`,
        }}
      >
        <div
          style={{
            width: svgWidth,
            height: layout.svgHeight * scale,
            marginTop: layout.offsetY * scale,
            color: 'var(--sheet-note)',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}

export function SheetMusicDisplay({ songMeta, timeRef, width, height, singleRow }: Props) {
  const { timingMap, svgContents, flatSystems, loading, error } = useSheetMusic(songMeta);
  const [displayIdx, setDisplayIdx] = useState(0);
  const currentSysRef = useRef(0);
  const isTransitioning = useRef(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const rowCount = singleRow ? 1 : 2;
  const rowHeight = height / rowCount;

  const baseOffset = singleRow ? 0 : -rowHeight;

  const triggerTransition = useCallback(
    (newIdx: number) => {
      if (!innerRef.current || isTransitioning.current) return;

      const jump = newIdx - currentSysRef.current;
      if (Math.abs(jump) > 1) {
        currentSysRef.current = newIdx;
        setDisplayIdx(newIdx);
        if (innerRef.current) {
          innerRef.current.style.transition = 'none';
          innerRef.current.style.transform = `translateY(${baseOffset}px)`;
        }
        return;
      }

      isTransitioning.current = true;
      innerRef.current.style.transition = 'transform 300ms ease-out';
      innerRef.current.style.transform = `translateY(${baseOffset - rowHeight}px)`;

      clearTimeout(safetyTimer.current);
      const finalize = () => {
        clearTimeout(safetyTimer.current);
        currentSysRef.current = newIdx;
        isTransitioning.current = false;
        setDisplayIdx(newIdx);
      };

      const onEnd = () => {
        innerRef.current?.removeEventListener('transitionend', onEnd);
        finalize();
      };
      innerRef.current.addEventListener('transitionend', onEnd);
      safetyTimer.current = setTimeout(finalize, 500);
    },
    [rowHeight, baseOffset],
  );

  useLayoutEffect(() => {
    if (innerRef.current) {
      innerRef.current.style.transition = 'none';
      innerRef.current.style.transform = `translateY(${baseOffset}px)`;
    }
  }, [displayIdx, baseOffset]);

  const animate = useCallback((deltaMs: number) => {
    if (!timingMap || !cursorRef.current || flatSystems.length === 0) return;

    // Add ~1 frame look-ahead to compensate for rAF ordering
    // (this rAF fires before the game tick updates timeRef)
    const time = (timeRef.current ?? 0) + deltaMs * 0.001;
    const measures = timingMap.measures;
    if (measures.length === 0) return;

    const rawMeasureIdx = findCurrentMeasure(measures, time);
    const totalVisualMeasures = flatSystems.reduce((sum, fs) => sum + fs.system.measureCount, 0);
    const measureIdx = totalVisualMeasures > 0 && rawMeasureIdx >= totalVisualMeasures
      ? rawMeasureIdx % totalVisualMeasures
      : rawMeasureIdx;
    const sysIdx = findSystemForMeasure(flatSystems, measureIdx);

    if (sysIdx !== currentSysRef.current && !isTransitioning.current) {
      triggerTransition(sysIdx);
    }

    // Cursor positioning — per-measure interpolation using barline positions
    const fs = flatSystems[sysIdx];
    const sys = fs.system;

    let cursorXFraction: number;
    if (sys.barlineXs && sys.barlineXs.length >= 2) {
      const bxs = sys.barlineXs;
      const firstGap = bxs[1] - bxs[0];
      const musicStart = Math.max(0.02, bxs[0] - firstGap);
      const boundaries = [musicStart, ...bxs];
      while (boundaries.length < sys.measureCount + 1) {
        const lastGap = boundaries[boundaries.length - 1] - boundaries[boundaries.length - 2];
        boundaries.push(Math.min(0.99, boundaries[boundaries.length - 1] + lastGap));
      }

      const localMeasure = Math.max(0, Math.min(measureIdx - sys.firstMeasure, boundaries.length - 2));
      const leftX = boundaries[localMeasure];
      const rightX = boundaries[localMeasure + 1];
      const mStart = measures[rawMeasureIdx]?.timeStart ?? 0;
      const mEnd = measures[rawMeasureIdx]?.timeEnd ?? mStart + 1;
      const measureProgress = Math.max(0, Math.min(1, (time - mStart) / (mEnd - mStart || 1)));
      cursorXFraction = leftX + measureProgress * (rightX - leftX);
    } else {
      const sysStartTime = measures[sys.firstMeasure]?.timeStart ?? 0;
      const lastMIdx = Math.min(sys.firstMeasure + sys.measureCount - 1, measures.length - 1);
      const sysEndTime = measures[lastMIdx]?.timeEnd ?? sysStartTime + 1;
      const sysProgress = Math.max(0, Math.min(1, (time - sysStartTime) / (sysEndTime - sysStartTime || 1)));
      const marginLeft = 0.12;
      const marginRight = 0.03;
      cursorXFraction = marginLeft + sysProgress * (1 - marginLeft - marginRight);
    }

    const layout = computeSystemLayout(fs, width);
    // Match the scale logic from SystemRow
    const scale = layout.visibleHeight > rowHeight ? rowHeight / layout.visibleHeight : 1;
    const scaledVisibleHeight = layout.visibleHeight * scale;
    const svgWidth = width * scale;
    const svgLeftOffset = (width - svgWidth) / 2;
    const cursorPixelX = svgLeftOffset + cursorXFraction * svgWidth;

    const isOnCurrentRow = sysIdx === currentSysRef.current;
    const cursorRowTop = isOnCurrentRow ? 0 : rowHeight;
    const cursorTop = cursorRowTop + (rowHeight - scaledVisibleHeight) / 2;

    cursorRef.current.style.transform = `translate(${cursorPixelX}px, ${cursorTop}px)`;
    cursorRef.current.style.height = `${scaledVisibleHeight}px`;
  }, [timingMap, flatSystems, timeRef, width, rowHeight, triggerTransition]);

  useAnimationFrame(animate, true);

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

  // Render the current system, next, and one before (for transitions)
  const slotsToRender: (FlatSystem | null)[] = [];
  if (!singleRow) {
    slotsToRender.push(displayIdx > 0 ? flatSystems[displayIdx - 1] : null);
  }
  slotsToRender.push(flatSystems[displayIdx] ?? null);
  if (!singleRow) {
    slotsToRender.push(flatSystems[displayIdx + 1] ?? null);
    slotsToRender.push(flatSystems[displayIdx + 2] ?? null);
  }

  return (
    <div
      style={{ width, height, background: 'var(--sheet-bg)' }}
      className="relative overflow-hidden"
    >
      <div
        ref={innerRef}
        className="will-change-transform"
        style={{ transform: `translateY(${baseOffset}px)` }}
      >
        {slotsToRender.map((fs, i) => {
          if (!fs) {
            return <div key={i} style={{ height: rowHeight, width }} />;
          }
          return (
            <SystemRow
              key={i}
              fs={fs}
              svgContent={svgContents[fs.pageIdx]}
              containerWidth={width}
              rowHeight={rowHeight}
              dimmed={false}
            />
          );
        })}
      </div>

      {/* Cursor line */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
        style={{
          width: 2.5,
          background: 'var(--sheet-cursor)',
          boxShadow: `0 0 10px var(--sheet-cursor-glow), 0 0 24px var(--sheet-cursor-glow)`,
          borderRadius: 1,
          zIndex: 10,
        }}
      />
    </div>
  );
}
