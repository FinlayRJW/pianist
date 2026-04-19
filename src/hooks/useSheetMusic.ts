import { useState, useEffect } from 'react';
import type { SongMeta } from '../types';
import type { SheetTimingMap, SheetSystem } from '../types/sheet-music';

export interface FlatSystem {
  pageIdx: number;
  globalIdx: number;
  system: SheetSystem;
  viewBox: [number, number];
}

interface SheetMusicData {
  timingMap: SheetTimingMap;
  svgContents: string[];
  flatSystems: FlatSystem[];
}

const cache = new Map<string, SheetMusicData>();
const failedIds = new Set<string>();

function getSheetDir(meta: SongMeta): string {
  const genre = meta.journeySong ? 'journey' : meta.genre;
  return `sheet/${genre}/${meta.id}`;
}

function flattenSystems(timingMap: SheetTimingMap): FlatSystem[] {
  const flat: FlatSystem[] = [];
  let globalIdx = 0;
  for (let p = 0; p < timingMap.pages.length; p++) {
    const page = timingMap.pages[p];
    for (const system of page.systems) {
      flat.push({ pageIdx: p, globalIdx: globalIdx++, system, viewBox: page.viewBox });
    }
  }
  return flat;
}

export function useSheetMusic(meta: SongMeta) {
  const [data, setData] = useState<SheetMusicData | null>(cache.get(meta.id) ?? null);
  const [loading, setLoading] = useState(!cache.has(meta.id) && !failedIds.has(meta.id));
  const [error, setError] = useState<string | null>(failedIds.has(meta.id) ? 'not available' : null);

  useEffect(() => {
    if (cache.has(meta.id)) {
      setData(cache.get(meta.id)!);
      setLoading(false);
      setError(null);
      return;
    }
    if (failedIds.has(meta.id)) {
      setLoading(false);
      setError('not available');
      return;
    }

    let cancelled = false;
    const sheetDir = getSheetDir(meta);
    const base = import.meta.env.BASE_URL;

    (async () => {
      try {
        const timingRes = await fetch(`${base}${sheetDir}/timing.json`);
        if (!timingRes.ok) throw new Error('no timing data');
        const timingMap: SheetTimingMap = await timingRes.json();

        const svgContents: string[] = [];
        for (const page of timingMap.pages) {
          const svgRes = await fetch(`${base}${sheetDir}/${page.file}`);
          if (!svgRes.ok) throw new Error(`missing ${page.file}`);
          let svg = await svgRes.text();
          // Strip fixed width/height so SVG scales to container
          svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/, '$1');
          svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/, '$1');
          svgContents.push(svg);
        }

        if (cancelled) return;
        const flatSystems = flattenSystems(timingMap);
        const result = { timingMap, svgContents, flatSystems };
        cache.set(meta.id, result);
        setData(result);
        setLoading(false);
      } catch {
        if (cancelled) return;
        failedIds.add(meta.id);
        setError('not available');
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [meta.id, meta.genre, meta.journeySong]);

  return {
    timingMap: data?.timingMap ?? null,
    svgContents: data?.svgContents ?? [],
    flatSystems: data?.flatSystems ?? [],
    loading,
    error,
  };
}
