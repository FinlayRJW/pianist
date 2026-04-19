import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';
import { saveProgress } from '../services/piApi';

export interface CalibrationData {
  gain: number;
  onsetThreshold: number;
  offsetThreshold: number;
  ambientRms: number;
}

interface OnboardingStore {
  completed: boolean;
  calibration: CalibrationData | null;
  headphonesMode: boolean;
  theme: 'dark' | 'light';
  viewMode: 'waterfall' | 'sheet' | 'combined';
  midiBridgeUrl: string | null;
  completeOnboarding: () => void;
  setCalibration: (data: CalibrationData) => void;
  resetCalibration: () => void;
  setHeadphonesMode: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setViewMode: (mode: 'waterfall' | 'sheet' | 'combined') => void;
  setMidiBridgeUrl: (url: string | null) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      calibration: null,
      headphonesMode: false,
      theme: 'dark',
      viewMode: 'waterfall',
      midiBridgeUrl: null,
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
      setCalibration: (data) => set({ calibration: data }),
      resetCalibration: () => set({ calibration: null }),
      setHeadphonesMode: (enabled) => set({ headphonesMode: enabled }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setMidiBridgeUrl: (url) => set({ midiBridgeUrl: url }),
    }),
    { name: 'pianist-onboarding' },
  ),
);
