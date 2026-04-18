import type { SongCatalogEntry } from './types';

export const classicalSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple classical ===
  { id: 'mozart-minuet-k5', title: 'Minuet in F Major, K. 5', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 2, bpm: 105, durationSec: 45, timeSignature: [3, 4], keySignature: 'F', tags: ['mozart', 'minuet'] },
  { id: 'haydn-german-dance', title: 'German Dance in D Major', composer: 'Joseph Haydn', genre: 'classical', difficulty: 2, bpm: 130, durationSec: 35, keySignature: 'D', tags: ['haydn', 'dance'] },

  // === Difficulty 3: Core repertoire ===
  { id: 'fur-elise', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 180, keySignature: 'Am', tags: ['beethoven', 'bagatelle', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-bagatelle-op119-1', title: 'Bagatelle Op. 119 No. 1', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 100, durationSec: 55, keySignature: 'G', tags: ['beethoven', 'bagatelle', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-sonatina-g', title: 'Sonatina in G Major, Anh. 5', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 90, keySignature: 'G', tags: ['beethoven', 'sonatina', 'two-hands'], requiresMidi: true },

  // === Difficulty 4: Substantial classical ===
  { id: 'moonlight-sonata', title: 'Moonlight Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 4, bpm: 56, durationSec: 360, keySignature: 'C#m', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], requiresMidi: true },
];
