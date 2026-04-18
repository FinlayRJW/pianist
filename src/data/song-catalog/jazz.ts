import type { SongCatalogEntry } from './types';

export const jazzSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple ragtime ===
  { id: 'joplin-easy-winners', title: 'The Easy Winners', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 180, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-pleasant-moments', title: 'Pleasant Moments', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 80, durationSec: 200, keySignature: 'Db', tags: ['joplin', 'ragtime', 'waltz'] },

  // === Difficulty 2: More ragtime ===
  { id: 'joplin-entertainer', title: 'The Entertainer', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 45, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-solace', title: 'Solace', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 76, durationSec: 50, keySignature: 'G', tags: ['joplin', 'ragtime', 'slow'] },
  { id: 'joplin-weeping-willow', title: 'Weeping Willow', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 90, durationSec: 45, keySignature: 'G', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-peacherine', title: 'Peacherine Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 40, keySignature: 'C', tags: ['joplin', 'ragtime'] },

  // === Difficulty 3: Blues & advanced ragtime ===
  { id: 'twelve-bar-blues', title: '12-Bar Blues in C', composer: 'Traditional', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 60, keySignature: 'C', tags: ['blues', 'exercise', 'improvisation'] },
  { id: 'joplin-maple-leaf', title: 'Maple Leaf Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 55, keySignature: 'Ab', tags: ['joplin', 'ragtime'] },
  { id: 'st-louis-blues', title: 'St. Louis Blues', composer: 'W.C. Handy', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 55, keySignature: 'C', tags: ['blues', 'jazz-standard'] },
  { id: 'boogie-woogie-basics', title: 'Boogie Woogie Bass', composer: 'Traditional', genre: 'jazz', difficulty: 3, bpm: 120, durationSec: 45, keySignature: 'C', tags: ['boogie-woogie', 'exercise', 'two-hands'] },
  { id: 'swing-blues-in-f', title: 'Swing Blues in F', composer: 'Traditional', genre: 'jazz', difficulty: 3, bpm: 110, durationSec: 50, keySignature: 'F', tags: ['blues', 'swing', 'exercise'] },
];
