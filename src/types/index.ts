export interface SongMeta {
  id: string;
  title: string;
  composer: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  durationSec: number;
  midiFile: string;
  tags: string[];
  skillTreeNodeId: string;
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

export interface SkillTreeNode {
  id: string;
  songId: string;
  x: number;
  y: number;
  requires: string[];
}

export interface UserProgress {
  scores: Record<string, SongScore[]>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  unlockedNodes: string[];
}

export interface UserSettings {
  inputMode: 'mic' | 'midi';
  midiDeviceId: string | null;
  latencyOffsetMs: number;
  scrollSpeed: number;
  noteColorScheme: 'hand' | 'velocity' | 'single';
}
