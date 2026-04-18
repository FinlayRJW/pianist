import type { SongCatalogEntry } from './types';

export const impressionistSongs: SongCatalogEntry[] = [
  // === Difficulty 3: Satie ===
  { id: 'gymnopedie-no1', title: 'Gymnopédie No. 1', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 190, timeSignature: [3, 4], keySignature: 'D', tags: ['satie', 'gymnopedie', 'two-hands'], requiresMidi: true },
  { id: 'satie-gymnopedie-2', title: 'Gymnopédie No. 2', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 170, timeSignature: [3, 4], keySignature: 'C', tags: ['satie', 'gymnopedie', 'two-hands'], requiresMidi: true },
  { id: 'satie-gymnopedie-3', title: 'Gymnopédie No. 3', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 150, timeSignature: [3, 4], keySignature: 'Am', tags: ['satie', 'gymnopedie', 'two-hands'], requiresMidi: true },
  { id: 'satie-gnossienne-1', title: 'Gnossienne No. 1', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 60, durationSec: 210, keySignature: 'Fm', tags: ['satie', 'gnossienne', 'two-hands'], requiresMidi: true },
  { id: 'satie-gnossienne-3', title: 'Gnossienne No. 3', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 55, durationSec: 180, keySignature: 'Am', tags: ['satie', 'gnossienne', 'two-hands'], requiresMidi: true },
  { id: 'satie-je-te-veux', title: 'Je te veux', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 120, durationSec: 200, timeSignature: [3, 4], keySignature: 'G', tags: ['satie', 'waltz', 'two-hands'], requiresMidi: true },

  // === Difficulty 4: Debussy ===
  { id: 'debussy-girl-flaxen-hair', title: 'The Girl with the Flaxen Hair', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 60, durationSec: 160, keySignature: 'Gb', tags: ['debussy', 'preludes', 'two-hands'], requiresMidi: true },
];
