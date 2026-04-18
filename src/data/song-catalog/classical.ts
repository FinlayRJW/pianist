import type { SongCatalogEntry } from './types';

export const classicalSongs: SongCatalogEntry[] = [
  { id: 'fur-elise', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 180, keySignature: 'Am', tags: ['beethoven', 'bagatelle', 'two-hands'], requiresMidi: true },
  { id: 'mozart-k545-1', title: 'Sonata in C Major, K. 545, 1st mvt', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 200, keySignature: 'C', tags: ['mozart', 'sonata', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-pathetique-2', title: 'Pathétique Sonata, 2nd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 56, durationSec: 300, keySignature: 'Ab', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], requiresMidi: true },
  { id: 'moonlight-sonata', title: 'Moonlight Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 4, bpm: 56, durationSec: 360, keySignature: 'C#m', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], requiresMidi: true },
  { id: 'mozart-alla-turca', title: 'Rondo alla Turca, K. 331', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 140, durationSec: 210, keySignature: 'Am', tags: ['mozart', 'rondo', 'two-hands'], requiresMidi: true },
  { id: 'mozart-fantasy-d-minor', title: 'Fantasy in D Minor, K. 397', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 70, durationSec: 300, keySignature: 'Dm', tags: ['mozart', 'fantasy', 'two-hands'], requiresMidi: true },
];
