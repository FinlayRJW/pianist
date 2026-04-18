export type { SongCatalogEntry } from './types';

import { beginnerSongs } from './beginner';
import { baroqueSongs } from './baroque';
import { classicalSongs } from './classical';
import { romanticSongs } from './romantic';
import { impressionistSongs } from './impressionist';
import { jazzSongs } from './jazz';
import { advancedSongs } from './advanced';

export const ALL_CATALOG_ENTRIES = [
  ...beginnerSongs,
  ...baroqueSongs,
  ...classicalSongs,
  ...romanticSongs,
  ...impressionistSongs,
  ...jazzSongs,
  ...advancedSongs,
];
