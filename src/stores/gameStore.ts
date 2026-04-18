import { create } from 'zustand';
import type { ParsedSong } from '../types';

interface GameStore {
  currentSong: ParsedSong | null;
  setCurrentSong: (song: ParsedSong | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentSong: null,
  setCurrentSong: (song) => set({ currentSong: song }),
}));
