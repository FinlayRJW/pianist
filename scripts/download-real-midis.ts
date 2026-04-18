import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public', 'midi');

interface MidiSource {
  id: string;
  genre: string;
  url: string;
}

const SOURCES: MidiSource[] = [
  // === BEGINNER (mostly short folk melodies - generated ones are fine for exercises/scales) ===
  // Keep generated beginner files as-is since they're teaching pieces

  // === FOLK ===
  { id: 'greensleeves', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/greensleeves.mid' },
  { id: 'amazing-grace', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/amazgrac.mid' },
  { id: 'danny-boy', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/dannyboy.mid' },
  { id: 'auld-lang-syne', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/auldlang.mid' },
  { id: 'scarborough-fair', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/scarboro.mid' },
  { id: 'silent-night', genre: 'folk', url: 'https://www.midiworld.com/midis/other/n1/silenite.mid' },

  // === BAROQUE ===
  { id: 'minuet-in-g', genre: 'baroque', url: 'https://www.midiworld.com/midis/other/c1/bach_minuet_in_g.mid' },
  { id: 'prelude-in-c', genre: 'baroque', url: 'https://www.midiworld.com/midis/other/c1/bach_prelude_in_c.mid' },
  { id: 'air-on-g-string', genre: 'baroque', url: 'https://www.midiworld.com/midis/other/c1/bach_air.mid' },
  { id: 'canon-in-d', genre: 'baroque', url: 'https://www.midiworld.com/midis/other/c1/pachabel_canon_d.mid' },

  // === CLASSICAL ===
  { id: 'fur-elise', genre: 'classical', url: 'https://www.midiworld.com/download/5' },
  { id: 'moonlight-sonata', genre: 'classical', url: 'https://www.midiworld.com/midis/other/c1/moonlt_1.mid' },

  // === IMPRESSIONIST ===
  { id: 'gymnopedie-no1', genre: 'impressionist', url: 'https://www.midiworld.com/midis/other/c1/gymno1.mid' },
  { id: 'satie-gymnopedie-2', genre: 'impressionist', url: 'https://www.midiworld.com/midis/other/c1/gymno2.mid' },
  { id: 'satie-gymnopedie-3', genre: 'impressionist', url: 'https://www.midiworld.com/midis/other/c1/gymno3.mid' },
  { id: 'satie-gnossienne-1', genre: 'impressionist', url: 'https://www.midiworld.com/midis/other/c1/gnossie1.mid' },
  { id: 'satie-gnossienne-3', genre: 'impressionist', url: 'https://www.midiworld.com/midis/other/c1/gnossie3.mid' },
];

function isValidMidi(path: string): boolean {
  try {
    const buf = readFileSync(path);
    return buf.length > 100 && buf.slice(0, 4).toString() === 'MThd';
  } catch {
    return false;
  }
}

async function main() {
  let downloaded = 0, skipped = 0, failed = 0;

  for (const src of SOURCES) {
    const destDir = join(PUBLIC_DIR, src.genre);
    const destPath = join(destDir, `${src.id}.mid`);
    mkdirSync(destDir, { recursive: true });

    if (existsSync(destPath) && isValidMidi(destPath)) {
      const buf = readFileSync(destPath);
      console.log(`  skip ${src.genre}/${src.id}.mid (${buf.length} bytes, valid)`);
      skipped++;
      continue;
    }

    try {
      execSync(`curl -sL -o "${destPath}" "${src.url}"`, { timeout: 30000 });
      if (isValidMidi(destPath)) {
        const buf = readFileSync(destPath);
        console.log(`  ok   ${src.genre}/${src.id}.mid (${buf.length} bytes)`);
        downloaded++;
      } else {
        console.log(`  FAIL ${src.genre}/${src.id}.mid (not valid MIDI)`);
        unlinkSync(destPath);
        failed++;
      }
    } catch {
      console.log(`  FAIL ${src.genre}/${src.id}.mid (download error)`);
      failed++;
    }
  }

  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);
