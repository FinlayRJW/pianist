import type { SongMeta } from '../types';
import { ALL_SONG_DEFINITIONS } from './song-definitions';
import type { SongDefinition } from './song-definitions/types';

function computeDuration(def: SongDefinition): number {
  const totalBeats = def.rightHand.rhythm.reduce((sum, r) => sum + r, 0);
  return Math.round((totalBeats * 60) / def.bpm);
}

export const SONG_CATALOG: SongMeta[] = ALL_SONG_DEFINITIONS.map((def) => ({
  id: def.id,
  title: def.title,
  composer: def.composer,
  difficulty: def.difficulty,
  bpm: def.bpm,
  durationSec: computeDuration(def),
  midiFile: `midi/${def.genre}/${def.id}.mid`,
  tags: def.tags,
  skillTreeNodeId: def.id,
  genre: def.genre,
  requiresMidi: def.requiresMidi,
  timeSignature: def.timeSignature,
  keySignature: def.keySignature,
}));

export function getSongById(id: string): SongMeta | undefined {
  return SONG_CATALOG.find((s) => s.id === id);
}
