import type { SongGenre } from '../../types';

export interface SongDefinition {
  id: string;
  title: string;
  composer: string;
  genre: SongGenre;
  difficulty: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  timeSignature?: [number, number];
  keySignature?: string;
  tags: string[];
  requiresMidi?: boolean;
  rightHand: { notes: number[]; rhythm: number[] };
  leftHand?: { notes: number[]; rhythm: number[] };
}
