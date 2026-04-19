import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { execSync } from 'child_process';
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  rmSync,
} from 'fs';
import { join, dirname, basename } from 'path';
import { ALL_CATALOG_ENTRIES } from '../src/data/song-catalog';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC_SHEET = join(ROOT, 'public', 'sheet');
const PUBLIC_MIDI = join(ROOT, 'public', 'midi');
const PUBLIC_LY = join(ROOT, 'public', 'ly');
const TMP = join(ROOT, '.tmp-sheets');

const FORCE = process.argv.includes('--force');
const VERIFY_ONLY = process.argv.includes('--verify');

interface CompileEntry {
  id: string;
  genre: string;
  lyPath: string;
  midiPath: string;
  isZip: boolean;
}

function buildEntryList(): CompileEntry[] {
  const entries: CompileEntry[] = [];
  for (const song of ALL_CATALOG_ENTRIES) {
    if (!song.mutopiaPath) continue;
    const subdir = song.journeySong ? 'journey' : song.genre;
    const lyExt = song.lyDir ? '-lys.zip' : '.ly';
    const lyPath = join(PUBLIC_LY, subdir, `${song.id}${lyExt}`);
    const midiPath = join(PUBLIC_MIDI, subdir, `${song.id}.mid`);
    if (!existsSync(lyPath)) continue;
    if (!existsSync(midiPath)) continue;
    entries.push({ id: song.id, genre: subdir, lyPath, midiPath, isZip: !!song.lyDir });
  }
  return entries;
}

function runConvertLy(lyFilePath: string): void {
  try {
    execSync(`convert-ly -e "${lyFilePath}" 2>&1`, { timeout: 10000 });
  } catch {
    // convert-ly may warn but still update the file
  }
}

function compileLy(lyFilePath: string, outputDir: string): string[] {
  mkdirSync(outputDir, { recursive: true });

  // Check version and convert if old
  const content = readFileSync(lyFilePath, 'utf-8');
  const versionMatch = content.match(/\\version\s+"([\d.]+)"/);
  if (versionMatch) {
    const version = versionMatch[1];
    const major = parseInt(version.split('.')[0]);
    const minor = parseInt(version.split('.')[1]);
    if (major < 2 || (major === 2 && minor < 20)) {
      runConvertLy(lyFilePath);
    }
  }

  const lyDir = dirname(lyFilePath);
  const lyFile = basename(lyFilePath);
  try {
    execSync(
      `cd "${lyDir}" && lilypond -dbackend=svg -dno-point-and-click --output="${outputDir}" "${lyFile}" 2>&1`,
      { timeout: 120000 },
    );
  } catch (err: any) {
    const output = err.stdout?.toString() ?? '';
    if (!output.includes('Success')) {
      throw new Error(`LilyPond compilation failed: ${output.slice(-500)}`);
    }
  }
  const svgs = readdirSync(outputDir)
    .filter((f) => f.endsWith('.svg'))
    .sort();
  return svgs;
}

function findAllLyFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      results.push(...findAllLyFiles(join(dir, entry.name)));
    } else if (entry.name.endsWith('.ly')) {
      results.push(join(dir, entry.name));
    }
  }
  return results;
}

function findMainLyInZip(extractDir: string, songId: string): string | null {
  const allLyFiles = findAllLyFiles(extractDir);
  if (allLyFiles.length === 0) return null;
  if (allLyFiles.length === 1) return allLyFiles[0];

  // For multi-movement zips (like moonlight), pick the right movement
  // The songId tells us which movement: moonlight-sonata → mvt1, beethoven-moonlight-3 → mvt3
  if (songId.includes('moonlight') && !songId.includes('3')) {
    const mvt1 = allLyFiles.find((f) => basename(f).includes('moonlight1'));
    if (mvt1) return mvt1;
  }
  if (songId.includes('moonlight-3') || songId.includes('moonlight') && songId.includes('3')) {
    const mvt3 = allLyFiles.find((f) => basename(f).includes('moonlight3'));
    if (mvt3) return mvt3;
  }

  // Prefer A4 layout over Letter
  const a4Files = allLyFiles.filter((f) => basename(f).includes('-a4'));
  const candidates = a4Files.length > 0 ? a4Files : allLyFiles;

  // Look for the file that includes \score or \book
  for (const f of candidates) {
    const content = readFileSync(f, 'utf-8');
    if (content.includes('\\score') || content.includes('\\book')) {
      return f;
    }
  }

  // Look for a file that includes other files (likely the main entry point)
  for (const f of candidates) {
    const content = readFileSync(f, 'utf-8');
    if (content.includes('\\include')) {
      return f;
    }
  }

  // Fallback: longest file
  let best = candidates[0];
  let bestLen = 0;
  for (const f of candidates) {
    const len = readFileSync(f).length;
    if (len > bestLen) {
      bestLen = len;
      best = f;
    }
  }
  return best;
}

function extractZip(zipPath: string, destDir: string): boolean {
  mkdirSync(destDir, { recursive: true });
  try {
    execSync(`unzip -o "${zipPath}" -d "${destDir}"`, { timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}

function postProcessSvg(svgContent: string): string {
  let svg = svgContent;
  // Remove the white background rect (first rect in SVG, full page size)
  svg = svg.replace(
    /<rect[^>]*width="210\.00mm"[^>]*height="297\.00mm"[^>]*fill="white"[^>]*\/>/g,
    '',
  );
  // Also handle viewBox-sized rects used as background
  svg = svg.replace(
    /<rect[^>]*width="119\.\d+"[^>]*height="169\.\d+"[^>]*fill="white"[^>]*\/>/g,
    '',
  );
  // Strip Mutopia footer/tagline (large text blocks near bottom)
  svg = svg.replace(
    /<g[^>]*>\s*<text[^>]*>\s*<tspan>[^<]*Mutopia[^<]*<\/tspan>\s*<\/text>\s*<\/g>/g,
    '',
  );
  svg = svg.replace(
    /<g[^>]*>\s*<text[^>]*>\s*<tspan>[^<]*mutopia[^<]*<\/tspan>\s*<\/text>\s*<\/g>/gi,
    '',
  );
  // Remove fixed width/height so SVG scales to container (viewBox handles aspect ratio)
  svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/, '$1');
  svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/, '$1');
  // Remove LilyPond tagline
  svg = svg.replace(
    /<g[^>]*>\s*<text[^>]*>\s*<tspan>[^<]*LilyPond[^<]*<\/tspan>\s*<\/text>\s*<\/g>/gi,
    '',
  );
  // Remove XML declaration if present
  svg = svg.replace(/<\?xml[^?]*\?>\s*/, '');
  // Remove DOCTYPE
  svg = svg.replace(/<!DOCTYPE[^>]*>\s*/, '');
  return svg;
}

interface SystemInfo {
  y: number;
  height: number;
}

interface BarlineInfo {
  x: number;
  groupY: number;
}

function detectBarlines(svgContent: string): BarlineInfo[] {
  // Barlines are thin rects (width=0.1900) inside <g transform="translate(X, Y)">.
  // Inter-staff connectors have height > 4.5 (single staff barlines are ~4.05).
  const pattern =
    /<g transform="translate\(([\d.]+),\s*([\d.]+)\)">\s*<rect[^>]*width="0\.1900"[^>]*height="([\d.]+)"[^>]*\/>/g;
  const barlines: BarlineInfo[] = [];
  let match;
  while ((match = pattern.exec(svgContent))) {
    const h = parseFloat(match[3]);
    if (h < 4.5) continue;
    const x = parseFloat(match[1]);
    const groupY = parseFloat(match[2]);
    barlines.push({ x, groupY });
  }
  return barlines;
}

function assignBarlinesToSystems(
  barlines: BarlineInfo[],
  systems: SystemInfo[],
  pageWidth: number,
): (number[] | undefined)[] {
  // Group barlines by their exact groupY (all barlines in a system share the same Y)
  const byY = new Map<number, number[]>();
  for (const b of barlines) {
    const key = Math.round(b.groupY * 100) / 100;
    if (!byY.has(key)) byY.set(key, []);
    byY.get(key)!.push(b.x);
  }

  return systems.map((sys) => {
    // Find the barline group whose Y is closest to this system's center
    const sysMid = sys.y + sys.height / 2;
    let bestKey = -1;
    let bestDist = Infinity;
    for (const key of byY.keys()) {
      const dist = Math.abs(key - sysMid);
      if (dist < bestDist) {
        bestDist = dist;
        bestKey = key;
      }
    }
    if (bestKey < 0 || bestDist > 20) return undefined;

    const xs = byY.get(bestKey)!.sort((a, b) => a - b);
    // Convert to fractions of page width
    return xs.map((x) => x / pageWidth);
  });
}

function detectSystems(svgContent: string, pageHeight: number): SystemInfo[] {
  // Staff lines are horizontal lines with stroke-width="0.1000" at distinct y-positions.
  // Each piano system has 10 staff lines (2 staves × 5 lines).
  // Lines are inside <g transform="translate(x, y)"> groups.
  const lineGroupPattern =
    /<g transform="translate\([\d.]+,\s*([\d.]+)\)">\s*<line[^>]*stroke-width="0\.1000"[^>]*x2="([\d.]+)"[^>]*\/>/g;
  const staffLineYs: number[] = [];
  let match;
  while ((match = lineGroupPattern.exec(svgContent))) {
    const y = parseFloat(match[1]);
    const width = parseFloat(match[2]);
    if (width > 50) {
      staffLineYs.push(y);
    }
  }

  if (staffLineYs.length === 0) return [];

  staffLineYs.sort((a, b) => a - b);
  const uniqueYs: number[] = [staffLineYs[0]];
  for (let i = 1; i < staffLineYs.length; i++) {
    if (staffLineYs[i] - uniqueYs[uniqueYs.length - 1] > 0.01) {
      uniqueYs.push(staffLineYs[i]);
    }
  }

  // Group into systems. Intra-system gap <8, inter-system gap >8.
  const rawSystems: { top: number; bottom: number }[] = [];
  let groupStart = uniqueYs[0];
  let groupEnd = uniqueYs[0];

  for (let i = 1; i < uniqueYs.length; i++) {
    if (uniqueYs[i] - groupEnd < 8) {
      groupEnd = uniqueYs[i];
    } else {
      rawSystems.push({ top: groupStart - 2, bottom: groupEnd + 6 });
      groupStart = uniqueYs[i];
      groupEnd = uniqueYs[i];
    }
  }
  rawSystems.push({ top: groupStart - 2, bottom: groupEnd + 6 });

  // Compute non-overlapping clip bounds using midpoints between adjacent systems
  return rawSystems.map((sys, i) => {
    const safeTop = i === 0
      ? Math.max(0, sys.top - 2)
      : (rawSystems[i - 1].bottom + sys.top) / 2;
    const safeBottom = i === rawSystems.length - 1
      ? Math.min(pageHeight, sys.bottom + 2)
      : (sys.bottom + rawSystems[i + 1].top) / 2;
    return { y: safeTop, height: safeBottom - safeTop };
  });
}

interface MeasureTiming {
  timeStart: number;
  timeEnd: number;
}

function computeMeasureTimings(midiPath: string): MeasureTiming[] {
  const buf = readFileSync(midiPath);
  const midi = new Midi(buf);
  const ppq = midi.header.ppq;
  const tempos = midi.header.tempos.length > 0 ? midi.header.tempos : [{ bpm: 120, ticks: 0 }];
  const timeSigs =
    midi.header.timeSignatures.length > 0
      ? midi.header.timeSignatures
      : [{ ticks: 0, timeSignature: [4, 4] as [number, number] }];

  const totalDuration = midi.duration;

  // Compute measure boundaries in ticks
  const measureTicks: number[] = [0];
  let currentTimeSigIdx = 0;
  let tick = 0;

  while (tick < totalDuration * 1000) {
    // rough upper bound
    // Get current time signature
    while (
      currentTimeSigIdx < timeSigs.length - 1 &&
      timeSigs[currentTimeSigIdx + 1].ticks <= tick
    ) {
      currentTimeSigIdx++;
    }
    const ts = timeSigs[currentTimeSigIdx].timeSignature;
    const beatsPerMeasure = ts[0];
    const beatUnit = ts[1];
    const ticksPerMeasure = (ppq * 4 * beatsPerMeasure) / beatUnit;

    tick += ticksPerMeasure;
    measureTicks.push(tick);

    if (measureTicks.length > 500) break;
  }

  // Convert ticks to seconds using the tempo map
  const measures: MeasureTiming[] = [];
  for (let i = 0; i < measureTicks.length - 1; i++) {
    const startSec = midi.header.ticksToSeconds(measureTicks[i]);
    const endSec = midi.header.ticksToSeconds(measureTicks[i + 1]);
    if (startSec >= totalDuration + 1) break;
    const tStart = Math.round(startSec * 1000) / 1000;
    const tEnd = Math.round(Math.min(endSec, totalDuration) * 1000) / 1000;
    measures.push({
      timeStart: tStart,
      timeEnd: Math.max(tEnd, tStart),
    });
  }

  return measures;
}

interface TimingMap {
  pages: Array<{
    file: string;
    viewBox: [number, number];
    systems: Array<{
      y: number;
      height: number;
      firstMeasure: number;
      measureCount: number;
      barlineXs?: number[];
    }>;
  }>;
  measures: MeasureTiming[];
}

function buildTimingMap(
  svgFiles: string[],
  svgDir: string,
  midiPath: string,
): TimingMap {
  const measures = computeMeasureTimings(midiPath);
  const pages: TimingMap['pages'] = [];
  let totalSystems = 0;

  // First pass: count all systems across all pages, detect barlines
  const allPageSystems: { pageIdx: number; systems: SystemInfo[]; barlineGroups: (number[] | undefined)[] }[] = [];
  for (let i = 0; i < svgFiles.length; i++) {
    const svgContent = readFileSync(join(svgDir, svgFiles[i]), 'utf-8');

    // Parse viewBox
    const vbMatch = svgContent.match(/viewBox="[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/);
    const vw = vbMatch ? parseFloat(vbMatch[1]) : 210;
    const vh = vbMatch ? parseFloat(vbMatch[2]) : 297;

    const systems = detectSystems(svgContent, vh);

    const barlines = detectBarlines(svgContent);
    const barlineGroups = assignBarlinesToSystems(barlines, systems, vw);

    allPageSystems.push({ pageIdx: i, systems, barlineGroups });
    totalSystems += systems.length;

    pages.push({
      file: `page-${i + 1}.svg`,
      viewBox: [vw, vh],
      systems: [],
    });
  }

  if (totalSystems === 0) {
    // Fallback: treat entire SVG as one system
    totalSystems = svgFiles.length;
    for (let i = 0; i < svgFiles.length; i++) {
      allPageSystems[i].systems = [{ y: 20, height: 100 }];
    }
  }

  // Use barline count as the visual measure count per system.
  // This handles repeats: MIDI has unfolded measures but the sheet shows visual layout only.
  const systemVisualCounts: number[] = [];
  let totalVisualMeasures = 0;
  for (const ps of allPageSystems) {
    for (let s = 0; s < ps.systems.length; s++) {
      const bxs = ps.barlineGroups[s];
      const count = bxs ? bxs.length : 0;
      systemVisualCounts.push(count);
      totalVisualMeasures += count;
    }
  }

  // Fallback: if barline detection gave nothing, distribute evenly
  if (totalVisualMeasures === 0) {
    const mps = Math.max(1, Math.floor(measures.length / totalSystems));
    let idx = 0;
    for (let i = 0; i < systemVisualCounts.length; i++) {
      const isLast = i === systemVisualCounts.length - 1;
      systemVisualCounts[i] = isLast ? measures.length - idx : mps;
      idx += systemVisualCounts[i];
    }
    totalVisualMeasures = measures.length;
  }

  let measureIdx = 0;
  let sysGlobalIdx = 0;
  for (let p = 0; p < allPageSystems.length; p++) {
    const { systems, barlineGroups } = allPageSystems[p];
    for (let s = 0; s < systems.length; s++) {
      const mc = systemVisualCounts[sysGlobalIdx];
      const entry: TimingMap['pages'][number]['systems'][number] = {
        y: systems[s].y,
        height: systems[s].height,
        firstMeasure: measureIdx,
        measureCount: mc,
      };
      const bxs = barlineGroups[s];
      if (bxs && bxs.length >= 2) {
        entry.barlineXs = bxs;
      }
      pages[p].systems.push(entry);
      measureIdx += mc;
      sysGlobalIdx++;
    }
  }

  return { pages, measures };
}

async function compileEntry(entry: CompileEntry): Promise<boolean> {
  const outDir = join(PUBLIC_SHEET, entry.genre, entry.id);

  // Check if already compiled
  if (!FORCE && existsSync(join(outDir, 'timing.json'))) {
    return true; // already done
  }

  const tmpDir = join(TMP, entry.id);
  mkdirSync(tmpDir, { recursive: true });

  let lyFilePath: string;

  if (entry.isZip) {
    const extractDir = join(tmpDir, 'extracted');
    if (!extractZip(entry.lyPath, extractDir)) {
      console.log(`  FAIL ${entry.genre}/${entry.id} (zip extraction failed)`);
      return false;
    }
    const mainLy = findMainLyInZip(extractDir, entry.id);
    if (!mainLy) {
      console.log(`  FAIL ${entry.genre}/${entry.id} (no main .ly file in zip)`);
      return false;
    }
    lyFilePath = mainLy;
  } else {
    lyFilePath = entry.lyPath;
  }

  // Compile LY to SVG
  const compileDir = join(tmpDir, 'output');
  let svgFiles: string[];
  try {
    svgFiles = compileLy(lyFilePath, compileDir);
  } catch (err: any) {
    console.log(`  FAIL ${entry.genre}/${entry.id} (${err.message?.slice(0, 80)})`);
    return false;
  }

  if (svgFiles.length === 0) {
    console.log(`  FAIL ${entry.genre}/${entry.id} (no SVG output)`);
    return false;
  }

  // Post-process and copy SVGs to output
  mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < svgFiles.length; i++) {
    const raw = readFileSync(join(compileDir, svgFiles[i]), 'utf-8');
    const processed = postProcessSvg(raw);
    writeFileSync(join(outDir, `page-${i + 1}.svg`), processed);
  }

  // Build timing map
  const timingMap = buildTimingMap(
    svgFiles.map((_, i) => `page-${i + 1}.svg`),
    outDir,
    entry.midiPath,
  );
  writeFileSync(join(outDir, 'timing.json'), JSON.stringify(timingMap));

  const totalSys = timingMap.pages.reduce((s, p) => s + p.systems.length, 0);
  console.log(
    `  ok   ${entry.genre}/${entry.id} (${svgFiles.length} page${svgFiles.length > 1 ? 's' : ''}, ${totalSys} systems, ${timingMap.measures.length} measures)`,
  );
  return true;
}

async function main() {
  const entries = buildEntryList();
  console.log(`Found ${entries.length} songs with LY + MIDI files`);

  if (VERIFY_ONLY) {
    let compiled = 0;
    let missing = 0;
    for (const e of entries) {
      const outDir = join(PUBLIC_SHEET, e.genre, e.id);
      if (existsSync(join(outDir, 'timing.json'))) {
        compiled++;
      } else {
        console.log(`  MISSING ${e.genre}/${e.id}`);
        missing++;
      }
    }
    console.log(`\n${compiled}/${entries.length} compiled, ${missing} missing`);
    return;
  }

  mkdirSync(TMP, { recursive: true });

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const outDir = join(PUBLIC_SHEET, entry.genre, entry.id);
    if (!FORCE && existsSync(join(outDir, 'timing.json'))) {
      skipped++;
      continue;
    }

    const success = await compileEntry(entry);
    if (success) ok++;
    else failed++;

    // Clean up temp
    try {
      rmSync(join(TMP, entry.id), { recursive: true, force: true });
    } catch {}
  }

  // Write manifest
  const manifest: string[] = [];
  for (const e of entries) {
    if (existsSync(join(PUBLIC_SHEET, e.genre, e.id, 'timing.json'))) {
      manifest.push(e.id);
    }
  }
  writeFileSync(
    join(PUBLIC_SHEET, 'manifest.json'),
    JSON.stringify({ songs: manifest }, null, 2),
  );

  // Cleanup
  try {
    rmSync(TMP, { recursive: true, force: true });
  } catch {}

  console.log(`\nSheets: ${ok} compiled, ${skipped} skipped, ${failed} failed`);
  console.log(`Manifest: ${manifest.length} songs with sheet music`);

  if (failed > 0) {
    console.log(`\n${failed} failures`);
    process.exit(1);
  }
}

main().catch(console.error);
