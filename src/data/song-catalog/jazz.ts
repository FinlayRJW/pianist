import type { SongCatalogEntry } from './types';

export const jazzSongs: SongCatalogEntry[] = [
  { id: 'joplin-entertainer', title: 'The Entertainer', composer: 'Scott Joplin', genre: 'jazz', difficulty: 2, bpm: 100, durationSec: 240, keySignature: 'C', tags: ['joplin', 'ragtime', 'two-hands'], mutopiaPath: 'JoplinS/entertainer/entertainer', requiresMidi: true },
  { id: 'joplin-bethena', title: 'Bethena (A Concert Waltz)', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 80, durationSec: 300, timeSignature: [3, 4], keySignature: 'Bb', tags: ['joplin', 'ragtime', 'waltz', 'two-hands'], mutopiaPath: 'JoplinS/bethena/bethena', lyDir: true, requiresMidi: true },
  { id: 'joplin-maple-leaf', title: 'Maple Leaf Rag', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 100, durationSec: 200, keySignature: 'Ab', tags: ['joplin', 'ragtime', 'two-hands'], mutopiaPath: 'JoplinS/maple/maple', requiresMidi: true },
  { id: 'joplin-solace', title: 'Solace (A Mexican Serenade)', composer: 'Scott Joplin', genre: 'jazz', difficulty: 3, bpm: 72, durationSec: 280, keySignature: 'G', tags: ['joplin', 'ragtime', 'two-hands'], mutopiaPath: 'JoplinS/solace/solace', lyDir: true, requiresMidi: true },
];
