import type { SongCatalogEntry } from './types';

export const jazzSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple ragtime ===
  { id: 'joplin-easy-winners', title: 'The Easy Winners', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 180, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-pleasant-moments', title: 'Pleasant Moments', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 80, durationSec: 200, keySignature: 'Db', tags: ['joplin', 'ragtime', 'waltz'] },

  // === Difficulty 3: Classic ragtime ===
  { id: 'joplin-entertainer', title: 'The Entertainer', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 95, durationSec: 260, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-maple-leaf', title: 'Maple Leaf Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 200, keySignature: 'Ab', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-solace', title: 'Solace', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 75, durationSec: 250, keySignature: 'F', tags: ['joplin', 'ragtime', 'serenade'] },
  { id: 'joplin-peacherine', title: 'The Peacherine Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 180, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-pineapple', title: 'Pineapple Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 180, keySignature: 'Ab', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-country-club', title: 'Country Club Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 170, keySignature: 'D', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-paragon', title: 'The Paragon Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 105, durationSec: 180, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'joplin-weeping-willow', title: 'Weeping Willow', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 90, durationSec: 200, keySignature: 'C', tags: ['joplin', 'ragtime'] },
  { id: 'st-louis-blues', title: 'St. Louis Blues', composer: 'W.C. Handy', genre: 'jazz', difficulty: 3, bpm: 90, durationSec: 150, keySignature: 'G', tags: ['blues', 'handy', 'standard'] },

  // === Difficulty 4: Advanced ragtime ===
  { id: 'joplin-elite-syncopations', title: 'Elite Syncopations', composer: 'Scott Joplin', genre: 'jazz', difficulty: 4, bpm: 100, durationSec: 200, keySignature: 'F', tags: ['joplin', 'ragtime', 'syncopated'] },
  { id: 'joplin-euphonic-sounds', title: 'Euphonic Sounds', composer: 'Scott Joplin', genre: 'jazz', difficulty: 4, bpm: 90, durationSec: 220, keySignature: 'Bb', tags: ['joplin', 'ragtime', 'concert'] },
  { id: 'joplin-magnetic', title: 'Magnetic Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 4, bpm: 95, durationSec: 200, keySignature: 'Bb', tags: ['joplin', 'ragtime', 'final'] },
  { id: 'twelve-bar-blues', title: '12-Bar Blues in C', composer: 'Traditional', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 60, keySignature: 'C', tags: ['blues', 'exercise', 'improvisation'] },
];
