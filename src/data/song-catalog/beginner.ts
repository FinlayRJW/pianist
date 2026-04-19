import type { SongCatalogEntry } from './types';

export const beginnerSongs: SongCatalogEntry[] = [
  // Schumann — Romantic
  { id: 'schumann-melodie-op68-1', title: 'Mélodie', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 80, durationSec: 60, keySignature: 'C', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-01-melodie/schumann-op68-01-melodie', requiresMidi: true },
  { id: 'schumann-march-op68-2', title: 'Marche militaire', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 120, durationSec: 45, keySignature: 'G', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-02-marche-militaire/schumann-op68-02-marche-militaire', requiresMidi: true },
  { id: 'schumann-humming-op68-3', title: 'Chanson fredonnée', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 72, durationSec: 50, keySignature: 'C', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-03-chanson-fredonnee/schumann-op68-03-chanson-fredonnee', requiresMidi: true },
  { id: 'schumann-choral-op68-4', title: 'Un choral', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 66, durationSec: 40, keySignature: 'G', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-04-choral/schumann-op68-04-choral', requiresMidi: true },
  { id: 'schumann-petite-op68-5', title: 'Petite pièce', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 100, durationSec: 35, keySignature: 'C', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-05-petite-piece/schumann-op68-05-petite-piece', requiresMidi: true },
  { id: 'schumann-orphan-op68-6', title: 'Pauvre orpheline', composer: 'Robert Schumann', genre: 'romantic', difficulty: 1, bpm: 72, durationSec: 50, keySignature: 'Am', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-06-pauvre-orpheline/schumann-op68-06-pauvre-orpheline', requiresMidi: true },
  { id: 'schumann-laboureur-op68-10', title: 'Le gai laboureur', composer: 'Robert Schumann', genre: 'romantic', difficulty: 2, bpm: 112, durationSec: 50, keySignature: 'F', tags: ['schumann', 'album-for-young'], mutopiaPath: 'SchumannR/O68/schumann-op68-10-gai-laboureur/schumann-op68-10-gai-laboureur', requiresMidi: true },

  // Czerny — Classical
  { id: 'czerny-op821-no1', title: 'Exercise No. 1', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_001/Czerny_Op_821_No_001', requiresMidi: true },
  { id: 'czerny-op821-no2', title: 'Exercise No. 2', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_002/Czerny_Op_821_No_002', requiresMidi: true },
  { id: 'czerny-op821-no3', title: 'Exercise No. 3', composer: 'Carl Czerny', genre: 'classical', difficulty: 1, bpm: 100, durationSec: 30, keySignature: 'C', tags: ['czerny', 'exercise'], mutopiaPath: 'CzernyC/Op_821/Czerny_Op_821_No_003/Czerny_Op_821_No_003', requiresMidi: true },

  // Bach — Baroque
  { id: 'bach-applicatio-bwv994', title: 'Applicatio', composer: 'J.S. Bach', genre: 'baroque', difficulty: 1, bpm: 80, durationSec: 45, keySignature: 'C', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWV994/bach-applicatio/bach-applicatio', requiresMidi: true },
  { id: 'bach-menuet-g-anh114', title: 'Menuet in G', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 120, durationSec: 70, keySignature: 'G', tags: ['bach', 'notebook', 'menuet'], mutopiaPath: 'BachJS/BWVAnh114/anna-magdalena-04/anna-magdalena-04', requiresMidi: true },
  { id: 'bach-menuet-gm-anh115', title: 'Menuet in G minor', composer: 'Christian Petzold', genre: 'baroque', difficulty: 2, bpm: 108, durationSec: 70, keySignature: 'Gm', tags: ['bach', 'notebook', 'menuet'], mutopiaPath: 'BachJS/BWVAnh115/anna-magdalena-05/anna-magdalena-05', requiresMidi: true },
  { id: 'bach-menuet-anh116', title: 'Menuet in G', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 116, durationSec: 55, keySignature: 'G', tags: ['bach', 'notebook', 'menuet'], mutopiaPath: 'BachJS/BWVAnh116/anna-magdalena-07/anna-magdalena-07', requiresMidi: true },
  { id: 'bach-polonaise-f-anh117a', title: 'Polonaise in F', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 50, keySignature: 'F', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWV117a/BWV-117a/BWV-117a', requiresMidi: true },
  { id: 'bach-minuet-bb-anh118', title: 'Minuet in B-flat', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 112, durationSec: 55, keySignature: 'Bb', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh118/BWV-118/BWV-118', requiresMidi: true },
  { id: 'bach-polonaise-gm-anh119', title: 'Polonaise in G minor', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 100, durationSec: 60, keySignature: 'Gm', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh119/BWV-119/BWV-119', requiresMidi: true },
  { id: 'bach-minuet-am-anh120', title: 'Minuet in A minor', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 108, durationSec: 50, keySignature: 'Am', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh120/BWV-120/BWV-120', requiresMidi: true },
  { id: 'bach-musette-anh126', title: 'Musette in D', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 116, durationSec: 55, keySignature: 'D', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh126/anna-magdalena-22/anna-magdalena-22', requiresMidi: true },
  { id: 'bach-march-eb-anh127', title: 'March in E-flat', composer: 'J.S. Bach', genre: 'baroque', difficulty: 2, bpm: 108, durationSec: 50, keySignature: 'Eb', tags: ['bach', 'notebook'], mutopiaPath: 'BachJS/BWVAnh127/BWV-127/BWV-127', requiresMidi: true },

  // Burgmüller — Romantic
  { id: 'burgmuller-candeur-op100-1', title: 'La Candeur', composer: 'Friedrich Burgmüller', genre: 'romantic', difficulty: 2, bpm: 152, durationSec: 55, keySignature: 'C', tags: ['burgmuller', 'etude'], mutopiaPath: 'BurgmullerJFF/O100/25EF-01/25EF-01', requiresMidi: true },
  { id: 'burgmuller-pastorale-op100-3', title: 'La Pastorale', composer: 'Friedrich Burgmüller', genre: 'romantic', difficulty: 2, bpm: 100, durationSec: 65, keySignature: 'G', tags: ['burgmuller', 'etude'], mutopiaPath: 'BurgmullerJFF/O100/25EF-03/25EF-03', requiresMidi: true },

  // Clementi, Kuhlau — Classical
  { id: 'clementi-sonatina-op36-1', title: 'Sonatina Op. 36 No. 1', composer: 'Muzio Clementi', genre: 'classical', difficulty: 2, bpm: 120, durationSec: 80, keySignature: 'C', tags: ['clementi', 'sonatina'], mutopiaPath: 'ClementiM/O36/sonatina-1/sonatina-1', midZip: 'ClementiM/O36/sonatina-1/sonatina-1-mids', requiresMidi: true },
  { id: 'kuhlau-sonatina-op20-1', title: 'Sonatina Op. 20 No. 1', composer: 'Friedrich Kuhlau', genre: 'classical', difficulty: 2, bpm: 132, durationSec: 100, keySignature: 'C', tags: ['kuhlau', 'sonatina'], mutopiaPath: 'KuhlauF/O20/sonatine-1-allegro/sonatine-1-allegro', requiresMidi: true },
];
