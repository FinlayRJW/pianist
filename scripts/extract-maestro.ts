import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { join, basename } from 'path';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');
const ZIP_PATH = '/tmp/maestro-midi.zip';
const CSV_PATH = '/tmp/maestro-csv.csv';
const EXTRACT_DIR = '/tmp/maestro-extract';

interface Mapping {
  id: string;
  genre: string;
  composer: string;
  title: string;
  preferShortest?: boolean;
}

const WANTED: Mapping[] = [
  // BAROQUE
  { id: 'prelude-in-c', genre: 'baroque', composer: 'Johann Sebastian Bach', title: 'Prelude.*C Major.*846' },
  { id: 'minuet-in-g', genre: 'baroque', composer: 'Petzold', title: 'Minuet.*G' },
  { id: 'air-on-g-string', genre: 'baroque', composer: 'Johann Sebastian Bach', title: 'Air' },

  // CLASSICAL
  { id: 'fur-elise', genre: 'classical', composer: 'Ludwig van Beethoven', title: 'Elise' },
  { id: 'moonlight-sonata', genre: 'classical', composer: 'Ludwig van Beethoven', title: 'Moonlight|Piano Sonata.*14.*C.*sharp.*minor' },
  { id: 'mozart-minuet-k2', genre: 'classical', composer: 'Wolfgang Amadeus Mozart', title: 'K.*2|Minuet' },
  { id: 'beethoven-sonatina-g', genre: 'classical', composer: 'Ludwig van Beethoven', title: 'Sonatina' },
  { id: 'beethoven-bagatelle-op119-1', genre: 'classical', composer: 'Ludwig van Beethoven', title: 'Bagatelle' },

  // ROMANTIC
  { id: 'chopin-prelude-e-minor', genre: 'romantic', composer: 'Chopin', title: 'Prelude.*4.*E.*[Mm]inor|Prelude.*Op.*28.*No.*4' },
  { id: 'chopin-nocturne-op9-2', genre: 'romantic', composer: 'Chopin', title: 'Nocturne.*Op.*9.*No.*2|Nocturne.*E.*flat' },
  { id: 'chopin-waltz-minute', genre: 'romantic', composer: 'Chopin', title: 'Waltz.*64.*No.*1|Minute' },
  { id: 'chopin-waltz-csharp-minor', genre: 'romantic', composer: 'Chopin', title: 'Waltz.*64.*No.*2|Waltz.*C.*sharp.*[Mm]inor' },
  { id: 'chopin-prelude-raindrop', genre: 'romantic', composer: 'Chopin', title: 'Prelude.*15|Raindrop' },
  { id: 'chopin-etude-op10-3', genre: 'romantic', composer: 'Chopin', title: 'Etude.*Op.*10.*No.*3|Tristesse' },
  { id: 'chopin-ballade-1', genre: 'romantic', composer: 'Chopin', title: 'Ballade.*No.*1|Ballade.*G.*[Mm]inor' },
  { id: 'chopin-etude-op10-12', genre: 'romantic', composer: 'Chopin', title: 'Etude.*Op.*10.*No.*12|Revolutionary' },
  { id: 'chopin-polonaise-53', genre: 'romantic', composer: 'Chopin', title: 'Polonaise.*53|Heroic|Polonaise.*A.*flat' },
  { id: 'chopin-scherzo-2', genre: 'romantic', composer: 'Chopin', title: 'Scherzo.*No.*2|Scherzo.*B.*flat' },
  { id: 'liszt-liebestraum-3', genre: 'romantic', composer: 'Franz Liszt', title: 'Liebes' },
  { id: 'schumann-traumerei', genre: 'romantic', composer: 'Robert Schumann', title: 'Kinderszenen|Träumerei|Traumerei' },
  { id: 'schumann-arabesque', genre: 'romantic', composer: 'Robert Schumann', title: 'Arabesque|Arabeske' },
  { id: 'brahms-intermezzo-op118-2', genre: 'romantic', composer: 'Johannes Brahms', title: 'Op.*118|Intermezzo.*A' },
  { id: 'schubert-impromptu-op90-3', genre: 'romantic', composer: 'Franz Schubert', title: 'Impromptu.*Op.*90.*No.*3|Impromptu.*G.*flat' },
  { id: 'schubert-impromptu-op90-2', genre: 'romantic', composer: 'Franz Schubert', title: 'Impromptu.*Op.*90.*No.*2|Impromptu.*E.*flat' },
  { id: 'grieg-waltz-op12-2', genre: 'romantic', composer: 'Edvard Grieg', title: 'Waltz|Op.*12' },
  { id: 'rachmaninoff-prelude-csharp', genre: 'romantic', composer: 'Rachmaninoff', title: 'C.*sharp.*[Mm]inor|Op.*3' },

  // IMPRESSIONIST
  { id: 'debussy-arabesque-1', genre: 'impressionist', composer: 'Claude Debussy', title: 'Arabesque.*1' },
  { id: 'debussy-clair-de-lune', genre: 'impressionist', composer: 'Claude Debussy', title: 'Clair|Suite.*bergamasque' },
  { id: 'debussy-reverie', genre: 'impressionist', composer: 'Claude Debussy', title: 'R[eê]verie' },
  { id: 'debussy-girl-flaxen-hair', genre: 'impressionist', composer: 'Claude Debussy', title: 'Flaxen|fille.*lin' },
  { id: 'debussy-doctor-gradus', genre: 'impressionist', composer: 'Claude Debussy', title: 'Gradus|Children' },

  // ADVANCED
  { id: 'liszt-la-campanella', genre: 'advanced', composer: 'Franz Liszt', title: 'Campanella' },
  { id: 'liszt-hungarian-rhapsody-2', genre: 'advanced', composer: 'Franz Liszt', title: 'Hungarian.*Rhapsody.*No.*2|Hungarian.*2' },
  { id: 'liszt-mephisto-waltz-1', genre: 'advanced', composer: 'Franz Liszt', title: 'Mephisto' },
  { id: 'chopin-etude-op10-4', genre: 'advanced', composer: 'Chopin', title: 'Etude.*Op.*10.*No.*4' },
  { id: 'beethoven-appassionata-1', genre: 'advanced', composer: 'Ludwig van Beethoven', title: 'Appassionata|Sonata.*23|Sonata.*F.*[Mm]inor.*Op.*57' },
  { id: 'scriabin-etude-op8-12', genre: 'advanced', composer: 'Scriabin', title: 'Etude.*Op.*8.*No.*12|Etude.*D.*sharp' },
  { id: 'rachmaninoff-etude-op39-5', genre: 'advanced', composer: 'Rachmaninoff', title: 'Etude|Op.*39' },
  { id: 'mussorgsky-pictures', genre: 'advanced', composer: 'Mussorgsky', title: 'Pictures' },
  { id: 'chopin-fantaisie-impromptu', genre: 'advanced', composer: 'Chopin', title: 'Fantaisie.*Impromptu|Impromptu.*66' },
  { id: 'beethoven-moonlight-3', genre: 'advanced', composer: 'Ludwig van Beethoven', title: 'Moonlight|Piano Sonata.*14' },
];

interface CsvRow {
  canonical_composer: string;
  canonical_title: string;
  midi_filename: string;
  duration: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
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
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
    rows.push(obj as unknown as CsvRow);
  }
  return rows;
}

async function main() {
  // Fetch CSV
  console.log('Fetching MAESTRO CSV...');
  const csvText = execSync('curl -sL "https://storage.googleapis.com/magentadata/datasets/maestro/v3.0.0/maestro-v3.0.0.csv"').toString();
  const rows = parseCsv(csvText);
  console.log(`${rows.length} entries in dataset\n`);

  // Clean extract dir
  execSync(`rm -rf "${EXTRACT_DIR}" && mkdir -p "${EXTRACT_DIR}"`);

  let found = 0, notFound = 0, extracted = 0;

  for (const want of WANTED) {
    const destDir = join(PUBLIC_DIR, want.genre);
    mkdirSync(destDir, { recursive: true });
    const destPath = join(destDir, `${want.id}.mid`);

    // Check if we already have a good file
    if (existsSync(destPath)) {
      try {
        const buf = readFileSync(destPath);
        if (buf.length > 1000 && buf.slice(0, 4).toString() === 'MThd') {
          console.log(`  skip  ${want.genre}/${want.id}.mid (${buf.length} bytes, valid)`);
          found++;
          continue;
        }
      } catch {}
    }

    // Search CSV for matching entry
    const titleRe = new RegExp(want.title, 'i');
    const candidates = rows.filter(r =>
      r.canonical_composer.includes(want.composer) && titleRe.test(r.canonical_title)
    );

    if (candidates.length === 0) {
      console.log(`  MISS  ${want.genre}/${want.id} — no match for "${want.composer}" + "${want.title}"`);
      notFound++;
      continue;
    }

    // Pick shortest performance (more likely a single movement)
    candidates.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
    const match = candidates[0];

    // Extract from zip
    const zipEntry = `maestro-v3.0.0/${match.midi_filename}`;
    try {
      execSync(`unzip -o -j "${ZIP_PATH}" "${zipEntry}" -d "${EXTRACT_DIR}"`, { stdio: 'pipe' });
      const extractedFile = join(EXTRACT_DIR, basename(match.midi_filename));
      if (existsSync(extractedFile)) {
        // Remove old file if present
        if (existsSync(destPath)) unlinkSync(destPath);
        renameSync(extractedFile, destPath);
        const size = readFileSync(destPath).length;
        console.log(`  ok    ${want.genre}/${want.id}.mid (${size} bytes) — ${match.canonical_title}`);
        extracted++;
      } else {
        console.log(`  FAIL  ${want.genre}/${want.id} — extraction failed`);
        notFound++;
      }
    } catch (e) {
      console.log(`  FAIL  ${want.genre}/${want.id} — unzip error`);
      notFound++;
    }
  }

  console.log(`\nDone: ${extracted} extracted, ${found} already had, ${notFound} not found`);

  // Cleanup
  execSync(`rm -rf "${EXTRACT_DIR}"`);
}

main().catch(console.error);
