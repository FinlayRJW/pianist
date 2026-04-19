import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';
import { saveProgress } from '../services/piApi';

interface OnboardingStore {
  completed: boolean;
  theme: 'dark' | 'light';
  viewMode: 'waterfall' | 'sheet' | 'combined';
  midiBridgeUrl: string | null;
  octaveEquivalence: boolean;
  completeOnboarding: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setViewMode: (mode: 'waterfall' | 'sheet' | 'combined') => void;
  setMidiBridgeUrl: (url: string | null) => void;
  setOctaveEquivalence: (enabled: boolean) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      theme: 'dark',
      viewMode: 'waterfall',
      midiBridgeUrl: null,
      octaveEquivalence: true,
      completeOnboarding: () => {
        set({ completed: true });
        const user = useUserStore.getState().currentUser;
        if (user) {
          const ps = useProgressStore.getState();
          saveProgress(user.id, {
            version: 3,
            scores: ps.scores,
            bestStars: ps.bestStars,
            adventureBestStars: ps.adventureBestStars,
            journeyBestStars: ps.journeyBestStars,
            onboardingCompleted: true,
          }).catch(() => {});
        }
      },
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setMidiBridgeUrl: (url) => set({ midiBridgeUrl: url }),
      setOctaveEquivalence: (enabled) => set({ octaveEquivalence: enabled }),
    }),
    { name: 'pianist-onboarding' },
  ),
);
