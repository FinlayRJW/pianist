import type { SongCatalogEntry } from './types';

export const advancedSongs: SongCatalogEntry[] = [
  // Chopin — Romantic
  { id: 'chopin-fantaisie-impromptu', title: 'Fantaisie-Impromptu, Op. 66', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 160, durationSec: 280, keySignature: 'C#m', tags: ['chopin', 'impromptu', 'virtuoso', 'two-hands'], mutopiaPath: 'ChopinFF/O66/chopin_fantaisie-impromptu/chopin_fantaisie-impromptu' },
  { id: 'chopin-sonata-op35-4', title: 'Sonata Op. 35, Finale', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 160, durationSec: 90, keySignature: 'Bbm', tags: ['chopin', 'sonata', 'two-hands'], mutopiaPath: 'ChopinFF/O35/chp-op-35-4-scholz-fi/chp-op-35-4-scholz-fi', lyDir: true },
  { id: 'chopin-etude-op10-1', title: 'Etude Op. 10 No. 1 in C Major', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 170, durationSec: 120, keySignature: 'C', tags: ['chopin', 'etude', 'two-hands'], mutopiaPath: 'ChopinFF/O10/chp-10-01/chp-10-01', lyDir: true },
  { id: 'chopin-etude-op10-9', title: 'Etude Op. 10 No. 9 in F Minor', composer: 'Frédéric Chopin', genre: 'romantic', difficulty: 5, bpm: 96, durationSec: 120, keySignature: 'Fm', tags: ['chopin', 'etude', 'two-hands'], mutopiaPath: 'ChopinFF/O10/chopin-op-10-09-wfi/chopin-op-10-09-wfi' },

  // Beethoven — Classical
  { id: 'beethoven-moonlight-3', title: 'Moonlight Sonata, 3rd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 5, bpm: 160, durationSec: 420, keySignature: 'C#m', tags: ['beethoven', 'sonata', 'presto', 'two-hands'], mutopiaPath: 'BeethovenLv/O27/moonlight/moonlight', midZip: 'BeethovenLv/O27/moonlight/moonlight-mids', lyDir: true },
  { id: 'beethoven-appassionata-3', title: 'Appassionata Sonata, 3rd mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 5, bpm: 130, durationSec: 480, keySignature: 'Fm', tags: ['beethoven', 'sonata', 'two-hands'], mutopiaPath: 'BeethovenLv/O57/LVB_Sonate_57_3/LVB_Sonate_57_3', lyDir: true },
  { id: 'beethoven-tempest-1', title: 'Tempest Sonata, 1st mvt', composer: 'Ludwig van Beethoven', genre: 'classical', difficulty: 5, bpm: 100, durationSec: 500, keySignature: 'Dm', tags: ['beethoven', 'sonata', 'two-hands'], mutopiaPath: 'BeethovenLv/O31/LVB_Sonate_31no2_1/LVB_Sonate_31no2_1' },

  // Liszt — Romantic
  { id: 'liszt-ballade-2', title: 'Ballade No. 2 in B Minor', composer: 'Franz Liszt', genre: 'romantic', difficulty: 5, bpm: 70, durationSec: 700, keySignature: 'Bm', tags: ['liszt', 'ballade', 'virtuoso', 'two-hands'], mutopiaPath: 'LisztF/ballade/ballade' },

  // Scriabin — Romantic
  { id: 'scriabin-etude-op2-1', title: 'Etude Op. 2 No. 1 in C# Minor', composer: 'Alexander Scriabin', genre: 'romantic', difficulty: 4, bpm: 58, durationSec: 200, keySignature: 'C#m', tags: ['scriabin', 'etude', 'two-hands'], mutopiaPath: 'ScriabinA/O2/scriabin_etude_2_1/scriabin_etude_2_1' },

  // Bach — Baroque
  { id: 'bach-italian-concerto', title: 'Italian Concerto, BWV 971', composer: 'J.S. Bach', genre: 'baroque', difficulty: 5, bpm: 120, durationSec: 600, keySignature: 'F', tags: ['bach', 'concerto', 'two-hands'], mutopiaPath: 'BachJS/BWV971/piano/piano', midZip: 'BachJS/BWV971/piano/piano-mids', lyDir: true },
];
