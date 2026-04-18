import type { SongMeta } from '../types';

export const SONG_CATALOG: SongMeta[] = [
  {
    id: 'middle-c-march',
    title: 'Middle C March',
    composer: 'Tutorial',
    difficulty: 1,
    bpm: 90,
    durationSec: 43,
    midiFile: 'midi/beginner/middle-c-march.mid',
    tags: ['beginner', 'right-hand-only', 'tutorial'],
    skillTreeNodeId: 'middle-c-march',
  },
  {
    id: 'c-scale-climb',
    title: 'C Scale Climb',
    composer: 'Tutorial',
    difficulty: 1,
    bpm: 80,
    durationSec: 51,
    midiFile: 'midi/beginner/c-scale-climb.mid',
    tags: ['beginner', 'right-hand-only', 'scales'],
    skillTreeNodeId: 'c-scale-climb',
  },
  {
    id: 'mary-had-a-little-lamb',
    title: 'Mary Had a Little Lamb',
    composer: 'Traditional',
    difficulty: 1,
    bpm: 100,
    durationSec: 54,
    midiFile: 'midi/beginner/mary-had-a-little-lamb.mid',
    tags: ['beginner', 'right-hand-only'],
    skillTreeNodeId: 'mary-lamb',
  },
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    composer: 'Traditional',
    difficulty: 1,
    bpm: 100,
    durationSec: 58,
    midiFile: 'midi/beginner/twinkle-twinkle.mid',
    tags: ['beginner', 'right-hand-only'],
    skillTreeNodeId: 'twinkle',
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Beethoven',
    difficulty: 2,
    bpm: 108,
    durationSec: 71,
    midiFile: 'midi/beginner/ode-to-joy.mid',
    tags: ['beginner', 'right-hand-only', 'classical'],
    skillTreeNodeId: 'ode-to-joy',
  },
];

export function getSongById(id: string): SongMeta | undefined {
  return SONG_CATALOG.find((s) => s.id === id);
}
