import type { SongMeta } from '../types';
import { ALL_CATALOG_ENTRIES } from './song-catalog';

export const SONG_CATALOG: SongMeta[] = ALL_CATALOG_ENTRIES.map((entry) => ({
  id: entry.id,
  title: entry.title,
  composer: entry.composer,
  difficulty: entry.difficulty,
  bpm: entry.bpm,
  durationSec: entry.durationSec,
  midiFile: `midi/${entry.genre}/${entry.id}.mid`,
  tags: entry.tags,
  skillTreeNodeId: entry.id,
  genre: entry.genre,
  timeSignature: entry.timeSignature,
  keySignature: entry.keySignature,
  source: 'bundled',
}));

export function getSongById(id: string): SongMeta | undefined {
  return SONG_CATALOG.find((s) => s.id === id);
}
