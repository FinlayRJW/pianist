import type { SongCatalogEntry } from './types';

export const romanticSongs: SongCatalogEntry[] = [
  // === Difficulty 3: Accessible romantic pieces ===
  { id: 'chopin-prelude-e-minor', title: 'Prelude Op. 28 No. 4 in E Minor', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 3, bpm: 55, durationSec: 120, keySignature: 'Em', tags: ['chopin', 'prelude'] },
  { id: 'chopin-prelude-a-major', title: 'Prelude Op. 28 No. 7 in A Major', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 3, bpm: 65, durationSec: 50, keySignature: 'A', tags: ['chopin', 'prelude', 'mazurka'] },
  { id: 'chopin-waltz-a-minor', title: 'Waltz in A Minor, B. 150', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 3, bpm: 140, durationSec: 100, timeSignature: [3, 4], keySignature: 'Am', tags: ['chopin', 'waltz'] },
  { id: 'schumann-traumerei', title: 'Träumerei, Op. 15 No. 7', composer: 'Robert Schumann', genre: 'romantic', difficulty: 3, bpm: 65, durationSec: 150, keySignature: 'F', tags: ['schumann', 'kinderszenen', 'dreaming'] },
  { id: 'brahms-waltz-op39-15', title: 'Waltz Op. 39 No. 15 in Ab Major', composer: 'Johannes Brahms', genre: 'romantic', difficulty: 3, bpm: 120, durationSec: 80, timeSignature: [3, 4], keySignature: 'Ab', tags: ['brahms', 'waltz'] },
  { id: 'grieg-waltz-op12-2', title: 'Waltz, Op. 12 No. 2', composer: 'Edvard Grieg', genre: 'romantic', difficulty: 3, bpm: 130, durationSec: 100, timeSignature: [3, 4], keySignature: 'Am', tags: ['grieg', 'lyric-piece', 'waltz'] },

  // === Difficulty 4: Core romantic repertoire ===
  { id: 'chopin-nocturne-op9-2', title: 'Nocturne Op. 9 No. 2 in Eb Major', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 65, durationSec: 270, keySignature: 'Eb', tags: ['chopin', 'nocturne'] },
  { id: 'chopin-waltz-minute', title: 'Minute Waltz, Op. 64 No. 1', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 180, durationSec: 110, timeSignature: [3, 4], keySignature: 'Db', tags: ['chopin', 'waltz', 'virtuoso'] },
  { id: 'chopin-waltz-csharp-minor', title: 'Waltz in C# Minor, Op. 64 No. 2', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 140, durationSec: 200, timeSignature: [3, 4], keySignature: 'C#m', tags: ['chopin', 'waltz'] },
  { id: 'chopin-prelude-raindrop', title: 'Prelude Op. 28 No. 15 "Raindrop"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 330, keySignature: 'Db', tags: ['chopin', 'prelude', 'raindrop'] },
  { id: 'chopin-nocturne-op27-2', title: 'Nocturne Op. 27 No. 2 in Db Major', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 50, durationSec: 350, keySignature: 'Db', tags: ['chopin', 'nocturne'] },
  { id: 'chopin-etude-op10-3', title: 'Etude Op. 10 No. 3 "Tristesse"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 4, bpm: 65, durationSec: 250, keySignature: 'E', tags: ['chopin', 'etude'] },
  { id: 'liszt-liebestraum-3', title: 'Liebesträum No. 3 in Ab Major', composer: 'Franz Liszt', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 280, keySignature: 'Ab', tags: ['liszt', 'nocturne', 'love'] },
  { id: 'schumann-arabesque', title: 'Arabesque, Op. 18', composer: 'Robert Schumann', genre: 'romantic', difficulty: 4, bpm: 100, durationSec: 350, keySignature: 'C', tags: ['schumann', 'arabesque'] },
  { id: 'brahms-intermezzo-op118-2', title: 'Intermezzo Op. 118 No. 2 in A Major', composer: 'Johannes Brahms', genre: 'romantic', difficulty: 4, bpm: 58, durationSec: 350, keySignature: 'A', tags: ['brahms', 'intermezzo', 'late'] },
  { id: 'schubert-impromptu-op90-3', title: 'Impromptu Op. 90 No. 3 in Gb Major', composer: 'Franz Schubert', genre: 'romantic', difficulty: 4, bpm: 60, durationSec: 350, keySignature: 'Gb', tags: ['schubert', 'impromptu'] },
  { id: 'schubert-impromptu-op90-2', title: 'Impromptu Op. 90 No. 2 in Eb Major', composer: 'Franz Schubert', genre: 'romantic', difficulty: 4, bpm: 140, durationSec: 250, keySignature: 'Eb', tags: ['schubert', 'impromptu'] },
  { id: 'tchaikovsky-june', title: 'June: Barcarolle, Op. 37b', composer: 'Pyotr Ilyich Tchaikovsky', genre: 'romantic', difficulty: 4, bpm: 55, durationSec: 300, keySignature: 'G', tags: ['tchaikovsky', 'seasons'] },
  { id: 'mendelssohn-song-spring', title: 'Spring Song, Op. 62 No. 6', composer: 'Felix Mendelssohn', genre: 'romantic', difficulty: 4, bpm: 110, durationSec: 150, keySignature: 'A', tags: ['mendelssohn', 'songs-without-words'] },

  // === Difficulty 5: Virtuoso romantic ===
  { id: 'chopin-ballade-1', title: 'Ballade No. 1 in G Minor, Op. 23', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 70, durationSec: 540, keySignature: 'Gm', tags: ['chopin', 'ballade', 'virtuoso'] },
  { id: 'chopin-etude-op10-12', title: 'Etude Op. 10 No. 12 "Revolutionary"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 150, durationSec: 160, keySignature: 'Cm', tags: ['chopin', 'etude', 'revolutionary'] },
  { id: 'chopin-polonaise-53', title: 'Polonaise Op. 53 "Heroic"', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 120, durationSec: 370, keySignature: 'Ab', tags: ['chopin', 'polonaise', 'heroic'] },
  { id: 'chopin-scherzo-2', title: 'Scherzo No. 2 in Bb Minor, Op. 31', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 140, durationSec: 550, keySignature: 'Bbm', tags: ['chopin', 'scherzo', 'virtuoso'] },
  { id: 'rachmaninoff-prelude-csharp', title: 'Prelude in C# Minor, Op. 3 No. 2', composer: 'Sergei Rachmaninoff', genre: 'romantic', difficulty: 5, bpm: 55, durationSec: 240, keySignature: 'C#m', tags: ['rachmaninoff', 'prelude'] },
  { id: 'rachmaninoff-prelude-g-minor', title: 'Prelude in G Minor, Op. 23 No. 5', composer: 'Sergei Rachmaninoff', genre: 'romantic', difficulty: 5, bpm: 100, durationSec: 220, keySignature: 'Gm', tags: ['rachmaninoff', 'prelude', 'march'] },
];
