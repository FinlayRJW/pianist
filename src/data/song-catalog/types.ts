import type { SongGenre } from '../../types';

export interface SongCatalogEntry {
  id: string;
  title: string;
  composer: string;
  genre: SongGenre;
  genres?: SongGenre[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  durationSec: number;
  timeSignature?: [number, number];
  keySignature?: string;
  tags: string[];
  mutopiaPath?: string;
  midZip?: string;
  lyDir?: boolean;
  journeySong?: boolean;
}
