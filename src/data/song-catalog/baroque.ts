import type { SongCatalogEntry } from './types';

export const baroqueSongs: SongCatalogEntry[] = [
  { id: 'prelude-in-c', title: 'Prelude in C Major, BWV 846', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 70, durationSec: 130, keySignature: 'C', tags: ['bach', 'wtc', 'prelude', 'arpeggiated'], requiresMidi: true },
  { id: 'bach-invention-1', title: 'Invention No. 1 in C Major, BWV 772', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 100, durationSec: 80, keySignature: 'C', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
  { id: 'bach-invention-8', title: 'Invention No. 8 in F Major, BWV 779', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 90, durationSec: 90, keySignature: 'F', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
  { id: 'bach-invention-13', title: 'Invention No. 13 in A Minor, BWV 784', composer: 'J.S. Bach', genre: 'baroque', difficulty: 3, bpm: 80, durationSec: 100, keySignature: 'Am', tags: ['bach', 'invention', 'two-hands'], requiresMidi: true },
];
