import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

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
  // BAROQUE - Bach inventions & preludes
  { id: 'bach-invention-1', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Invention' },
  { id: 'bach-invention-4', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Invention' },
  { id: 'bach-invention-8', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Invention' },
  { id: 'bach-invention-13', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Invention' },
  { id: 'bach-prelude-2', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Well-Tempered' },
  { id: 'bach-fugue-2', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Well-Tempered' },
  { id: 'jesu-joy', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Jesu' },
  { id: 'sheep-may-safely-graze', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Sheep' },
  { id: 'scarlatti-k466', genre: 'baroque', searchComposer: 'Domenico Scarlatti', searchTitle: 'K. 466' },
  { id: 'scarlatti-k525', genre: 'baroque', searchComposer: 'Domenico Scarlatti', searchTitle: 'K. 525' },
  { id: 'handel-chaconne', genre: 'baroque', searchComposer: 'George Frideric Handel', searchTitle: 'Chaconne' },
  { id: 'bach-chromatic-fantasy', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Chromatic Fantasy' },
  { id: 'bach-english-suite-2', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'English Suite' },
  { id: 'bach-prelude-cello', genre: 'baroque', searchComposer: 'Johann Sebastian Bach', searchTitle: 'Cello' },

  // CLASSICAL
  { id: 'fur-elise', genre: 'classical', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Elise' },
  { id: 'moonlight-sonata', genre: 'classical', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Moonlight' },
  { id: 'mozart-k545-1', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'K. 545' },
  { id: 'mozart-alla-turca', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'K. 331' },
  { id: 'mozart-fantasy-d-minor', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'Fantasy' },
  { id: 'beethoven-pathetique-2', genre: 'classical', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Path' },
  { id: 'beethoven-tempest-3', genre: 'classical', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Tempest' },
  { id: 'haydn-sonata-c', genre: 'classical', searchComposer: 'Joseph Haydn', searchTitle: 'C major' },
  { id: 'mozart-rondo-k511', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'K. 511' },
  { id: 'haydn-sonata-e-minor', genre: 'classical', searchComposer: 'Joseph Haydn', searchTitle: 'E Minor' },
  { id: 'haydn-sonata-c-hob50', genre: 'classical', searchComposer: 'Joseph Haydn', searchTitle: 'Hob. XVI:50' },
  { id: 'mozart-k457-1', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'K. 457' },
  { id: 'beethoven-waldstein-1', genre: 'classical', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Waldstein' },
  { id: 'mendelssohn-rondo-capriccioso', genre: 'classical', searchComposer: 'Felix Mendelssohn', searchTitle: 'Rondo Capriccioso' },
  { id: 'clementi-sonatina-1', genre: 'classical', searchComposer: 'Muzio Clementi', searchTitle: 'Op. 24' },
  { id: 'clementi-sonatina-3', genre: 'classical', searchComposer: 'Muzio Clementi', searchTitle: 'Op. 25' },
  { id: 'mozart-twinkle-variations', genre: 'classical', searchComposer: 'Wolfgang Amadeus Mozart', searchTitle: 'Variations' },

  // ROMANTIC
  { id: 'chopin-prelude-e-minor', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Prelude' },
  { id: 'chopin-nocturne-op9-2', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Nocturne' },
  { id: 'chopin-waltz-minute', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Waltz' },
  { id: 'chopin-waltz-csharp-minor', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Waltz' },
  { id: 'chopin-prelude-raindrop', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Prelude' },
  { id: 'chopin-etude-op10-3', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'chopin-ballade-1', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Ballade' },
  { id: 'chopin-etude-op10-12', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'chopin-polonaise-53', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Polonaise' },
  { id: 'chopin-scherzo-2', genre: 'romantic', searchComposer: 'Chopin', searchTitle: 'Scherzo' },
  { id: 'liszt-liebestraum-3', genre: 'romantic', searchComposer: 'Franz Liszt', searchTitle: 'Liebes' },
  { id: 'schumann-traumerei', genre: 'romantic', searchComposer: 'Robert Schumann', searchTitle: 'Kinderszenen' },
  { id: 'schumann-arabesque', genre: 'romantic', searchComposer: 'Robert Schumann', searchTitle: 'Arabesque' },
  { id: 'brahms-intermezzo-op118-2', genre: 'romantic', searchComposer: 'Johannes Brahms', searchTitle: 'Op. 118' },
  { id: 'schubert-impromptu-op90-3', genre: 'romantic', searchComposer: 'Franz Schubert', searchTitle: 'Impromptu' },
  { id: 'schubert-impromptu-op90-2', genre: 'romantic', searchComposer: 'Franz Schubert', searchTitle: 'Impromptu' },
  { id: 'grieg-waltz-op12-2', genre: 'romantic', searchComposer: 'Edvard Grieg', searchTitle: 'Waltz' },
  { id: 'rachmaninoff-prelude-csharp', genre: 'romantic', searchComposer: 'Sergei Rachmaninoff', searchTitle: 'C' },
  { id: 'rachmaninoff-prelude-g-minor', genre: 'romantic', searchComposer: 'Sergei Rachmaninoff', searchTitle: 'G Minor' },
  { id: 'mendelssohn-song-spring', genre: 'romantic', searchComposer: 'Felix Mendelssohn', searchTitle: 'Songs' },

  // IMPRESSIONIST
  { id: 'debussy-arabesque-1', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Arabesque' },
  { id: 'debussy-clair-de-lune', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Clair' },
  { id: 'debussy-reverie', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Rever' },
  { id: 'debussy-girl-flaxen-hair', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Flaxen' },
  { id: 'debussy-doctor-gradus', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Gradus' },
  { id: 'debussy-voiles', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Voiles' },
  { id: 'debussy-estampes', genre: 'impressionist', searchComposer: 'Claude Debussy', searchTitle: 'Estampes' },

  // ADVANCED
  { id: 'liszt-la-campanella', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Campanella' },
  { id: 'liszt-hungarian-rhapsody-2', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Hungarian Rhapsody No. 2' },
  { id: 'liszt-mephisto-waltz-1', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Mephisto' },
  { id: 'scriabin-etude-op8-12', genre: 'advanced', searchComposer: 'Alexander Scriabin', searchTitle: 'Etude Op. 8' },
  { id: 'rachmaninoff-etude-op39-5', genre: 'advanced', searchComposer: 'Sergei Rachmaninoff', searchTitle: 'Etude' },
  { id: 'balakirev-islamey', genre: 'advanced', searchComposer: 'Mily Balakirev', searchTitle: 'Islamey' },
  { id: 'mussorgsky-pictures', genre: 'advanced', searchComposer: 'Modest Mussorgsky', searchTitle: 'Pictures' },
  { id: 'chopin-etude-op10-4', genre: 'advanced', searchComposer: 'Chopin', searchTitle: 'Etude' },
  { id: 'beethoven-moonlight-3', genre: 'advanced', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Moonlight' },
  { id: 'beethoven-appassionata-1', genre: 'advanced', searchComposer: 'Ludwig van Beethoven', searchTitle: 'Appassionata' },
  { id: 'liszt-dante-sonata', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Dante' },
  { id: 'bach-busoni-chaconne', genre: 'advanced', searchComposer: 'Johann Sebastian Bach / Ferruccio Busoni', searchTitle: 'Chaconne' },
  { id: 'chopin-fantaisie-impromptu', genre: 'advanced', searchComposer: 'Chopin', searchTitle: 'Fantaisie' },
  { id: 'liszt-consolation-3', genre: 'romantic', searchComposer: 'Franz Liszt', searchTitle: 'Consolation' },
  { id: 'liszt-transcendental-10', genre: 'advanced', searchComposer: 'Franz Liszt', searchTitle: 'Transcendental' },
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

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  try {
    execSync(`curl -sL -o "${destPath}" "${url}"`, { timeout: 30000 });
    return true;
  } catch {
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
      console.log(`  ⏭ ${mapping.genre}/${mapping.id}.mid (already exists)`);
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
      console.log(`  ✓ ${mapping.genre}/${mapping.id}.mid (${match.canonical_composer}: ${match.canonical_title})`);
      downloaded++;
    } else {
      console.log(`  ✗ ${mapping.genre}/${mapping.id}.mid - download failed`);
      failed++;
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
