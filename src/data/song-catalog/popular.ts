import type { SongCatalogEntry } from './types';

export const popularSongs: SongCatalogEntry[] = [
  // === Difficulty 1: Simple melodies everyone knows ===
  { id: 'daisy-bell', title: 'Daisy Bell (Bicycle Built for Two)', composer: 'Harry Dacre', genre: 'popular', difficulty: 1, bpm: 100, durationSec: 30, timeSignature: [3, 4], keySignature: 'C', tags: ['victorian', 'waltz', 'classic'] },
  { id: 'take-me-out-ballgame', title: 'Take Me Out to the Ball Game', composer: 'Albert Von Tilzer', genre: 'popular', difficulty: 1, bpm: 105, durationSec: 30, timeSignature: [3, 4], keySignature: 'C', tags: ['sports', 'waltz', 'classic'] },

  // === Difficulty 2: Golden Age standards ===
  { id: 'alexander-ragtime-band', title: "Alexander's Ragtime Band", composer: 'Irving Berlin', genre: 'popular', difficulty: 2, bpm: 120, durationSec: 35, keySignature: 'C', tags: ['berlin', 'ragtime', 'classic'] },
  { id: 'let-me-call-you-sweetheart', title: 'Let Me Call You Sweetheart', composer: 'Leo Friedman', genre: 'popular', difficulty: 2, bpm: 95, durationSec: 40, timeSignature: [3, 4], keySignature: 'F', tags: ['waltz', 'love-song', 'classic'] },
  { id: 'silvery-moon', title: 'By the Light of the Silvery Moon', composer: 'Gus Edwards', genre: 'popular', difficulty: 2, bpm: 110, durationSec: 35, keySignature: 'C', tags: ['tin-pan-alley', 'classic'] },
  { id: 'bill-bailey', title: "Bill Bailey, Won't You Please Come Home", composer: 'Hughie Cannon', genre: 'popular', difficulty: 2, bpm: 115, durationSec: 35, keySignature: 'Bb', tags: ['jazz-standard', 'classic'] },
  { id: 'swanee', title: 'Swanee', composer: 'George Gershwin', genre: 'popular', difficulty: 2, bpm: 120, durationSec: 30, keySignature: 'F', tags: ['gershwin', 'classic'] },
  { id: 'over-there', title: 'Over There', composer: 'George M. Cohan', genre: 'popular', difficulty: 2, bpm: 120, durationSec: 30, keySignature: 'C', tags: ['patriotic', 'march', 'classic'] },

  // === Difficulty 3: More complex standards ===
  { id: 'after-youve-gone', title: "After You've Gone", composer: 'Turner Layton', genre: 'popular', difficulty: 3, bpm: 110, durationSec: 45, keySignature: 'Eb', tags: ['jazz-standard', 'classic'] },
  { id: 'it-had-to-be-you', title: 'It Had to Be You', composer: 'Isham Jones', genre: 'popular', difficulty: 3, bpm: 100, durationSec: 50, keySignature: 'C', tags: ['jazz-standard', 'love-song', 'classic'] },
];
