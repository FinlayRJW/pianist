import type { SongCatalogEntry } from './types';

export const baroqueSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple baroque pieces ===
  { id: 'minuet-in-g', title: 'Minuet in G Major, BWV Anh. 114', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 55, timeSignature: [3, 4], keySignature: 'G', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'minuet-in-g-minor', title: 'Minuet in G Minor, BWV Anh. 115', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 105, durationSec: 55, timeSignature: [3, 4], keySignature: 'Gm', tags: ['petzold', 'minuet', 'notebook-anna'] },
  { id: 'bach-musette', title: 'Musette in D Major, BWV Anh. 126', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, keySignature: 'D', tags: ['bach', 'notebook-anna'] },
  { id: 'bach-march-d', title: 'March in D Major, BWV Anh. 122', composer: 'C.P.E. Bach', genre: 'baroque', difficulty: 2, bpm: 110, durationSec: 40, keySignature: 'D', tags: ['bach', 'march', 'notebook-anna'] },
  { id: 'bach-minuet-d-minor', title: 'Minuet in D Minor, BWV Anh. 132', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 45, timeSignature: [3, 4], keySignature: 'Dm', tags: ['bach', 'minuet'] },

  // === Difficulty 3: Inventions and preludes ===
  { id: 'prelude-in-c', title: 'Prelude in C Major, BWV 846', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 70, durationSec: 130, keySignature: 'C', tags: ['bach', 'wtc', 'prelude', 'arpeggiated'] },
  { id: 'bach-invention-1', title: 'Invention No. 1 in C Major, BWV 772', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 90, durationSec: 75, keySignature: 'C', tags: ['bach', 'invention', 'counterpoint'] },
  { id: 'bach-invention-4', title: 'Invention No. 4 in D Minor, BWV 775', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 85, durationSec: 55, keySignature: 'Dm', tags: ['bach', 'invention', 'counterpoint'] },
  { id: 'bach-invention-8', title: 'Invention No. 8 in F Major, BWV 779', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 85, durationSec: 60, keySignature: 'F', tags: ['bach', 'invention', 'counterpoint'] },
  { id: 'bach-invention-13', title: 'Invention No. 13 in A Minor, BWV 784', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 80, durationSec: 65, keySignature: 'Am', tags: ['bach', 'invention', 'counterpoint'] },
  { id: 'canon-in-d', title: 'Canon in D Major', composer: 'Johann Pachelbel', genre: 'baroque', difficulty: 3, bpm: 68, durationSec: 120, keySignature: 'D', tags: ['pachelbel', 'canon', 'wedding'] },
  { id: 'air-on-g-string', title: 'Air on the G String, BWV 1068', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 60, durationSec: 120, keySignature: 'C', tags: ['bach', 'orchestral-suite', 'arrangement'] },
  { id: 'jesu-joy', title: 'Jesu, Joy of Man\'s Desiring, BWV 147', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 72, durationSec: 140, timeSignature: [3, 4], keySignature: 'G', tags: ['bach', 'chorale', 'arrangement'] },
  { id: 'sheep-may-safely-graze', title: 'Sheep May Safely Graze, BWV 208', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 65, durationSec: 150, keySignature: 'Bb', tags: ['bach', 'cantata', 'arrangement'] },

  // === Difficulty 4: Advanced baroque ===
  { id: 'bach-prelude-2', title: 'Prelude No. 2 in C Minor, BWV 847', composer: 'J.S. Bach', genre: 'baroque', difficulty: 4, bpm: 90, durationSec: 100, keySignature: 'Cm', tags: ['bach', 'wtc', 'prelude'] },
  { id: 'bach-fugue-2', title: 'Fugue No. 2 in C Minor, BWV 847', composer: 'J.S. Bach', genre: 'baroque', difficulty: 4, bpm: 80, durationSec: 95, keySignature: 'Cm', tags: ['bach', 'wtc', 'fugue', 'counterpoint'] },
  { id: 'bach-prelude-cello', title: 'Prelude from Cello Suite No. 1 (arr.)', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 70, durationSec: 150, keySignature: 'G', tags: ['bach', 'cello-suite', 'arrangement'] },
  { id: 'scarlatti-k466', title: 'Sonata in F Minor, K. 466', composer: 'Domenico Scarlatti', genre: 'baroque', difficulty: 4, bpm: 90, durationSec: 140, keySignature: 'Fm', tags: ['scarlatti', 'sonata'] },
  { id: 'scarlatti-k525', title: 'Sonata in F Major, K. 525', composer: 'Domenico Scarlatti', genre: 'baroque', difficulty: 4, bpm: 100, durationSec: 120, keySignature: 'F', tags: ['scarlatti', 'sonata'] },
  { id: 'handel-chaconne', title: 'Chaconne in G Major, HWV 435', composer: 'George Frideric Handel', genre: 'baroque', difficulty: 4, bpm: 80, durationSec: 250, keySignature: 'G', tags: ['handel', 'chaconne', 'variations'] },
  { id: 'bach-chromatic-fantasy', title: 'Chromatic Fantasy, BWV 903', composer: 'J.S. Bach', genre: 'baroque', difficulty: 5, bpm: 80, durationSec: 350, keySignature: 'Dm', tags: ['bach', 'fantasy', 'virtuoso'] },
  { id: 'bach-english-suite-2', title: 'English Suite No. 2 Prelude, BWV 807', composer: 'J.S. Bach', genre: 'baroque', difficulty: 5, bpm: 90, durationSec: 200, keySignature: 'Am', tags: ['bach', 'english-suite'] },
];
