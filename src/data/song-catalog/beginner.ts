import type { SongCatalogEntry } from './types';

export const beginnerSongs: SongCatalogEntry[] = [
  // Schumann — Romantic
  { id: 'schumann-choral-op68-4', title: 'Un choral', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 66, durationSec: 40, keySignature: 'G', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-04-choral/schumann-op68-04-choral' },
  { id: 'schumann-petite-op68-5', title: 'Petite pièce', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 100, durationSec: 35, keySignature: 'C', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-05-petite-piece/schumann-op68-05-petite-piece' },
  { id: 'schumann-orphan-op68-6', title: 'Pauvre orpheline', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 72, durationSec: 50, keySignature: 'Am', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-06-pauvre-orpheline/schumann-op68-06-pauvre-orpheline' },

  // Czerny — Classical
  { id: 'czerny-op821-no1', title: 'Exercise No. 1', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_001/Czerny_Op_821_No_001' },
  { id: 'czerny-op821-no2', title: 'Exercise No. 2', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_002/Czerny_Op_821_No_002' },
  { id: 'czerny-op821-no3', title: 'Exercise No. 3', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_003/Czerny_Op_821_No_003' },

  // Bach — Baroque
  { id: 'bach-menuet-anh116', title: 'Menuet in G', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 116, durationSec: 55, keySignature: 'G', tags: ['bach', 'notebook', 'menuet'], mutopiaPath: 'BachJS/BWVAnh116/anna-magdalena-07/anna-magdalena-07' },
  { id: 'bach-polonaise-f-anh117a', title: 'Polonaise in F', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 50, keySignature: 'F', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWV117a/BWV-117a/BWV-117a' },
  { id: 'bach-minuet-bb-anh118', title: 'Minuet in B-flat', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 112, durationSec: 55, keySignature: 'Bb', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh118/BWV-118/BWV-118' },
  { id: 'bach-minuet-am-anh120', title: 'Minuet in A minor', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 108, durationSec: 50, keySignature: 'Am', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh120/BWV-120/BWV-120' },
  { id: 'bach-march-eb-anh127', title: 'March in E-flat', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 108, durationSec: 50, keySignature: 'Eb', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh127/BWV-127/BWV-127' },

  // Burgmüller — Romantic
  { id: 'burgmuller-pastorale-op100-3', title: 'La Pastorale', composer: 'Friedrich Burgmüller', genre: 'romantic', difficulty: 2, bpm: 100, durationSec: 65, keySignature: 'G', tags: ['burgmuller', 'etude'], mutopiaPath: 'BurgmullerJFF/O100/25EF-03/25EF-03' },
];
