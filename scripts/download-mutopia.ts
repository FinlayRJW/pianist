import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { ALL_CATALOG_ENTRIES } from '../src/data/song-catalog';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC_MIDI = join(ROOT, 'public', 'midi');
const PUBLIC_LY = join(ROOT, 'public', 'ly');
const MUTOPIA = 'https://www.mutopiaproject.org/ftp';
const TMP = join(ROOT, '.tmp-downloads');

const FORCE = process.argv.includes('--force');
const VERIFY_ONLY = process.argv.includes('--verify');
const MIDI_ONLY = process.argv.includes('--midi-only');
const LY_ONLY = process.argv.includes('--ly-only');

interface MidZipEntry {
  songId: string;
  zipFile: string;
}

const MID_ZIP_EXTRACT: Record<string, string> = {
  'moonlight-sonata': 'moonlight1.mid',
  'beethoven-moonlight-mvt1': 'moonlight1.mid',
  'beethoven-moonlight-3': 'moonlight3.mid',
  'bach-italian-concerto': 'piano.mid',
  'clementi-sonatina-op36-1': 'sonatina-1.mid',
};

function splitByPitch(allNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>, splitPoint = 60) {
  const rightNotes = allNotes.filter(n => n.midi >= splitPoint);
  const leftNotes = allNotes.filter(n => n.midi < splitPoint);
  return { rightNotes, leftNotes };
}

function normalizeToTwoTracks(inputBuffer: Buffer): Buffer {
  const midi = new Midi(inputBuffer);
  const tracksWithNotes = midi.tracks.filter(t => t.notes.length > 0);

  if (tracksWithNotes.length === 0) {
    throw new Error('No notes found in MIDI file');
  }

  const collectNotes = (tracks: typeof tracksWithNotes) =>
    tracks.flatMap(t => t.notes.map(n => ({
      midi: n.midi,
      time: n.time,
      duration: n.duration,
      velocity: Math.round(n.velocity * 127),
    })));

  let rightNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>;
  let leftNotes: Array<{ midi: number; time: number; duration: number; velocity: number }>;

  if (tracksWithNotes.length === 2) {
    const t0Name = tracksWithNotes[0].name.toLowerCase();
    const t1Name = tracksWithNotes[1].name.toLowerCase();

    const rightPatterns = ['right', 'upper', 'up:', 'piano r', 'treble', 'rh', 'one'];
    const leftPatterns = ['left', 'lower', 'down:', 'piano l', 'bass', 'lh', 'two'];

    const t0IsRight = rightPatterns.some(p => t0Name.includes(p));
    const t1IsLeft = leftPatterns.some(p => t1Name.includes(p));
    const t0IsLeft = leftPatterns.some(p => t0Name.includes(p));
    const t1IsRight = rightPatterns.some(p => t1Name.includes(p));

    const extract = (track: typeof tracksWithNotes[0]) =>
      track.notes.map(n => ({ midi: n.midi, time: n.time, duration: n.duration, velocity: Math.round(n.velocity * 127) }));

    if (t0IsRight || t1IsLeft) {
      rightNotes = extract(tracksWithNotes[0]);
      leftNotes = extract(tracksWithNotes[1]);
    } else if (t0IsLeft || t1IsRight) {
      rightNotes = extract(tracksWithNotes[1]);
      leftNotes = extract(tracksWithNotes[0]);
    } else {
      const avg0 = tracksWithNotes[0].notes.reduce((s, n) => s + n.midi, 0) / tracksWithNotes[0].notes.length;
      const avg1 = tracksWithNotes[1].notes.reduce((s, n) => s + n.midi, 0) / tracksWithNotes[1].notes.length;
      if (avg0 >= avg1) {
        rightNotes = extract(tracksWithNotes[0]);
        leftNotes = extract(tracksWithNotes[1]);
      } else {
        rightNotes = extract(tracksWithNotes[1]);
        leftNotes = extract(tracksWithNotes[0]);
      }
    }
  } else {
    const allNotes = collectNotes(tracksWithNotes);
    ({ rightNotes, leftNotes } = splitByPitch(allNotes));
  }

  const newMidi = new Midi();
  newMidi.header.setTempo(midi.header.tempos[0]?.bpm ?? 120);
  newMidi.header.timeSignatures = midi.header.timeSignatures;
  newMidi.header.name = midi.header.name;

  const rhTrack = newMidi.addTrack();
  rhTrack.name = 'Right Hand';
  rhTrack.channel = 0;
  for (const n of rightNotes) {
    rhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: n.velocity / 127 });
  }

  const lhTrack = newMidi.addTrack();
  lhTrack.name = 'Left Hand';
  lhTrack.channel = 1;
  for (const n of leftNotes) {
    lhTrack.addNote({ midi: n.midi, time: n.time, duration: n.duration, velocity: n.velocity / 127 });
  }

  return Buffer.from(newMidi.toArray());
}

function curlDownload(url: string, destPath: string): boolean {
  try {
    mkdirSync(dirname(destPath), { recursive: true });
    execSync(`curl -sL --max-time 30 -o "${destPath}" "${url}"`, { timeout: 35000 });
    return existsSync(destPath) && readFileSync(destPath).length > 10;
  } catch {
    return false;
  }
}

function downloadMidiFromZip(zipUrl: string, extractFile: string, destPath: string): boolean {
  mkdirSync(TMP, { recursive: true });
  const zipPath = join(TMP, 'temp.zip');
  try {
    if (!curlDownload(zipUrl, zipPath)) return false;
    const extractDir = join(TMP, 'extract');
    mkdirSync(extractDir, { recursive: true });
    execSync(`unzip -o -j "${zipPath}" "${extractFile}" -d "${extractDir}"`, { timeout: 10000 });
    const extractedPath = join(extractDir, extractFile);
    if (!existsSync(extractedPath)) return false;
    mkdirSync(dirname(destPath), { recursive: true });
    const buf = readFileSync(extractedPath);
    writeFileSync(destPath, buf);
    execSync(`rm -rf "${extractDir}" "${zipPath}"`);
    return true;
  } catch {
    try { execSync(`rm -rf "${TMP}"`); } catch {}
    return false;
  }
}

function downloadLyFile(mutopiaPath: string, lyDir: boolean | undefined, destPath: string): boolean {
  mkdirSync(dirname(destPath), { recursive: true });

  if (!lyDir) {
    return curlDownload(`${MUTOPIA}/${mutopiaPath}.ly`, destPath);
  }

  // LY is in a -lys/ directory - download the zip
  const pathParts = mutopiaPath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const parentDir = pathParts.slice(0, -1).join('/');
  const zipUrl = `${MUTOPIA}/${parentDir}/${fileName}-lys.zip`;
  const zipDest = destPath.replace(/\.ly$/, '-lys.zip');
  return curlDownload(zipUrl, zipDest);
}

interface DownloadEntry {
  id: string;
  destSubdir: string;
  mutopiaPath: string;
  midZip?: string;
  lyDir?: boolean;
}

function buildDownloadList(): DownloadEntry[] {
  const entries: DownloadEntry[] = [];

  for (const song of ALL_CATALOG_ENTRIES) {
    if (!song.mutopiaPath) continue;

    const destSubdir = song.journeySong ? 'journey' : song.genre;

    entries.push({
      id: song.id,
      destSubdir,
      mutopiaPath: song.mutopiaPath,
      midZip: song.midZip,
      lyDir: song.lyDir,
    });
  }

  return entries;
}

async function downloadMidis(entries: DownloadEntry[]) {
  console.log('\n=== Downloading MIDI files ===\n');
  let ok = 0, skipped = 0, failed = 0;

  // Deduplicate by mutopiaPath to avoid re-downloading shared sources
  const byPath = new Map<string, DownloadEntry[]>();
  for (const e of entries) {
    const key = e.mutopiaPath + (e.midZip ? `|${MID_ZIP_EXTRACT[e.id] ?? ''}` : '');
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key)!.push(e);
  }

  for (const [, group] of byPath) {
    const first = group[0];
    const tmpPath = join(TMP, 'midi-tmp.mid');
    mkdirSync(TMP, { recursive: true });

    // Check if all destinations already exist
    const allExist = group.every(e => {
      const dest = join(PUBLIC_MIDI, e.destSubdir, `${e.id}.mid`);
      return existsSync(dest) && !FORCE;
    });
    if (allExist) {
      for (const e of group) {
        console.log(`  skip ${e.destSubdir}/${e.id}.mid`);
        skipped++;
      }
      continue;
    }

    // Download MIDI
    let downloaded = false;
    if (first.midZip) {
      const extractFile = MID_ZIP_EXTRACT[first.id] ?? `${first.mutopiaPath.split('/').pop()}.mid`;
      downloaded = downloadMidiFromZip(`${MUTOPIA}/${first.midZip}.zip`, extractFile, tmpPath);
    } else {
      downloaded = curlDownload(`${MUTOPIA}/${first.mutopiaPath}.mid`, tmpPath);
    }

    if (!downloaded) {
      for (const e of group) {
        console.log(`  FAIL ${e.destSubdir}/${e.id}.mid (download failed)`);
        failed++;
      }
      continue;
    }

    // Normalize to 2 tracks
    try {
      const rawBuf = readFileSync(tmpPath);
      if (rawBuf.length < 50 || rawBuf.slice(0, 4).toString() !== 'MThd') {
        throw new Error('Invalid MIDI file');
      }
      const normalizedBuf = normalizeToTwoTracks(rawBuf);
      const check = new Midi(normalizedBuf);
      const rh = check.tracks[0]?.notes.length ?? 0;
      const lh = check.tracks[1]?.notes.length ?? 0;

      for (const e of group) {
        const dest = join(PUBLIC_MIDI, e.destSubdir, `${e.id}.mid`);
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, normalizedBuf);
        console.log(`  ok   ${e.destSubdir}/${e.id}.mid (R:${rh} L:${lh}, ${normalizedBuf.length}b)`);
        ok++;
      }
    } catch (err: any) {
      for (const e of group) {
        console.log(`  FAIL ${e.destSubdir}/${e.id}.mid (${err.message})`);
        failed++;
      }
    }

    try { unlinkSync(tmpPath); } catch {}
  }

  console.log(`\nMIDI: ${ok} downloaded, ${skipped} skipped, ${failed} failed`);
  return failed;
}

async function downloadLyFiles(entries: DownloadEntry[]) {
  console.log('\n=== Downloading LY files ===\n');
  let ok = 0, skipped = 0, failed = 0;

  const byPath = new Map<string, DownloadEntry[]>();
  for (const e of entries) {
    if (!byPath.has(e.mutopiaPath)) byPath.set(e.mutopiaPath, []);
    byPath.get(e.mutopiaPath)!.push(e);
  }

  for (const [, group] of byPath) {
    const first = group[0];

    const allExist = group.every(e => {
      const dest = join(PUBLIC_LY, e.destSubdir, first.lyDir ? `${e.id}-lys.zip` : `${e.id}.ly`);
      return existsSync(dest) && !FORCE;
    });
    if (allExist) {
      for (const e of group) {
        console.log(`  skip ${e.destSubdir}/${e.id}.ly`);
        skipped++;
      }
      continue;
    }

    // Download LY
    const tmpPath = join(TMP, first.lyDir ? 'ly-tmp.zip' : 'ly-tmp.ly');
    mkdirSync(TMP, { recursive: true });

    let downloaded = false;
    if (first.lyDir) {
      const pathParts = first.mutopiaPath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const parentDir = pathParts.slice(0, -1).join('/');
      const zipUrl = `${MUTOPIA}/${parentDir}/${fileName}-lys.zip`;
      downloaded = curlDownload(zipUrl, tmpPath);
    } else {
      downloaded = curlDownload(`${MUTOPIA}/${first.mutopiaPath}.ly`, tmpPath);
    }

    if (!downloaded) {
      for (const e of group) {
        console.log(`  FAIL ${e.destSubdir}/${e.id}.ly`);
        failed++;
      }
      continue;
    }

    const srcBuf = readFileSync(tmpPath);
    for (const e of group) {
      const ext = first.lyDir ? '-lys.zip' : '.ly';
      const dest = join(PUBLIC_LY, e.destSubdir, `${e.id}${ext}`);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, srcBuf);
      console.log(`  ok   ${e.destSubdir}/${e.id}${ext} (${srcBuf.length}b)`);
      ok++;
    }

    try { unlinkSync(tmpPath); } catch {}
  }

  console.log(`\nLY: ${ok} downloaded, ${skipped} skipped, ${failed} failed`);
  return failed;
}

async function main() {
  const entries = buildDownloadList();
  console.log(`Found ${entries.length} songs with Mutopia paths`);

  if (VERIFY_ONLY) {
    console.log('\n--verify mode: checking which files exist locally\n');
    let missing = 0;
    for (const e of entries) {
      const midiPath = join(PUBLIC_MIDI, e.destSubdir, `${e.id}.mid`);
      const midiOk = existsSync(midiPath);
      if (!midiOk) {
        console.log(`  MISSING ${e.destSubdir}/${e.id}.mid`);
        missing++;
      }
    }
    console.log(`\n${entries.length - missing}/${entries.length} MIDI files present, ${missing} missing`);
    return;
  }

  mkdirSync(TMP, { recursive: true });

  let totalFailed = 0;
  if (!LY_ONLY) totalFailed += await downloadMidis(entries);
  if (!MIDI_ONLY) totalFailed += await downloadLyFiles(entries);

  // Cleanup
  try { execSync(`rm -rf "${TMP}"`); } catch {}

  if (totalFailed > 0) {
    console.log(`\n${totalFailed} total failures`);
    process.exit(1);
  }
  console.log('\nAll downloads complete!');
}

main().catch(console.error);
