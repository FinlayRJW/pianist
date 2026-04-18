import type { SongCatalogEntry } from './types';

export const baroqueSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple baroque pieces ===
  { id: 'minuet-in-g', title: 'Minuet in G Major, BWV Anh. 114', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 55, timeSignature: [3, 4], keySignature: 'G', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'minuet-in-g-minor', title: 'Minuet in G Minor, BWV Anh. 115', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 105, durationSec: 55, timeSignature: [3, 4], keySignature: 'Gm', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'bach-musette', title: 'Musette in D Major, BWV Anh. 126', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, keySignature: 'D', tags: ['bach', 'notebook-anna'] },
  { id: 'bach-march-d', title: 'March in D Major, BWV Anh. 122', composer: 'C.P.E. Bach', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 40, keySignature: 'D', tags: ['bach', 'march', 'notebook-anna'] },
  { id: 'bach-minuet-d-minor', title: 'Minuet in D Minor, BWV Anh. 132', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, timeSignature: [3, 4], keySignature: 'Dm', tags: ['bach', 'minuet'] },

  // === Difficulty 3: Preludes, canons, and inventions ===
  { id: 'prelude-in-c', title: 'Prelude in C Major, BWV 846', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 70, durationSec: 130, keySignature: 'C', tags: ['bach', 'wtc', 'prelude', 'arpeggiated'], requiresMidi: true },
  { id: 'canon-in-d', title: 'Canon in D Major', composer: 'Johann Pachelbel', genre: 'baroque', difficulty: 3, bpm: 68, durationSec: 120, keySignature: 'D', tags: ['pachelbel', 'canon', 'wedding', 'two-hands'], requiresMidi: true },
  { id: 'air-on-g-string', title: 'Air on the G String, BWV 1068', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 60, durationSec: 120, keySignature: 'C', tags: ['bach', 'orchestral-suite', 'arrangement', 'two-hands'], requiresMidi: true },
  { id: 'bach-invention-1', title: 'Invention No. 1 in C Major, BWV 772', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 100, durationSec: 80, keySignature: 'C', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
  { id: 'bach-invention-8', title: 'Invention No. 8 in F Major, BWV 779', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 90, durationSec: 90, keySignature: 'F', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
  { id: 'bach-invention-13', title: 'Invention No. 13 in A Minor, BWV 784', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 80, durationSec: 100, keySignature: 'Am', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
  { id: 'handel-chaconne', title: 'Chaconne in G Major, HWV 435', composer: 'George Frideric Handel', genre: 'baroque', difficulty: 3, bpm: 72, durationSec: 200, keySignature: 'G', tags: ['handel', 'chaconne', 'two-hands'], requiresMidi: true },

  // === Difficulty 4: Advanced baroque ===
  { id: 'scarlatti-k466', title: 'Sonata in F Minor, K. 466', composer: 'Domenico Scarlatti', genre: 'baroque', difficulty: 4, bpm: 80, durationSec: 180, keySignature: 'Fm', tags: ['scarlatti', 'sonata', 'two-hands'], requiresMidi: true },
  { id: 'scarlatti-k525', title: 'Sonata in F Minor, K. 525', composer: 'Domenico Scarlatti', genre: 'baroque', difficulty: 4, bpm: 90, durationSec: 150, keySignature: 'Fm', tags: ['scarlatti', 'sonata', 'two-hands'], requiresMidi: true },
];
