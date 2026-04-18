import type { SongCatalogEntry } from './types';

export const romanticSongs: SongCatalogEntry[] = [
  // === Difficulty 3 ===
  { id: 'chopin-prelude-e-minor', title: 'Prelude Op. 28 No. 4 in E Minor', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 3, bpm: 55, durationSec: 120, keySignature: 'Em', tags: ['chopin', 'prelude', 'two-hands'], requiresMidi: true },
  { id: 'grieg-waltz-op12-2', title: 'Waltz, Op. 12 No. 2', composer: 'Edvard Grieg', genre: 'romantic', difficulty: 3, bpm: 130, durationSec: 100, timeSignature: [3, 4], keySignature: 'Am', tags: ['grieg', 'lyric-piece', 'waltz', 'two-hands'], requiresMidi: true },

  // === Difficulty 4 ===
  { id: 'chopin-nocturne-op9-2', title: 'Nocturne Op. 9 No. 2 in Eb Major', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 65, durationSec: 270, keySignature: 'Eb', tags: ['chopin', 'nocturne', 'two-hands'], requiresMidi: true },
  { id: 'chopin-prelude-raindrop', title: 'Prelude Op. 28 No. 15 "Raindrop"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 330, keySignature: 'Db', tags: ['chopin', 'prelude', 'raindrop', 'two-hands'], requiresMidi: true },
  { id: 'chopin-etude-op10-3', title: 'Etude Op. 10 No. 3 "Tristesse"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 65, durationSec: 250, keySignature: 'E', tags: ['chopin', 'etude', 'two-hands'], requiresMidi: true },
  { id: 'liszt-liebestraum-3', title: 'Liebesträum No. 3 in Ab Major', composer: 'Franz Liszt', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 280, keySignature: 'Ab', tags: ['liszt', 'nocturne', 'love', 'two-hands'], requiresMidi: true },
  { id: 'schumann-arabesque', title: 'Arabesque, Op. 18', composer: 'Robert Schumann', genre: 'romantic', difficulty: 4, bpm: 100, durationSec: 350, keySignature: 'C', tags: ['schumann', 'arabesque', 'two-hands'], requiresMidi: true },
  { id: 'brahms-intermezzo-op118-2', title: 'Intermezzo Op. 118 No. 2 in A Major', composer: 'Johannes Brahms', genre: 'romantic', difficulty: 4, bpm: 58, durationSec: 350, keySignature: 'A', tags: ['brahms', 'intermezzo', 'late', 'two-hands'], requiresMidi: true },
  { id: 'schubert-impromptu-op90-3', title: 'Impromptu Op. 90 No. 3 in Gb Major', composer: 'Franz Schubert', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 350, keySignature: 'Gb', tags: ['schubert', 'impromptu', 'two-hands'], requiresMidi: true },
  { id: 'schubert-impromptu-op90-2', title: 'Impromptu Op. 90 No. 2 in Eb Major', composer: 'Franz Schubert', genre: 'romantic', difficulty: 4, bpm: 140, durationSec: 250, keySignature: 'Eb', tags: ['schubert', 'impromptu', 'two-hands'], requiresMidi: true },
  { id: 'rachmaninoff-prelude-csharp', title: 'Prelude in C# Minor, Op. 3 No. 2', composer: 'Sergei Rachmaninoff', genre: 'romantic', difficulty: 5, bpm: 55, durationSec: 240, keySignature: 'C#m', tags: ['rachmaninoff', 'prelude', 'two-hands'], requiresMidi: true },

  // === Difficulty 5 ===
  { id: 'chopin-ballade-1', title: 'Ballade No. 1 in G Minor, Op. 23', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 70, durationSec: 540, keySignature: 'Gm', tags: ['chopin', 'ballade', 'virtuoso', 'two-hands'], requiresMidi: true },
  { id: 'chopin-etude-op10-12', title: 'Etude Op. 10 No. 12 "Revolutionary"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 150, durationSec: 160, keySignature: 'Cm', tags: ['chopin', 'etude', 'revolutionary', 'two-hands'], requiresMidi: true },
  { id: 'chopin-polonaise-53', title: 'Polonaise Op. 53 "Heroic"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 120, durationSec: 370, keySignature: 'Ab', tags: ['chopin', 'polonaise', 'heroic', 'two-hands'], requiresMidi: true },
  { id: 'chopin-scherzo-2', title: 'Scherzo No. 2 in Bb Minor, Op. 31', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 140, durationSec: 550, keySignature: 'Bbm', tags: ['chopin', 'scherzo', 'virtuoso', 'two-hands'], requiresMidi: true },
];
