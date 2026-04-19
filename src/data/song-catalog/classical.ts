import type { SongCatalogEntry } from './types';

export const classicalSongs: SongCatalogEntry[] = [
  { id: 'mozart-k545-1', title: 'Sonata in C Major, K. 545, 1st mvt', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 200, keySignature: 'C', tags: ['mozart', 'sonata', 'two-hands'], mutopiaPath: 'MozartWA/KV545/K545-1/K545-1' },
  { id: 'beethoven-pathetique-2', title: 'Pathétique Sonata, 2nd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 56, durationSec: 300, keySignature: 'Ab', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], mutopiaPath: 'BeethovenLv/O13/pathetique-2/pathetique-2' },
  { id: 'mozart-alla-turca', title: 'Rondo alla Turca, K. 331', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 140, durationSec: 210, keySignature: 'Am', tags: ['mozart', 'rondo', 'two-hands'], mutopiaPath: 'MozartWA/KV331/KV331_3_RondoAllaTurca/KV331_3_RondoAllaTurca', lyDir: true },
  { id: 'mozart-fantasy-d-minor', title: 'Fantasy in D Minor, K. 397', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 70, durationSec: 300, keySignature: 'Dm', tags: ['mozart', 'fantasy', 'two-hands'], mutopiaPath: 'MozartWA/KV397/Fantasia/Fantasia' },
];
