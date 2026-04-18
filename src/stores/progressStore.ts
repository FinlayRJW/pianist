import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SongScore } from '../types';
import { SKILL_TREE_AREAS, SKILL_TREE_NODES } from '../data/skill-tree';

interface ProgressStore {
  scores: Record<string, SongScore[]>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  unlockedNodes: string[];
  addScore: (score: SongScore) => void;
  getBestStars: (songId: string) => 0 | 1 | 2 | 3;
  totalStars: () => number;
  areaStars: (areaId: string) => number;
  computeUnlocks: () => void;
  exportProgress: () => string;
  importProgress: (json: string) => void;
  resetProgress: () => void;
}

function computeUnlockedNodes(bestStars: Record<string, 0 | 1 | 2 | 3>): string[] {
  const unlocked: string[] = [];

  const firstStepsStars = SKILL_TREE_NODES
    .filter((n) => n.areaId === 'beginner')
    .reduce((sum, n) => sum + (bestStars[n.songId] ?? 0), 0);

  for (const area of SKILL_TREE_AREAS) {
    if (area.id !== 'beginner' && firstStepsStars < area.starsToUnlock) continue;

    const areaNodes = SKILL_TREE_NODES.filter((n) => n.areaId === area.id);
    for (const node of areaNodes) {
      if (node.requires.length === 0) {
        unlocked.push(node.id);
        continue;
      }
      const met = node.requires.every((reqId) => {
        const reqNode = SKILL_TREE_NODES.find((n) => n.id === reqId);
        if (!reqNode) return false;
        return (bestStars[reqNode.songId] ?? 0) >= node.starsRequired;
      });
      if (met) unlocked.push(node.id);
    }
  }

  return unlocked;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      scores: {},
      bestStars: {},
      unlockedNodes: computeUnlockedNodes({}),

      addScore: (score) =>
        set((state) => {
          const existing = state.scores[score.songId] || [];
          const currentBest = state.bestStars[score.songId] || 0;
          const newBestStars = {
            ...state.bestStars,
            [score.songId]: Math.max(currentBest, score.stars) as 0 | 1 | 2 | 3,
          };
          return {
            scores: {
              ...state.scores,
              [score.songId]: [...existing, score],
            },
            bestStars: newBestStars,
            unlockedNodes: computeUnlockedNodes(newBestStars),
          };
        }),

      getBestStars: (songId) => get().bestStars[songId] || 0,

      totalStars: () => {
        const { bestStars } = get();
        return Object.values(bestStars).reduce((sum, s) => sum + s, 0);
      },

      areaStars: (areaId) => {
        const { bestStars } = get();
        const areaNodes = SKILL_TREE_NODES.filter((n) => n.areaId === areaId);
        return areaNodes.reduce((sum, node) => sum + (bestStars[node.songId] ?? 0), 0);
      },

      computeUnlocks: () =>
        set((state) => ({
          unlockedNodes: computeUnlockedNodes(state.bestStars),
        })),

      exportProgress: () => {
        const { scores, bestStars } = get();
        return JSON.stringify({ version: 1, scores, bestStars, exportedAt: Date.now() });
      },

      importProgress: (json) => {
        const data = JSON.parse(json);
        if (data.version !== 1) throw new Error('Unsupported backup format');
        if (!data.scores || !data.bestStars) throw new Error('Invalid backup data');
        set({
          scores: data.scores,
          bestStars: data.bestStars,
          unlockedNodes: computeUnlockedNodes(data.bestStars),
        });
      },

      resetProgress: () =>
        set({
          scores: {},
          bestStars: {},
          unlockedNodes: computeUnlockedNodes({}),
        }),
    }),
    {
      name: 'pianist-progress',
      onRehydrate: () => (state) => {
        if (state) {
          state.unlockedNodes = computeUnlockedNodes(state.bestStars);
        }
      },
    },
  ),
);
