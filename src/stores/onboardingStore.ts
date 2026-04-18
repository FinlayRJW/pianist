import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DisplayMode } from '../types';

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
  displayMode: DisplayMode;
  completeOnboarding: () => void;
  setCalibration: (data: CalibrationData) => void;
  resetCalibration: () => void;
  setHeadphonesMode: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      calibration: null,
      headphonesMode: false,
      theme: 'dark',
      displayMode: 'falling',
      completeOnboarding: () => set({ completed: true }),
      setCalibration: (data) => set({ calibration: data }),
      resetCalibration: () => set({ calibration: null }),
      setHeadphonesMode: (enabled) => set({ headphonesMode: enabled }),
      setTheme: (theme) => set({ theme }),
      setDisplayMode: (mode) => set({ displayMode: mode }),
    }),
    { name: 'pianist-onboarding' },
  ),
);
