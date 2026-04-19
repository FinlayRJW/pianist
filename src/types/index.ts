export type SongGenre = 'baroque' | 'classical' | 'romantic' | 'impressionist' | 'jazz';

export interface SongMeta {
  id: string;
  title: string;
  composer: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  durationSec: number;
  midiFile: string;
  lyFile?: string;
  tags: string[];
  skillTreeNodeId: string;
  genre: SongGenre;
  genres?: SongGenre[];
  timeSignature?: [number, number];
  keySignature?: string;
  source?: 'bundled' | 'imported';
  journeySong?: boolean;
}

export interface Note {
  midi: number;
  name: string;
  startTime: number;
  duration: number;
  velocity: number;
  track: number;
}

export interface ParsedSong {
  meta: SongMeta;
  notes: Note[];
  tracks: { name: string; notes: Note[] }[];
  totalDuration: number;
}

export interface NoteHit {
  noteIndex: number;
  timingDeltaMs: number;
  rating: 'perfect' | 'great' | 'good' | 'miss';
}

export interface SongScore {
  songId: string;
  timestamp: number;
  totalNotes: number;
  hits: { perfect: number; great: number; good: number; miss: number };
  maxCombo: number;
  accuracy: number;
  stars: 0 | 1 | 2 | 3;
}

export interface SkillTreeArea {
  id: string;
  name: string;
  genre: SongGenre;
  order: number;
  starsToUnlock: number;
  description: string;
  color: string;
}

export interface SkillTreeNode {
  id: string;
  songId: string;
  areaId: string;
  x: number;
  y: number;
  requires: string[];
  starsRequired: number;
}

export interface UserProgress {
  scores: Record<string, SongScore[]>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  unlockedNodes: string[];
}

export interface JourneyChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string;
}

export type JourneyStep =
  | { type: 'linear'; id: string; chapterId: string; order: number; songId: string; teaches: string; description: string }
  | { type: 'branch'; id: string; chapterId: string; order: number; songChoices: [string, string]; teaches: string; description: string };

export interface UserSettings {
  inputMode: 'mic' | 'midi';
  midiDeviceId: string | null;
  latencyOffsetMs: number;
  scrollSpeed: number;
  noteColorScheme: 'hand' | 'velocity' | 'single';
}

