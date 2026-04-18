import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';
import { join, basename } from 'path';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');
const ZIP_PATH = '/tmp/maestro-midi.zip';
const EXTRACT_DIR = '/tmp/maestro-extract';

interface Mapping {
  id: string;
  genre: string;
  composer: string;
  title: string;
}

const WANTED: Mapping[] = [
  // BAROQUE
  { id: 'prelude-in-c', genre: 'baroque', composer: 'Bach', title: 'Prelude' },
  { id: 'canon-in-d', genre: 'baroque', composer: 'Pachelbel', title: 'Canon' },

  // CLASSICAL
  { id: 'fur-elise', genre: 'classical', composer: 'Beethoven', title: 'Elise' },
  { id: 'moonlight-sonata', genre: 'classical', composer: 'Beethoven', title: 'Sonata No. 14' },
  { id: 'beethoven-bagatelle-op119-1', genre: 'classical', composer: 'Beethoven', title: 'Bagatelle' },

  // ROMANTIC
  { id: 'chopin-prelude-e-minor', genre: 'romantic', composer: 'Chopin', title: 'Prelude' },
  { id: 'chopin-nocturne-op9-2', genre: 'romantic', composer: 'Chopin', title: 'Nocturne Op. 9 No. 2' },
  { id: 'chopin-waltz-minute', genre: 'romantic', composer: 'Chopin', title: 'Waltz' },
  { id: 'chopin-waltz-csharp-minor', genre: 'romantic', composer: 'Chopin', title: 'Waltz' },
  { id: 'chopin-prelude-raindrop', genre: 'romantic', composer: 'Chopin', title: 'Prelude' },
  { id: 'chopin-etude-op10-3', genre: 'romantic', composer: 'Chopin', title: 'Etude' },
  { id: 'chopin-ballade-1', genre: 'romantic', composer: 'Chopin', title: 'Ballade No. 1' },
  { id: 'chopin-etude-op10-12', genre: 'romantic', composer: 'Chopin', title: 'Etude' },
  { id: 'chopin-polonaise-53', genre: 'romantic', composer: 'Chopin', title: 'Polonaise' },
  { id: 'chopin-scherzo-2', genre: 'romantic', composer: 'Chopin', title: 'Scherzo No. 2' },
  { id: 'liszt-liebestraum-3', genre: 'romantic', composer: 'Liszt', title: 'Liebes' },
  { id: 'schumann-traumerei', genre: 'romantic', composer: 'Schumann', title: 'Kinderszenen' },
  { id: 'schumann-arabesque', genre: 'romantic', composer: 'Schumann', title: 'Arabes' },
  { id: 'brahms-intermezzo-op118-2', genre: 'romantic', composer: 'Brahms', title: 'Op. 118' },
  { id: 'schubert-impromptu-op90-3', genre: 'romantic', composer: 'Schubert', title: 'Impromptu' },
  { id: 'schubert-impromptu-op90-2', genre: 'romantic', composer: 'Schubert', title: 'Impromptu' },
  { id: 'grieg-waltz-op12-2', genre: 'romantic', composer: 'Grieg', title: '' },
  { id: 'rachmaninoff-prelude-csharp', genre: 'romantic', composer: 'Rachmaninoff', title: 'C' },

  // IMPRESSIONIST
  { id: 'debussy-arabesque-1', genre: 'impressionist', composer: 'Debussy', title: 'Arabesque' },
  { id: 'debussy-clair-de-lune', genre: 'impressionist', composer: 'Debussy', title: 'Clair' },
  { id: 'debussy-reverie', genre: 'impressionist', composer: 'Debussy', title: 'verie' },
  { id: 'debussy-girl-flaxen-hair', genre: 'impressionist', composer: 'Debussy', title: '' },
  { id: 'debussy-doctor-gradus', genre: 'impressionist', composer: 'Debussy', title: 'Gradus' },

  // ADVANCED
  { id: 'liszt-la-campanella', genre: 'advanced', composer: 'Liszt', title: 'Campanella' },
  { id: 'liszt-hungarian-rhapsody-2', genre: 'advanced', composer: 'Liszt', title: 'Hungarian Rhapsody No. 2' },
  { id: 'liszt-mephisto-waltz-1', genre: 'advanced', composer: 'Liszt', title: 'Mephisto' },
  { id: 'chopin-etude-op10-4', genre: 'advanced', composer: 'Chopin', title: 'Etude' },
  { id: 'beethoven-appassionata-1', genre: 'advanced', composer: 'Beethoven', title: 'Sonata No. 23' },
  { id: 'scriabin-etude-op8-12', genre: 'advanced', composer: 'Scriabin', title: 'Etude Op. 8' },
  { id: 'rachmaninoff-etude-op39-5', genre: 'advanced', composer: 'Rachmaninoff', title: 'Etude' },
  { id: 'mussorgsky-pictures', genre: 'advanced', composer: 'Mussorgsky', title: 'Pictures' },
  { id: 'chopin-fantaisie-impromptu', genre: 'advanced', composer: 'Chopin', title: 'Fantaisie' },
  { id: 'beethoven-moonlight-3', genre: 'advanced', composer: 'Beethoven', title: 'Sonata No. 14' },
];

interface CsvRow {
  composer: string;
  title: string;
  midi_filename: string;
  duration: number;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split('\n');
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values: string[] = [];
    let current = '', inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    values.push(current.trim());
    if (values.length >= 7) {
      rows.push({
        composer: values[0],
        title: values[1],
        midi_filename: values[4],
        duration: parseFloat(values[6]),
      });
    }
  }
  return rows;
}

async function main() {
  console.log('Fetching MAESTRO CSV...');
  const csvText = execSync('curl -sL "https://storage.googleapis.com/magentadata/datasets/maestro/v3.0.0/maestro-v3.0.0.csv"').toString();
  const rows = parseCsv(csvText);
  console.log(`${rows.length} entries\n`);

  execSync(`rm -rf "${EXTRACT_DIR}" && mkdir -p "${EXTRACT_DIR}"`);

  let extracted = 0, skipped = 0, missed = 0;

  for (const want of WANTED) {
    const destDir = join(PUBLIC_DIR, want.genre);
    mkdirSync(destDir, { recursive: true });
    const destPath = join(destDir, `${want.id}.mid`);

    // Skip if already have a substantial file
    if (existsSync(destPath)) {
      try {
        const buf = readFileSync(destPath);
        if (buf.length > 5000 && buf.slice(0, 4).toString() === 'MThd') {
          console.log(`  skip  ${want.genre}/${want.id}.mid (${(buf.length/1024).toFixed(0)}KB)`);
          skipped++;
          continue;
        }
      } catch {}
    }

    // Find in CSV using simple substring matching
    const candidates = rows.filter(r =>
      r.composer.includes(want.composer) &&
      (want.title === '' || r.title.includes(want.title))
    );

    if (candidates.length === 0) {
      console.log(`  MISS  ${want.genre}/${want.id} — "${want.composer}" + "${want.title}" (0 matches)`);
      missed++;
      continue;
    }

    // Sort by duration ascending (prefer shorter = single movement)
    candidates.sort((a, b) => a.duration - b.duration);
    const match = candidates[0];

    // Extract from zip
    const zipEntry = `maestro-v3.0.0/${match.midi_filename}`;
    try {
      execSync(`unzip -o -j "${ZIP_PATH}" "${zipEntry}" -d "${EXTRACT_DIR}" 2>/dev/null`);
      const extractedFile = join(EXTRACT_DIR, basename(match.midi_filename));
      if (existsSync(extractedFile)) {
        if (existsSync(destPath)) unlinkSync(destPath);
        copyFileSync(extractedFile, destPath);
        unlinkSync(extractedFile);
        const size = readFileSync(destPath).length;
        console.log(`  ok    ${want.genre}/${want.id}.mid (${(size/1024).toFixed(0)}KB) — ${match.title} (${match.duration.toFixed(0)}s)`);
        extracted++;
      } else {
        console.log(`  FAIL  ${want.genre}/${want.id} — extraction failed`);
        missed++;
      }
    } catch (e: any) {
      console.log(`  FAIL  ${want.genre}/${want.id} — ${e.message?.slice(0, 80)}`);
      missed++;
    }
  }

  console.log(`\nDone: ${extracted} extracted, ${skipped} kept, ${missed} missed`);
  execSync(`rm -rf "${EXTRACT_DIR}"`);
}

main().catch(console.error);
