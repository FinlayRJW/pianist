import type { SongCatalogEntry } from './types';

export const beginnerSongs: SongCatalogEntry[] = [
  // === Difficulty 1: Single hand, simple patterns ===
  { id: 'middle-c-march', title: 'Middle C March', composer: 'Tutorial', genre: 'beginner', difficulty: 1, bpm: 90, durationSec: 30, keySignature: 'C', tags: ['tutorial', 'single-note'] },
  { id: 'c-scale-climb', title: 'C Scale Climb', composer: 'Tutorial', genre: 'beginner', difficulty: 1, bpm: 80, durationSec: 25, keySignature: 'C', tags: ['tutorial', 'scale'] },
  { id: 'hot-cross-buns', title: 'Hot Cross Buns', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 100, durationSec: 20, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'mary-had-a-little-lamb', title: 'Mary Had a Little Lamb', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 100, durationSec: 25, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'london-bridge', title: 'London Bridge', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 110, durationSec: 22, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'twinkle-twinkle', title: 'Twinkle Twinkle Little Star', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 90, durationSec: 35, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'jingle-bells', title: 'Jingle Bells', composer: 'James Lord Pierpont', genre: 'beginner', difficulty: 1, bpm: 110, durationSec: 30, keySignature: 'C', tags: ['christmas', 'traditional'] },
  { id: 'happy-birthday', title: 'Happy Birthday', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 100, durationSec: 20, timeSignature: [3, 4], keySignature: 'C', tags: ['traditional', 'celebration'] },
  { id: 'row-row-row', title: 'Row Row Row Your Boat', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 100, durationSec: 18, keySignature: 'C', tags: ['nursery', 'round'] },
  { id: 'baa-baa-black-sheep', title: 'Baa Baa Black Sheep', composer: 'Traditional', genre: 'beginner', difficulty: 1, bpm: 95, durationSec: 22, keySignature: 'C', tags: ['nursery', 'traditional'] },

  // === Difficulty 2: Wider range, new keys ===
  { id: 'g-scale-exercise', title: 'G Scale Exercise', composer: 'Tutorial', genre: 'beginner', difficulty: 2, bpm: 90, durationSec: 28, keySignature: 'G', tags: ['tutorial', 'scale'] },
  { id: 'ode-to-joy', title: 'Ode to Joy', composer: 'Ludwig van Beethoven', genre: 'beginner', difficulty: 2, bpm: 100, durationSec: 35, keySignature: 'C', tags: ['beethoven', 'melody'] },
  { id: 'd-scale-exercise', title: 'D Scale Exercise', composer: 'Tutorial', genre: 'beginner', difficulty: 2, bpm: 90, durationSec: 28, keySignature: 'D', tags: ['tutorial', 'scale'] },
  { id: 'f-scale-exercise', title: 'F Scale Exercise', composer: 'Tutorial', genre: 'beginner', difficulty: 2, bpm: 90, durationSec: 28, keySignature: 'F', tags: ['tutorial', 'scale'] },
  { id: 'a-minor-scale', title: 'A Minor Scale', composer: 'Tutorial', genre: 'beginner', difficulty: 2, bpm: 85, durationSec: 28, keySignature: 'Am', tags: ['tutorial', 'scale', 'minor'] },
  { id: 'frere-jacques', title: 'Frère Jacques', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 110, durationSec: 25, keySignature: 'C', tags: ['french', 'traditional', 'round'] },
  { id: 'old-macdonald', title: 'Old MacDonald', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 110, durationSec: 30, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'yankee-doodle', title: 'Yankee Doodle', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 120, durationSec: 28, keySignature: 'C', tags: ['american', 'traditional'] },
  { id: 'camptown-races', title: 'Camptown Races', composer: 'Stephen Foster', genre: 'beginner', difficulty: 2, bpm: 120, durationSec: 30, keySignature: 'C', tags: ['american', 'foster'] },
  { id: 'skip-to-my-lou', title: 'Skip to My Lou', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 115, durationSec: 25, keySignature: 'G', tags: ['american', 'traditional'] },
  { id: 'this-old-man', title: 'This Old Man', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 110, durationSec: 25, keySignature: 'C', tags: ['nursery', 'traditional'] },
  { id: 'aura-lee', title: 'Aura Lee', composer: 'George R. Poulton', genre: 'beginner', difficulty: 2, bpm: 90, durationSec: 35, keySignature: 'C', tags: ['traditional', 'love-song'] },
  { id: 'lightly-row', title: 'Lightly Row', composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 100, durationSec: 25, keySignature: 'C', tags: ['traditional', 'german'] },
  { id: 'lavenders-blue', title: "Lavender's Blue", composer: 'Traditional', genre: 'beginner', difficulty: 2, bpm: 95, durationSec: 30, timeSignature: [3, 4], keySignature: 'C', tags: ['english', 'traditional'] },
  { id: 'simple-chords-c', title: 'Simple Chords in C', composer: 'Tutorial', genre: 'beginner', difficulty: 2, bpm: 80, durationSec: 40, keySignature: 'C', tags: ['tutorial', 'chords', 'two-hands'] },
];
