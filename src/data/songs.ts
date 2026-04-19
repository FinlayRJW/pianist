import type { SongMeta } from '../types';
import { ALL_CATALOG_ENTRIES } from './song-catalog';

export const SONG_CATALOG: SongMeta[] = ALL_CATALOG_ENTRIES.map((entry) => ({
  id: entry.id,
  title: entry.title,
  composer: entry.composer,
  difficulty: entry.difficulty,
  bpm: entry.bpm,
  durationSec: entry.durationSec,
  midiFile: entry.journeySong ? `midi/journey/${entry.id}.mid` : `midi/${entry.genre}/${entry.id}.mid`,
  lyFile: entry.mutopiaPath ? (entry.journeySong ? `ly/journey/${entry.id}.ly` : `ly/${entry.genre}/${entry.id}.ly`) : undefined,
  tags: entry.tags,
  skillTreeNodeId: entry.id,
  genre: entry.genre,
  genres: entry.genres,
  timeSignature: entry.timeSignature,
  keySignature: entry.keySignature,
  source: 'bundled',
  requiresMidi: entry.requiresMidi ?? entry.tags.some((t) => ['chords', 'two-hands', 'arpeggiated'].includes(t)),
  journeySong: entry.journeySong,
}));

export function getSongById(id: string): SongMeta | undefined {
  return SONG_CATALOG.find((s) => s.id === id);
}
