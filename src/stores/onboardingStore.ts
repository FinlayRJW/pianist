import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';
import { saveProgress, saveSettings, type UserSettings } from '../services/piApi';

interface OnboardingStore {
  completed: boolean;
  theme: 'dark' | 'light';
  viewMode: 'waterfall' | 'sheet' | 'combined';
  midiBridgeUrl: string | null;
  octaveEquivalence: boolean;
  autoPlaySound: boolean;
  completeOnboarding: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setViewMode: (mode: 'waterfall' | 'sheet' | 'combined') => void;
  setMidiBridgeUrl: (url: string | null) => void;
  setOctaveEquivalence: (enabled: boolean) => void;
  setAutoPlaySound: (enabled: boolean) => void;
  exportSettings: () => UserSettings;
  importSettings: (s: UserSettings) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedSaveSettings() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const user = useUserStore.getState().currentUser;
    if (!user) return;
    const settings = useOnboardingStore.getState().exportSettings();
    saveSettings(user.id, settings).catch(() => {});
  }, 1000);
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      completed: false,
      theme: 'dark',
      viewMode: 'waterfall',
      midiBridgeUrl: null,
      octaveEquivalence: true,
      autoPlaySound: false,
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
      setTheme: (theme) => { set({ theme }); debouncedSaveSettings(); },
      setViewMode: (mode) => { set({ viewMode: mode }); debouncedSaveSettings(); },
      setMidiBridgeUrl: (url) => set({ midiBridgeUrl: url }),
      setOctaveEquivalence: (enabled) => { set({ octaveEquivalence: enabled }); debouncedSaveSettings(); },
      setAutoPlaySound: (enabled) => { set({ autoPlaySound: enabled }); debouncedSaveSettings(); },
      exportSettings: () => ({
        theme: get().theme,
        viewMode: get().viewMode,
        octaveEquivalence: get().octaveEquivalence,
        autoPlaySound: get().autoPlaySound,
      }),
      importSettings: (s: UserSettings) => {
        set({
          ...(s.theme !== undefined && { theme: s.theme }),
          ...(s.viewMode !== undefined && { viewMode: s.viewMode }),
          ...(s.octaveEquivalence !== undefined && { octaveEquivalence: s.octaveEquivalence }),
          ...(s.autoPlaySound !== undefined && { autoPlaySound: s.autoPlaySound }),
        });
      },
    }),
    { name: 'pianist-onboarding' },
  ),
);
