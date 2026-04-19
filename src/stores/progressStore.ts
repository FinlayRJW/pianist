import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SongScore } from '../types';
import { SKILL_TREE_AREAS, SKILL_TREE_NODES } from '../data/skill-tree';
import { isJourneyComplete, isFirstNotesComplete } from '../data/journey';

interface ProgressStore {
  scores: Record<string, SongScore[]>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  adventureBestStars: Record<string, 0 | 1 | 2 | 3>;
  journeyBestStars: Record<string, 0 | 1 | 2 | 3>;
  journeyCompleted: boolean;
  freePlayUnlocked: boolean;
  unlockedNodes: string[];
  addScore: (score: SongScore, songUnlocked: boolean) => void;
  addJourneyScore: (score: SongScore) => void;
  getBestStars: (songId: string) => 0 | 1 | 2 | 3;
  totalStars: () => number;
  areaStars: (areaId: string) => number;
  computeUnlocks: () => void;
  exportProgress: () => string;
  importProgress: (json: string) => void;
  resetProgress: () => void;
}

function computeUnlockedNodes(adventureBestStars: Record<string, 0 | 1 | 2 | 3>): string[] {
  const unlocked: string[] = [];

  for (const area of SKILL_TREE_AREAS) {
    const areaNodes = SKILL_TREE_NODES.filter((n) => n.areaId === area.id);
    for (const node of areaNodes) {
      if (node.requires.length === 0) {
        unlocked.push(node.id);
        continue;
      }
      const met = node.requires.every((reqId) => {
        const reqNode = SKILL_TREE_NODES.find((n) => n.id === reqId);
        if (!reqNode) return false;
        return (adventureBestStars[reqNode.songId] ?? 0) >= node.starsRequired;
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
      adventureBestStars: {},
      journeyBestStars: {},
      journeyCompleted: false,
      freePlayUnlocked: false,
      unlockedNodes: computeUnlockedNodes({}),

      addScore: (score, songUnlocked) =>
        set((state) => {
          const existing = state.scores[score.songId] || [];
          const currentBest = state.bestStars[score.songId] || 0;
          const newBestStars = {
            ...state.bestStars,
            [score.songId]: Math.max(currentBest, score.stars) as 0 | 1 | 2 | 3,
          };
          const newAdventureBestStars = { ...state.adventureBestStars };
          if (songUnlocked) {
            const currentAdv = newAdventureBestStars[score.songId] || 0;
            newAdventureBestStars[score.songId] = Math.max(currentAdv, score.stars) as 0 | 1 | 2 | 3;
          }
          return {
            scores: {
              ...state.scores,
              [score.songId]: [...existing, score],
            },
            bestStars: newBestStars,
            adventureBestStars: newAdventureBestStars,
            unlockedNodes: computeUnlockedNodes(newAdventureBestStars),
          };
        }),

      addJourneyScore: (score) =>
        set((state) => {
          const existing = state.scores[score.songId] || [];
          const currentBest = state.bestStars[score.songId] || 0;
          const currentJourney = state.journeyBestStars[score.songId] || 0;
          const newJourneyStars = {
            ...state.journeyBestStars,
            [score.songId]: Math.max(currentJourney, score.stars) as 0 | 1 | 2 | 3,
          };
          return {
            scores: {
              ...state.scores,
              [score.songId]: [...existing, score],
            },
            bestStars: {
              ...state.bestStars,
              [score.songId]: Math.max(currentBest, score.stars) as 0 | 1 | 2 | 3,
            },
            journeyBestStars: newJourneyStars,
            journeyCompleted: isJourneyComplete(newJourneyStars),
            freePlayUnlocked: isFirstNotesComplete(newJourneyStars),
          };
        }),

      getBestStars: (songId) => get().bestStars[songId] || 0,

      totalStars: () => {
        const { bestStars } = get();
        return Object.values(bestStars).reduce<number>((sum, s) => sum + s, 0);
      },

      areaStars: (areaId) => {
        const { bestStars } = get();
        const areaNodes = SKILL_TREE_NODES.filter((n) => n.areaId === areaId);
        return areaNodes.reduce((sum, node) => sum + (bestStars[node.songId] ?? 0), 0);
      },

      computeUnlocks: () =>
        set((state) => ({
          unlockedNodes: computeUnlockedNodes(state.adventureBestStars),
        })),

      exportProgress: () => {
        const { scores, bestStars, adventureBestStars, journeyBestStars } = get();
        return JSON.stringify({ version: 3, scores, bestStars, adventureBestStars, journeyBestStars, exportedAt: Date.now() });
      },

      importProgress: (json) => {
        const data = JSON.parse(json);
        if (data.version !== 1 && data.version !== 2 && data.version !== 3) throw new Error('Unsupported backup format');
        if (!data.scores || !data.bestStars) throw new Error('Invalid backup data');
        const adventureBestStars = data.adventureBestStars ?? data.bestStars;
        const journeyBestStars = data.journeyBestStars ?? {};
        set({
          scores: data.scores,
          bestStars: data.bestStars,
          adventureBestStars,
          journeyBestStars,
          journeyCompleted: isJourneyComplete(journeyBestStars),
          freePlayUnlocked: isFirstNotesComplete(journeyBestStars),
          unlockedNodes: computeUnlockedNodes(adventureBestStars),
        });
      },

      resetProgress: () =>
        set({
          scores: {},
          bestStars: {},
          adventureBestStars: {},
          journeyBestStars: {},
          journeyCompleted: false,
          freePlayUnlocked: false,
          unlockedNodes: computeUnlockedNodes({}),
        }),
    }),
    {
      name: 'pianist-progress',
      onRehydrateStorage: () => (state: ProgressStore | undefined) => {
        if (state) {
          if (!state.adventureBestStars || Object.keys(state.adventureBestStars).length === 0) {
            state.adventureBestStars = { ...state.bestStars };
          }
          if (!state.journeyBestStars) {
            state.journeyBestStars = {};
          }
          state.journeyCompleted = isJourneyComplete(state.journeyBestStars);
          state.freePlayUnlocked = isFirstNotesComplete(state.journeyBestStars);
          state.unlockedNodes = computeUnlockedNodes(state.adventureBestStars);
        }
      },
    },
  ),
);
