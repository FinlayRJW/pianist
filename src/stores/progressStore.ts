import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SongScore } from '../types';

interface ProgressStore {
  scores: Record<string, SongScore[]>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  addScore: (score: SongScore) => void;
  getBestStars: (songId: string) => 0 | 1 | 2 | 3;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      scores: {},
      bestStars: {},
      addScore: (score) =>
        set((state) => {
          const existing = state.scores[score.songId] || [];
          const currentBest = state.bestStars[score.songId] || 0;
          return {
            scores: {
              ...state.scores,
              [score.songId]: [...existing, score],
            },
            bestStars: {
              ...state.bestStars,
              [score.songId]: Math.max(currentBest, score.stars) as 0 | 1 | 2 | 3,
            },
          };
        }),
      getBestStars: (songId) => get().bestStars[songId] || 0,
    }),
    { name: 'pianist-progress' },
  ),
);
