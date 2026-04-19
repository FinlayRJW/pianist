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
  const innerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const pendingResetRef = useRef(false);

  const rowCount = singleRow ? 1 : 2;
  const rowHeight = height / rowCount;

  const baseOffset = singleRow ? 0 : -rowHeight;

  useLayoutEffect(() => {
    if (pendingResetRef.current && innerRef.current) {
      const el = innerRef.current;
      el.style.transition = 'none';
      el.style.transform = `translateY(${baseOffset}px)`;
      pendingResetRef.current = false;
      requestAnimationFrame(() => {
        if (innerRef.current) {
          innerRef.current.style.transition = '';
        }
        isTransitioning.current = false;
      });
    }
  }, [displayIdx, baseOffset]);

  const animate = useCallback(() => {
    if (!timingMap || flatSystems.length === 0) return;
    if (isTransitioning.current) return;

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
      const delta = sysIdx - currentSysRef.current;
      currentSysRef.current = sysIdx;

      if (!singleRow && Math.abs(delta) === 1 && innerRef.current) {
        isTransitioning.current = true;
        const el = innerRef.current;
        el.style.transition = 'transform 0.3s ease';
        el.style.transform = `translateY(${baseOffset - delta * rowHeight}px)`;

        const onEnd = () => {
          pendingResetRef.current = true;
          setDisplayIdx(sysIdx);
        };
        el.addEventListener('transitionend', onEnd, { once: true });

        setTimeout(() => {
          if (isTransitioning.current) {
            el.removeEventListener('transitionend', onEnd);
            el.style.transition = 'none';
            el.style.transform = `translateY(${baseOffset}px)`;
            setDisplayIdx(sysIdx);
            isTransitioning.current = false;
          }
        }, 500);
      } else {
        setDisplayIdx(sysIdx);
      }
    }
  }, [timingMap, flatSystems, timeRef, baseOffset, rowHeight, singleRow]);

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
      <div ref={innerRef} style={{ transform: `translateY(${baseOffset}px)` }}>
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

    </div>
  );
}
