export type { SongCatalogEntry } from './types';

import { beginnerSongs } from './beginner';
import { baroqueSongs } from './baroque';
import { classicalSongs } from './classical';
import { romanticSongs } from './romantic';
import { impressionistSongs } from './impressionist';
import { jazzSongs } from './jazz';
import { advancedSongs } from './advanced';
import { journeySongs } from './journey';

const RAW_ENTRIES = [
  ...beginnerSongs,
  ...baroqueSongs,
  ...classicalSongs,
  ...romanticSongs,
  ...impressionistSongs,
  ...jazzSongs,
  ...advancedSongs,
  ...journeySongs,
];

const seen = new Map<string, (typeof RAW_ENTRIES)[number]>();
for (const entry of RAW_ENTRIES) {
  const existing = seen.get(entry.id);
  if (!existing || entry.journeySong) {
    seen.set(entry.id, entry);
  }
}
export const ALL_CATALOG_ENTRIES = [...seen.values()];
