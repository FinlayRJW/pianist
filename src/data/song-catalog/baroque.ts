import type { SongCatalogEntry } from './types';

export const baroqueSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple baroque pieces ===
  { id: 'minuet-in-g', title: 'Minuet in G Major, BWV Anh. 114', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 55, timeSignature: [3, 4], keySignature: 'G', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'minuet-in-g-minor', title: 'Minuet in G Minor, BWV Anh. 115', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 105, durationSec: 55, timeSignature: [3, 4], keySignature: 'Gm', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'bach-musette', title: 'Musette in D Major, BWV Anh. 126', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, keySignature: 'D', tags: ['bach', 'notebook-anna'] },
  { id: 'bach-march-d', title: 'March in D Major, BWV Anh. 122', composer: 'C.P.E. Bach', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 40, keySignature: 'D', tags: ['bach', 'march', 'notebook-anna'] },
  { id: 'bach-minuet-d-minor', title: 'Minuet in D Minor, BWV Anh. 132', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, timeSignature: [3, 4], keySignature: 'Dm', tags: ['bach', 'minuet'] },

  // === Difficulty 3: Preludes and canons ===
  { id: 'prelude-in-c', title: 'Prelude in C Major, BWV 846', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 70, durationSec: 130, keySignature: 'C', tags: ['bach', 'wtc', 'prelude', 'arpeggiated'], requiresMidi: true },
  { id: 'canon-in-d', title: 'Canon in D Major', composer: 'Johann Pachelbel', genre: 'baroque', difficulty: 3, bpm: 68, durationSec: 120, keySignature: 'D', tags: ['pachelbel', 'canon', 'wedding', 'two-hands'], requiresMidi: true },
  { id: 'air-on-g-string', title: 'Air on the G String, BWV 1068', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 60, durationSec: 120, keySignature: 'C', tags: ['bach', 'orchestral-suite', 'arrangement', 'two-hands'], requiresMidi: true },
];
