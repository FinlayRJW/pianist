import type { SongCatalogEntry } from './types';

export const impressionistSongs: SongCatalogEntry[] = [
  // === Difficulty 3: Satie ===
  { id: 'gymnopedie-no1', title: 'Gymnopédie No. 1', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 190, timeSignature: [3, 4], keySignature: 'D', tags: ['satie', 'gymnopedie'] },
  { id: 'satie-gymnopedie-2', title: 'Gymnopédie No. 2', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 170, timeSignature: [3, 4], keySignature: 'C', tags: ['satie', 'gymnopedie'] },
  { id: 'satie-gymnopedie-3', title: 'Gymnopédie No. 3', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 66, durationSec: 150, timeSignature: [3, 4], keySignature: 'Am', tags: ['satie', 'gymnopedie'] },
  { id: 'satie-gnossienne-1', title: 'Gnossienne No. 1', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 60, durationSec: 210, keySignature: 'Fm', tags: ['satie', 'gnossienne'] },
  { id: 'satie-gnossienne-3', title: 'Gnossienne No. 3', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 55, durationSec: 180, keySignature: 'Am', tags: ['satie', 'gnossienne'] },
  { id: 'satie-je-te-veux', title: 'Je te veux', composer: 'Erik Satie', genre: 'impressionist', difficulty: 3, bpm: 120, durationSec: 200, timeSignature: [3, 4], keySignature: 'G', tags: ['satie', 'waltz'] },

  // === Difficulty 4: Debussy ===
  { id: 'debussy-arabesque-1', title: 'Arabesque No. 1', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 75, durationSec: 280, keySignature: 'E', tags: ['debussy', 'arabesque'] },
  { id: 'debussy-clair-de-lune', title: 'Clair de Lune', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 55, durationSec: 320, keySignature: 'Db', tags: ['debussy', 'suite-bergamasque'] },
  { id: 'debussy-reverie', title: 'Rêverie', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 60, durationSec: 280, keySignature: 'F', tags: ['debussy', 'reverie'] },
  { id: 'debussy-girl-flaxen-hair', title: 'The Girl with the Flaxen Hair', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 60, durationSec: 160, keySignature: 'Gb', tags: ['debussy', 'preludes'] },
  { id: 'debussy-doctor-gradus', title: 'Doctor Gradus ad Parnassum', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 4, bpm: 120, durationSec: 180, keySignature: 'C', tags: ['debussy', 'children-corner'] },
  { id: 'ravel-pavane', title: 'Pavane pour une infante défunte', composer: 'Maurice Ravel', genre: 'impressionist', difficulty: 4, bpm: 55, durationSec: 360, keySignature: 'G', tags: ['ravel', 'pavane'] },

  // === Difficulty 5: Advanced impressionist ===
  { id: 'debussy-voiles', title: 'Voiles (Preludes Book I)', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 5, bpm: 65, durationSec: 210, keySignature: 'C', tags: ['debussy', 'preludes', 'whole-tone'] },
  { id: 'debussy-estampes', title: 'Estampes: Pagodes', composer: 'Claude Debussy', genre: 'impressionist', difficulty: 5, bpm: 65, durationSec: 300, keySignature: 'B', tags: ['debussy', 'estampes', 'pentatonic'] },
  { id: 'ravel-jeux-deau', title: "Jeux d'eau", composer: 'Maurice Ravel', genre: 'impressionist', difficulty: 5, bpm: 110, durationSec: 330, keySignature: 'E', tags: ['ravel', 'water', 'virtuoso'] },
];
