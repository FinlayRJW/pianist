import type { SkillTreeArea, SkillTreeNode } from '../types';

export const SKILL_TREE_AREAS: SkillTreeArea[] = [
  { id: 'beginner', name: 'First Steps', genre: 'beginner', order: 0, starsToUnlock: 0, description: 'Learn the basics', color: '#22d3ee' },
  { id: 'folk', name: 'Folk & Traditional', genre: 'folk', order: 1, starsToUnlock: 8, description: 'Classic melodies everyone knows', color: '#34d399' },
  { id: 'classical', name: 'Classical', genre: 'classical', order: 2, starsToUnlock: 14, description: 'The great composers', color: '#a78bfa' },
  { id: 'pop', name: 'Pop', genre: 'pop', order: 3, starsToUnlock: 20, description: 'Modern chord progressions', color: '#f472b6' },
  { id: 'rock', name: 'Rock', genre: 'rock', order: 4, starsToUnlock: 26, description: 'Power and energy', color: '#ef4444' },
  { id: 'funk', name: 'Funk', genre: 'funk', order: 5, starsToUnlock: 32, description: 'Get groovy', color: '#f59e0b' },
  { id: 'jazz', name: 'Jazz', genre: 'jazz', order: 6, starsToUnlock: 38, description: 'Swing and improvise', color: '#6366f1' },
  { id: 'advanced', name: 'Master Class', genre: 'advanced', order: 7, starsToUnlock: 46, description: 'The ultimate challenge', color: '#fbbf24' },
];

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  // Beginner (8 songs)
  { id: 'middle-c-march', songId: 'middle-c-march', areaId: 'beginner', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'c-scale-climb', songId: 'c-scale-climb', areaId: 'beginner', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'hot-cross-buns', songId: 'hot-cross-buns', areaId: 'beginner', x: 1, y: 0, requires: ['middle-c-march'], starsRequired: 1 },
  { id: 'mary-lamb', songId: 'mary-had-a-little-lamb', areaId: 'beginner', x: 1, y: 1, requires: ['c-scale-climb'], starsRequired: 1 },
  { id: 'london-bridge', songId: 'london-bridge', areaId: 'beginner', x: 2, y: 0, requires: ['hot-cross-buns'], starsRequired: 1 },
  { id: 'twinkle', songId: 'twinkle-twinkle', areaId: 'beginner', x: 2, y: 1, requires: ['mary-lamb'], starsRequired: 1 },
  { id: 'g-scale', songId: 'g-scale-exercise', areaId: 'beginner', x: 3, y: 0, requires: ['london-bridge', 'twinkle'], starsRequired: 1 },
  { id: 'ode-to-joy', songId: 'ode-to-joy', areaId: 'beginner', x: 3, y: 1, requires: ['london-bridge', 'twinkle'], starsRequired: 1 },

  // Folk (6 songs)
  { id: 'oh-susanna', songId: 'oh-susanna', areaId: 'folk', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'when-saints', songId: 'when-the-saints', areaId: 'folk', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'amazing-grace', songId: 'amazing-grace', areaId: 'folk', x: 1, y: 0, requires: ['oh-susanna'], starsRequired: 1 },
  { id: 'auld-lang-syne', songId: 'auld-lang-syne', areaId: 'folk', x: 1, y: 1, requires: ['when-saints'], starsRequired: 1 },
  { id: 'scarborough-fair', songId: 'scarborough-fair', areaId: 'folk', x: 2, y: 0, requires: ['amazing-grace'], starsRequired: 1 },
  { id: 'greensleeves', songId: 'greensleeves', areaId: 'folk', x: 2, y: 1, requires: ['auld-lang-syne'], starsRequired: 2 },

  // Classical (6 songs)
  { id: 'minuet-in-g', songId: 'minuet-in-g', areaId: 'classical', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'prelude-c', songId: 'prelude-in-c', areaId: 'classical', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'canon-in-d', songId: 'canon-in-d', areaId: 'classical', x: 1, y: 0, requires: ['minuet-in-g'], starsRequired: 1 },
  { id: 'fur-elise', songId: 'fur-elise', areaId: 'classical', x: 1, y: 1, requires: ['prelude-c'], starsRequired: 1 },
  { id: 'gymnopedie', songId: 'gymnopedie-no1', areaId: 'classical', x: 2, y: 0, requires: ['canon-in-d'], starsRequired: 1 },
  { id: 'moonlight', songId: 'moonlight-sonata', areaId: 'classical', x: 2, y: 1, requires: ['fur-elise'], starsRequired: 2 },

  // Pop (5 songs)
  { id: 'morning-dew', songId: 'morning-dew', areaId: 'pop', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'sunset-walk', songId: 'sunset-walk', areaId: 'pop', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'city-lights', songId: 'city-lights', areaId: 'pop', x: 1, y: 0, requires: ['morning-dew'], starsRequired: 1 },
  { id: 'ocean-breeze', songId: 'ocean-breeze', areaId: 'pop', x: 1, y: 1, requires: ['sunset-walk'], starsRequired: 1 },
  { id: 'starlight', songId: 'starlight', areaId: 'pop', x: 2, y: 0, requires: ['city-lights', 'ocean-breeze'], starsRequired: 2 },

  // Rock (5 songs)
  { id: 'power-up', songId: 'power-up', areaId: 'rock', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'thunder-road', songId: 'thunder-road', areaId: 'rock', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'electric-storm', songId: 'electric-storm', areaId: 'rock', x: 1, y: 0, requires: ['power-up'], starsRequired: 1 },
  { id: 'midnight-run', songId: 'midnight-run', areaId: 'rock', x: 1, y: 1, requires: ['thunder-road'], starsRequired: 1 },
  { id: 'iron-will', songId: 'iron-will', areaId: 'rock', x: 2, y: 0, requires: ['electric-storm', 'midnight-run'], starsRequired: 2 },

  // Funk (5 songs)
  { id: 'funky-chicken', songId: 'funky-chicken', areaId: 'funk', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'groove-machine', songId: 'groove-machine', areaId: 'funk', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'bass-face', songId: 'bass-face', areaId: 'funk', x: 1, y: 0, requires: ['funky-chicken'], starsRequired: 1 },
  { id: 'slap-happy', songId: 'slap-happy', areaId: 'funk', x: 1, y: 1, requires: ['groove-machine'], starsRequired: 1 },
  { id: 'disco-inferno', songId: 'disco-inferno', areaId: 'funk', x: 2, y: 0, requires: ['bass-face', 'slap-happy'], starsRequired: 2 },

  // Jazz (5 songs)
  { id: 'blue-note-shuffle', songId: 'blue-note-shuffle', areaId: 'jazz', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'smooth-evening', songId: 'smooth-evening', areaId: 'jazz', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'swing-time', songId: 'swing-time', areaId: 'jazz', x: 1, y: 0, requires: ['blue-note-shuffle'], starsRequired: 1 },
  { id: 'bebop-basics', songId: 'bebop-basics', areaId: 'jazz', x: 1, y: 1, requires: ['smooth-evening'], starsRequired: 1 },
  { id: 'jazz-hands', songId: 'jazz-hands', areaId: 'jazz', x: 2, y: 0, requires: ['swing-time', 'bebop-basics'], starsRequired: 2 },

  // Advanced (5 songs)
  { id: 'velocity', songId: 'velocity', areaId: 'advanced', x: 0, y: 0, requires: [], starsRequired: 0 },
  { id: 'chromatic-run', songId: 'chromatic-run', areaId: 'advanced', x: 0, y: 1, requires: [], starsRequired: 0 },
  { id: 'octave-storm', songId: 'octave-storm', areaId: 'advanced', x: 1, y: 0, requires: ['velocity'], starsRequired: 1 },
  { id: 'polyrhythm', songId: 'polyrhythm', areaId: 'advanced', x: 1, y: 1, requires: ['chromatic-run'], starsRequired: 1 },
  { id: 'grand-finale', songId: 'grand-finale', areaId: 'advanced', x: 2, y: 0, requires: ['octave-storm', 'polyrhythm'], starsRequired: 2 },
];

export function getNodesBySongId(songId: string): SkillTreeNode | undefined {
  return SKILL_TREE_NODES.find((n) => n.songId === songId);
}

export function getAreaNodes(areaId: string): SkillTreeNode[] {
  return SKILL_TREE_NODES.filter((n) => n.areaId === areaId);
}
