import type { SkillTreeArea, SkillTreeNode } from '../types';
import { SONG_CATALOG } from './songs';

export const SKILL_TREE_AREAS: SkillTreeArea[] = [
  { id: 'beginner', name: 'First Steps', genre: 'beginner', order: 0, starsToUnlock: 0, description: 'Learn the basics', color: '#22d3ee' },
  { id: 'folk', name: 'Folk & Traditional', genre: 'folk', order: 1, starsToUnlock: 4, description: 'Classic melodies everyone knows', color: '#34d399' },
  { id: 'baroque', name: 'Baroque', genre: 'baroque', order: 2, starsToUnlock: 4, description: 'Bach, Handel, Scarlatti', color: '#c084fc' },
  { id: 'classical', name: 'Classical', genre: 'classical', order: 3, starsToUnlock: 4, description: 'Mozart, Beethoven, Haydn', color: '#a78bfa' },
  { id: 'romantic', name: 'Romantic', genre: 'romantic', order: 4, starsToUnlock: 4, description: 'Chopin, Liszt, Schumann', color: '#f472b6' },
  { id: 'impressionist', name: 'Impressionist', genre: 'impressionist', order: 5, starsToUnlock: 4, description: 'Debussy, Satie, Ravel', color: '#67e8f9' },
  { id: 'jazz', name: 'Jazz & Ragtime', genre: 'jazz', order: 6, starsToUnlock: 4, description: 'Joplin and early jazz', color: '#f59e0b' },
  { id: 'advanced', name: 'Master Class', genre: 'advanced', order: 7, starsToUnlock: 4, description: 'The ultimate challenge', color: '#fbbf24' },
];

const COLS = 3;
const COL_X = [80, 150, 220];
const TOP_PAD = 60;
const ROW_H = 72;

function generateNodes(): SkillTreeNode[] {
  const nodes: SkillTreeNode[] = [];

  for (const area of SKILL_TREE_AREAS) {
    const areaSongs = SONG_CATALOG
      .filter((s) => s.genre === area.genre)
      .sort((a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title));

    if (areaSongs.length === 0) continue;

    const numRows = Math.ceil(areaSongs.length / COLS);
    const isFirstSteps = area.id === 'beginner';

    areaSongs.forEach((song, i) => {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const invertedRow = numRows - 1 - row;

      const dx = Math.round(Math.sin(i * 7.3 + area.order * 3.1) * 10);
      const dy = Math.round(Math.sin(i * 13.1 + area.order * 5.7) * 6);
      const x = COL_X[col] + dx;
      const y = TOP_PAD + invertedRow * ROW_H + dy;

      const requires: string[] = [];
      if (row === 0) {
        if (!isFirstSteps && i > 0) {
          requires.push(areaSongs[0].id);
        }
      } else {
        const prevIdx = (row - 1) * COLS + col;
        if (prevIdx < areaSongs.length) {
          requires.push(areaSongs[prevIdx].id);
        }
      }

      let starsRequired = 0;
      if (row === 0) {
        starsRequired = (isFirstSteps || i === 0) ? 0 : 1;
      } else if (row >= numRows - 1 && numRows > 3) {
        starsRequired = 2;
      } else {
        starsRequired = 1;
      }

      nodes.push({
        id: song.id,
        songId: song.id,
        areaId: area.id,
        x,
        y,
        requires,
        starsRequired,
      });
    });
  }

  return nodes;
}

export const SKILL_TREE_NODES: SkillTreeNode[] = generateNodes();

export function getNodesBySongId(songId: string): SkillTreeNode | undefined {
  return SKILL_TREE_NODES.find((n) => n.songId === songId);
}

export function getAreaNodes(areaId: string): SkillTreeNode[] {
  return SKILL_TREE_NODES.filter((n) => n.areaId === areaId);
}
