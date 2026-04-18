import type { SongCatalogEntry } from './types';

export const folkSongs: SongCatalogEntry[] = [
  // === Difficulty 2: Simple folk melodies ===
  { id: 'oh-susanna', title: 'Oh! Susanna', composer: 'Stephen Foster', genre: 'folk', difficulty: 2, bpm: 120, durationSec: 35, keySignature: 'C', tags: ['american', 'foster'] },
  { id: 'when-the-saints', title: 'When the Saints Go Marching In', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 110, durationSec: 35, keySignature: 'C', tags: ['spiritual', 'jazz-standard'] },
  { id: 'amazing-grace', title: 'Amazing Grace', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 80, durationSec: 50, timeSignature: [3, 4], keySignature: 'G', tags: ['hymn', 'spiritual'] },
  { id: 'simple-gifts', title: 'Simple Gifts', composer: 'Elder Joseph Brackett', genre: 'folk', difficulty: 2, bpm: 100, durationSec: 35, keySignature: 'C', tags: ['shaker', 'hymn'] },
  { id: 'kumbaya', title: 'Kumbaya', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 85, durationSec: 40, keySignature: 'C', tags: ['spiritual', 'campfire'] },
  { id: 'michael-row-the-boat', title: 'Michael Row the Boat Ashore', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 95, durationSec: 35, keySignature: 'C', tags: ['spiritual'] },
  { id: 'swing-low', title: 'Swing Low, Sweet Chariot', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 80, durationSec: 40, keySignature: 'F', tags: ['spiritual'] },
  { id: 'home-on-the-range', title: 'Home on the Range', composer: 'Traditional', genre: 'folk', difficulty: 2, bpm: 90, durationSec: 45, timeSignature: [3, 4], keySignature: 'G', tags: ['american', 'cowboy'] },
  { id: 'silent-night', title: 'Silent Night', composer: 'Franz Xaver Gruber', genre: 'folk', difficulty: 2, bpm: 75, durationSec: 50, timeSignature: [3, 4], keySignature: 'C', tags: ['christmas', 'hymn'] },

  // === Difficulty 3: More complex arrangements ===
  { id: 'auld-lang-syne', title: 'Auld Lang Syne', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 95, durationSec: 45, keySignature: 'F', tags: ['scottish', 'new-year'] },
  { id: 'scarborough-fair', title: 'Scarborough Fair', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 80, durationSec: 55, timeSignature: [3, 4], keySignature: 'Dm', tags: ['english', 'medieval'] },
  { id: 'greensleeves', title: 'Greensleeves', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 85, durationSec: 60, timeSignature: [3, 4], keySignature: 'Am', tags: ['english', 'renaissance'] },
  { id: 'danny-boy', title: 'Danny Boy', composer: 'Traditional Irish', genre: 'folk', difficulty: 3, bpm: 72, durationSec: 65, keySignature: 'C', tags: ['irish', 'ballad'] },
  { id: 'shenandoah', title: 'Shenandoah', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 70, durationSec: 55, keySignature: 'C', tags: ['american', 'sea-shanty'] },
  { id: 'beautiful-dreamer', title: 'Beautiful Dreamer', composer: 'Stephen Foster', genre: 'folk', difficulty: 3, bpm: 80, durationSec: 55, timeSignature: [3, 4], keySignature: 'C', tags: ['american', 'foster'] },
  { id: 'my-bonnie', title: 'My Bonnie Lies Over the Ocean', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 100, durationSec: 40, timeSignature: [3, 4], keySignature: 'G', tags: ['scottish', 'sea'] },
  { id: 'sakura', title: 'Sakura Sakura', composer: 'Traditional Japanese', genre: 'folk', difficulty: 3, bpm: 70, durationSec: 45, keySignature: 'Am', tags: ['japanese', 'pentatonic'] },
  { id: 'annie-laurie', title: 'Annie Laurie', composer: 'Lady John Scott', genre: 'folk', difficulty: 3, bpm: 80, durationSec: 50, keySignature: 'Eb', tags: ['scottish', 'love-song'] },
  { id: 'drink-to-me-only', title: 'Drink to Me Only with Thine Eyes', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 90, durationSec: 40, keySignature: 'C', tags: ['english'] },
  { id: 'molly-malone', title: 'Molly Malone', composer: 'Traditional Irish', genre: 'folk', difficulty: 3, bpm: 95, durationSec: 45, timeSignature: [3, 4], keySignature: 'G', tags: ['irish', 'ballad'] },
  { id: 'the-water-is-wide', title: 'The Water Is Wide', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 70, durationSec: 55, keySignature: 'C', tags: ['english', 'ballad'] },
  { id: 'loch-lomond', title: 'Loch Lomond', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 90, durationSec: 50, keySignature: 'G', tags: ['scottish'] },
  { id: 'la-cucaracha', title: 'La Cucaracha', composer: 'Traditional Mexican', genre: 'folk', difficulty: 3, bpm: 120, durationSec: 35, keySignature: 'C', tags: ['mexican', 'folk'] },
  { id: 'hava-nagila', title: 'Hava Nagila', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 130, durationSec: 45, keySignature: 'E', tags: ['jewish', 'celebratory'] },
  { id: 'waltzing-matilda', title: 'Waltzing Matilda', composer: 'Traditional Australian', genre: 'folk', difficulty: 3, bpm: 100, durationSec: 40, keySignature: 'G', tags: ['australian'] },
  { id: 'house-of-the-rising-sun', title: 'House of the Rising Sun', composer: 'Traditional', genre: 'folk', difficulty: 3, bpm: 80, durationSec: 50, timeSignature: [3, 4], keySignature: 'Am', tags: ['american', 'blues-folk'] },
  { id: 'kalinka', title: 'Kalinka', composer: 'Ivan Larionov', genre: 'folk', difficulty: 3, bpm: 130, durationSec: 45, keySignature: 'Am', tags: ['russian'] },
];
