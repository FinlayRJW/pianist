export type { SongDefinition } from './types';

export { beginnerSongs } from './beginner';
export { folkSongs } from './folk';
export { classicalSongs } from './classical';
export { popSongs } from './pop';
export { rockSongs } from './rock';
export { funkSongs } from './funk';
export { jazzSongs } from './jazz';
export { advancedSongs } from './advanced';

import { beginnerSongs } from './beginner';
import { folkSongs } from './folk';
import { classicalSongs } from './classical';
import { popSongs } from './pop';
import { rockSongs } from './rock';
import { funkSongs } from './funk';
import { jazzSongs } from './jazz';
import { advancedSongs } from './advanced';

export const ALL_SONG_DEFINITIONS = [
  ...beginnerSongs,
  ...folkSongs,
  ...classicalSongs,
  ...popSongs,
  ...rockSongs,
  ...funkSongs,
  ...jazzSongs,
  ...advancedSongs,
];
