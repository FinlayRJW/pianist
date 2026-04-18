import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import ToneJsMidi from '@tonejs/midi';
const { Midi } = ToneJsMidi;

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');
const TEMP_DIR = join(import.meta.dirname, '..', '.maestro-temp');
const CSV_URL = 'https://storage.googleapis.com/magentadata/datasets/maestro/v3.0.0/maestro-v3.0.0.csv';
const MIDI_BASE = 'https://storage.googleapis.com/magentadata/datasets/maestro/v3.0.0/';

interface MaestroMapping {
  id: string;
  genre: string;
  searchComposer: string;
  searchTitle: string;
}

const DESIRED_PIECES: MaestroMapping[] = [
  // ROMANTIC (not in download-all-midis.ts)
  { id: 'chopin-prelude-e-minor', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Prelude' },
  { id: 'chopin-nocturne-op9-2', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Nocturne' },
  { id: 'chopin-prelude-raindrop', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Prelude' },
  { id: 'chopin-etude-op10-3', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'chopin-ballade-1', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Ballade' },
  { id: 'chopin-etude-op10-12', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'chopin-polonaise-53', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Polonaise' },
  { id: 'chopin-scherzo-2', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Scherzo' },
  { id: 'liszt-liebestraum-3', genre: 'romantic', searchComposer: 'Franz Liszt', searchTitle: 'Liebes' },
  { id: 'schumann-arabesque', genre: 'romantic', searchComposer: 'Robert Schumann', searchTitle: 'Arabesque' },
  { id: 'brahms-intermezzo-op118-2', genre: 'romantic', searchComposer: 'Johannes Brahms', searchTitle: 'Op. 118' },
  { id: 'schubert-impromptu-op90-3', genre: 'romantic', searchComposer: 'Franz Schubert', searchTitle: 'Impromptu' },
  { id: 'schubert-impromptu-op90-2', genre: 'romantic', searchComposer: 'Franz Schubert', searchTitle: 'Impromptu' },
  { id: 'grieg-waltz-op12-2', genre: 'romantic', searchComposer: 'Edvard Grieg', searchTitle: 'Waltz' },
  { id: 'rachmaninoff-prelude-csharp', genre: 'romantic', searchComposer: 'Sergei Rachmaninoff', searchTitle: 'C' },

  // IMPRESSIONIST (not in download-all-midis.ts)
  { id: 'debussy-reverie', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Rever' },
  { id: 'debussy-girl-flaxen-hair', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Flaxen' },
  { id: 'debussy-doctor-gradus', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Gradus' },

  // ADVANCED (not in download-all-midis.ts)
  { id: 'liszt-la-campanella', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Campanella' },
  { id: 'liszt-hungarian-rhapsody-2', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Hungarian Rhapsody No. 2' },
  { id: 'liszt-mephisto-waltz-1', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Mephisto' },
  { id: 'scriabin-etude-op8-12', genre: 'advanced', searchComposer: 'Alexander Scriabin', searchTitle: 'Etude Op. 8' },
  { id: 'rachmaninoff-etude-op39-5', genre: 'advanced', searchComposer: 'Sergei Rachmaninoff', searchTitle: 'Etude' },
  { id: 'mussorgsky-pictures', genre: 'advanced', searchComposer: 'Modest Mussorgsky', searchTitle: 'Pictures' },
  { id: 'chopin-etude-op10-4', genre: 'advanced', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'beethoven-appassionata-1', genre: 'advanced', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Appassionata' },
];

interface CsvRow {
  canonical_composer: string;
  canonical_title: string;
  midi_filename: string;
  duration: string;
}

async function parseCsv(csvText: string): Promise<CsvRow[]> {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += char;
    }
    values.push(current.trim());

    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
    rows.push(obj as unknown as CsvRow);
  }
  return rows;
}

function findBestMatch(rows: CsvRow[], mapping: MaestroMapping): CsvRow | null {
  const candidates = rows.filter(r =>
    r.canonical_composer.includes(mapping.searchComposer) &&
    r.canonical_title.includes(mapping.searchTitle)
  );

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
  return candidates[0];
}

function normalizeToTwoTracks(filePath: string): void {
  const buf = readFileSync(filePath);
  if (buf.length < 50 || buf.slice(0, 4).toString() !== 'MThd') return;

  const midi = new Midi(buf);
  const tracksWithNotes = midi.tracks.filter((t: any) => t.notes.length > 0);
  if (tracksWithNotes.length === 0) return;
  if (tracksWithNotes.length === 2) {
    const t0Name = tracksWithNotes[0].name.toLowerCase();
    const t1Name = tracksWithNotes[1].name.toLowerCase();
    const rhPatterns = ['right', 'upper', 'up:', 'piano r', 'treble', 'rh', 'one'];
    const lhPatterns = ['left', 'lower', 'down:', 'piano l', 'bass', 'lh', 'two'];
    if (rhPatterns.some(p => t0Name.includes(p)) || lhPatterns.some(p => t1Name.includes(p))) {
      return;
    }
  }

  const allNotes = tracksWithNotes.flatMap((t: any) =>
    t.notes.map((n: any) => ({ midi: n.midi, time: n.time, duration: n.duration, velocity: Math.round(n.velocity * 127) }))
  );

  const rightNotes = allNotes.filter((n: any) => n.midi >= 60);
  const leftNotes = allNotes.filter((n: any) => n.midi < 60);

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

  writeFileSync(filePath, Buffer.from(newMidi.toArray()));
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    execSync(`curl -sL -o "${destPath}" "${url}"`, { timeout: 30000 });
    const buf = readFileSync(destPath);
    if (buf.length < 50 || buf.slice(0, 4).toString() !== 'MThd') {
      execSync(`rm -f "${destPath}"`);
      return false;
    }
    return true;
  } catch {
    try { execSync(`rm -f "${destPath}"`); } catch {}
    return false;
  }
}

async function main() {
  console.log('Downloading MAESTRO metadata...');
  const csvText = execSync(`curl -sL "${CSV_URL}"`).toString();
  const rows = await parseCsv(csvText);
  console.log(`Found ${rows.length} entries in MAESTRO dataset\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const mapping of DESIRED_PIECES) {
    const destDir = join(PUBLIC_DIR, mapping.genre);
    const destPath = join(destDir, `${mapping.id}.mid`);

    if (existsSync(destPath)) {
      try {
        normalizeToTwoTracks(destPath);
        const normalized = new Midi(readFileSync(destPath));
        const noteTrackCount = normalized.tracks.filter((t: any) => t.notes.length > 0).length;
        console.log(`  ⏭ ${mapping.genre}/${mapping.id}.mid (exists, ${noteTrackCount} tracks)`);
      } catch {
        console.log(`  ⏭ ${mapping.genre}/${mapping.id}.mid (already exists)`);
      }
      skipped++;
      continue;
    }

    const match = findBestMatch(rows, mapping);
    if (!match) {
      console.log(`  ✗ ${mapping.genre}/${mapping.id}.mid - no match found for "${mapping.searchComposer} / ${mapping.searchTitle}"`);
      failed++;
      continue;
    }

    const url = MIDI_BASE + encodeURIComponent(match.midi_filename).replace(/%2F/g, '/');
    mkdirSync(destDir, { recursive: true });

    const ok = await downloadFile(url, destPath);
    if (ok) {
      try {
        normalizeToTwoTracks(destPath);
        const normalized = new Midi(readFileSync(destPath));
        const rh = normalized.tracks[0]?.notes.length ?? 0;
        const lh = normalized.tracks[1]?.notes.length ?? 0;
        console.log(`  ✓ ${mapping.genre}/${mapping.id}.mid (R:${rh} L:${lh}, ${match.canonical_composer}: ${match.canonical_title})`);
      } catch {
        console.log(`  ✓ ${mapping.genre}/${mapping.id}.mid (${match.canonical_composer}: ${match.canonical_title})`);
      }
      downloaded++;
    } else {
      console.log(`  ✗ ${mapping.genre}/${mapping.id}.mid - download failed`);
      failed++;
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
