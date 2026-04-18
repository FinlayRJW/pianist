import type { SongCatalogEntry } from './types';

export const classicalSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple classical ===
  { id: 'mozart-minuet-k2', title: 'Minuet in F Major, K. 2', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 2, bpm: 110, durationSec: 40, timeSignature: [3, 4], keySignature: 'F', tags: ['mozart', 'minuet'] },
  { id: 'mozart-minuet-k5', title: 'Minuet in F Major, K. 5', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 2, bpm: 105, durationSec: 45, timeSignature: [3, 4], keySignature: 'F', tags: ['mozart', 'minuet'] },
  { id: 'clementi-sonatina-1', title: 'Sonatina Op. 36 No. 1 in C', composer: 'Muzio Clementi', genre: 'classical', difficulty: 2, bpm: 120, durationSec: 70, keySignature: 'C', tags: ['clementi', 'sonatina'] },
  { id: 'haydn-german-dance', title: 'German Dance in D Major', composer: 'Joseph Haydn', genre: 'classical', difficulty: 2, bpm: 130, durationSec: 35, keySignature: 'D', tags: ['haydn', 'dance'] },

  // === Difficulty 3: Core repertoire ===
  { id: 'fur-elise', title: 'Für Elise, WoO 59', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 180, keySignature: 'Am', tags: ['beethoven', 'bagatelle'] },
  { id: 'mozart-k545-1', title: 'Sonata in C Major, K. 545 (1st mvt)', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 200, keySignature: 'C', tags: ['mozart', 'sonata', 'facile'] },
  { id: 'mozart-alla-turca', title: 'Rondo alla Turca, K. 331', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 130, durationSec: 210, keySignature: 'Am', tags: ['mozart', 'rondo', 'turkish-march'] },
  { id: 'clementi-sonatina-3', title: 'Sonatina Op. 36 No. 3 in C', composer: 'Muzio Clementi', genre: 'classical', difficulty: 3, bpm: 130, durationSec: 120, keySignature: 'C', tags: ['clementi', 'sonatina'] },
  { id: 'beethoven-pathetique-2', title: 'Pathétique Sonata, 2nd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 55, durationSec: 300, keySignature: 'Ab', tags: ['beethoven', 'sonata', 'adagio'] },
  { id: 'mozart-fantasy-d-minor', title: 'Fantasy in D Minor, K. 397', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 80, durationSec: 280, keySignature: 'Dm', tags: ['mozart', 'fantasy'] },
  { id: 'beethoven-bagatelle-op119-1', title: 'Bagatelle Op. 119 No. 1', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 100, durationSec: 55, keySignature: 'G', tags: ['beethoven', 'bagatelle'] },
  { id: 'haydn-sonata-c', title: 'Sonata in C Major, Hob. XVI:35 (1st mvt)', composer: 'Joseph Haydn', genre: 'classical', difficulty: 3, bpm: 125, durationSec: 200, keySignature: 'C', tags: ['haydn', 'sonata'] },
  { id: 'mozart-rondo-k511', title: 'Rondo in A Minor, K. 511', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 65, durationSec: 350, keySignature: 'Am', tags: ['mozart', 'rondo'] },
  { id: 'mozart-twinkle-variations', title: '12 Variations on "Ah vous dirai-je, Maman"', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 3, bpm: 110, durationSec: 400, keySignature: 'C', tags: ['mozart', 'variations'] },
  { id: 'beethoven-sonatina-g', title: 'Sonatina in G Major, Anh. 5', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 3, bpm: 120, durationSec: 90, keySignature: 'G', tags: ['beethoven', 'sonatina'] },

  // === Difficulty 4: Substantial classical ===
  { id: 'moonlight-sonata', title: 'Moonlight Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 4, bpm: 56, durationSec: 360, keySignature: 'C#m', tags: ['beethoven', 'sonata', 'adagio'] },
  { id: 'beethoven-tempest-3', title: 'Tempest Sonata, 3rd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 4, bpm: 140, durationSec: 350, keySignature: 'Dm', tags: ['beethoven', 'sonata'] },
  { id: 'haydn-sonata-e-minor', title: 'Sonata in E Minor, Hob. XVI:34', composer: 'Joseph Haydn', genre: 'classical', difficulty: 4, bpm: 130, durationSec: 300, keySignature: 'Em', tags: ['haydn', 'sonata'] },
  { id: 'haydn-sonata-c-hob50', title: 'Sonata in C Major, Hob. XVI:50', composer: 'Joseph Haydn', genre: 'classical', difficulty: 4, bpm: 135, durationSec: 350, keySignature: 'C', tags: ['haydn', 'sonata'] },
  { id: 'mozart-k457-1', title: 'Sonata in C Minor, K. 457 (1st mvt)', composer: 'Wolfgang Amadeus Mozart', genre: 'classical', difficulty: 4, bpm: 140, durationSec: 350, keySignature: 'Cm', tags: ['mozart', 'sonata'] },
  { id: 'beethoven-waldstein-1', title: 'Waldstein Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 5, bpm: 170, durationSec: 500, keySignature: 'C', tags: ['beethoven', 'sonata', 'virtuoso'] },
  { id: 'mendelssohn-rondo-capriccioso', title: 'Rondo Capriccioso, Op. 14', composer: 'Felix Mendelssohn', genre: 'classical', difficulty: 5, bpm: 150, durationSec: 350, keySignature: 'E', tags: ['mendelssohn', 'rondo', 'virtuoso'] },
];
