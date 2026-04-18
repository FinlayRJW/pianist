import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalibrationData {
  gain: number;
  onsetThreshold: number;
  offsetThreshold: number;
  ambientRms: number;
}

interface OnboardingStore {
  completed: boolean;
  calibration: CalibrationData | null;
  completeOnboarding: () => void;
  setCalibration: (data: CalibrationData) => void;
  resetCalibration: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      calibration: null,
      completeOnboarding: () => set({ completed: true }),
      setCalibration: (data) => set({ calibration: data }),
      resetCalibration: () => set({ calibration: null }),
    }),
    { name: 'pianist-onboarding' },
  ),
);
