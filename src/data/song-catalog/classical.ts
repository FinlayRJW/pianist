import type { SongCatalogEntry } from './types';

export const classicalSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple classical ===
  { id: 'mozart-minuet-k2', title: 'Minuet in F Major, K. 2', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 2, bpm: 110, durationSec: 40, timeSignature: [3, 4], keySignature: 'F', tags: ['mozart', 'minuet'] },
  { id: 'mozart-minuet-k5', title: 'Minuet in F Major, K. 5', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 2, bpm: 105, durationSec: 45, timeSignature: [3, 4], keySignature: 'F', tags: ['mozart', 'minuet'] },
  { id: 'haydn-german-dance', title: 'German Dance in D Major', composer: 'Joseph Haydn', genre: 'classical', difficulty: 2, bpm: 130, durationSec: 35, keySignature: 'D', tags: ['haydn', 'dance'] },
  { id: 'clementi-sonatina-op36-1', title: 'Sonatina Op. 36 No. 1, 1st mvt', composer: 'Muzio Clementi', genre: 'classical', difficulty: 2, bpm: 120, durationSec: 50, keySignature: 'C', tags: ['clementi', 'sonatina'] },

  // === Difficulty 3: Core repertoire ===
  { id: 'fur-elise', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 180, keySignature: 'Am', tags: ['beethoven', 'bagatelle', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-bagatelle-op119-1', title: 'Bagatelle Op. 119 No. 1', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 100, durationSec: 55, keySignature: 'G', tags: ['beethoven', 'bagatelle', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-sonatina-g', title: 'Sonatina in G Major, Anh. 5', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 90, keySignature: 'G', tags: ['beethoven', 'sonatina', 'two-hands'], requiresMidi: true },

  { id: 'mozart-k545-1', title: 'Sonata in C Major, K. 545, 1st mvt', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 200, keySignature: 'C', tags: ['mozart', 'sonata', 'two-hands'], requiresMidi: true },
  { id: 'beethoven-pathetique-2', title: 'Pathétique Sonata, 2nd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 56, durationSec: 300, keySignature: 'Ab', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], requiresMidi: true },
  { id: 'mozart-twinkle-variations', title: '12 Variations on "Ah! vous dirai-je, Maman", K. 265', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 100, durationSec: 400, keySignature: 'C', tags: ['mozart', 'variations', 'two-hands'], requiresMidi: true },

  // === Difficulty 4: Substantial classical ===
  { id: 'moonlight-sonata', title: 'Moonlight Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 4, bpm: 56, durationSec: 360, keySignature: 'C#m', tags: ['beethoven', 'sonata', 'adagio', 'two-hands'], requiresMidi: true },
  { id: 'mozart-alla-turca', title: 'Rondo alla Turca, K. 331', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 140, durationSec: 210, keySignature: 'Am', tags: ['mozart', 'rondo', 'two-hands'], requiresMidi: true },
  { id: 'mozart-fantasy-d-minor', title: 'Fantasy in D Minor, K. 397', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 70, durationSec: 300, keySignature: 'Dm', tags: ['mozart', 'fantasy', 'two-hands'], requiresMidi: true },

  // === Difficulty 5: Virtuosic classical ===
  { id: 'beethoven-waldstein-1', title: 'Waldstein Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 5, bpm: 160, durationSec: 600, keySignature: 'C', tags: ['beethoven', 'sonata', 'virtuoso', 'two-hands'], requiresMidi: true },
];
