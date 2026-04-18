import type { SongCatalogEntry } from './types';

export const jazzSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple ragtime ===
  { id: 'joplin-easy-winners', title: 'The Easy Winners', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 180, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-pleasant-moments', title: 'Pleasant Moments', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 80, durationSec: 200, keySignature: 'Db', tags: ['joplin', 'ragtime', 'waltz'] },

  // === Difficulty 3: Blues ===
  { id: 'twelve-bar-blues', title: '12-Bar Blues in C', composer: 'Traditional', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 60, keySignature: 'C', tags: ['blues', 'exercise', 'improvisation'] },
];
