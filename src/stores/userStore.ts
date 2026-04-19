import { create } from 'zustand';
import {
  checkPiReachable,
  fetchUsers,
  createUser as apiCreateUser,
  deleteUser as apiDeleteUser,
  fetchProgress,
  type PiUser,
} from '../services/piApi';
import { useProgressStore } from './progressStore';
import { useImportedSongsStore } from './importedSongsStore';
import { saveProgress } from '../services/piApi';

const LAST_USER_KEY = 'pianist-last-user';

interface UserStore {
  piConnected: boolean;
  users: PiUser[];
  currentUser: PiUser | null;
  loading: boolean;

  checkPi: () => Promise<void>;
  loadUsers: () => Promise<void>;
  selectUser: (userId: string) => Promise<void>;
  createUser: (name: string) => Promise<PiUser>;
  deleteUser: (userId: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  piConnected: false,
  users: [],
  currentUser: null,
  loading: false,

  checkPi: async () => {
    const reachable = await checkPiReachable();
    set({ piConnected: reachable });
    if (reachable) {
      await get().loadUsers();
      useImportedSongsStore.getState().syncFromPi();
    }
  },

  loadUsers: async () => {
    try {
      const users = await fetchUsers();
      set({ users });
    } catch {
      set({ piConnected: false, users: [] });
    }
  },

  selectUser: async (userId: string) => {
    const { users, currentUser } = get();
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    set({ loading: true });
    try {
      if (currentUser) {
        const ps = useProgressStore.getState();
        await saveProgress(currentUser.id, {
          version: 3,
          scores: ps.scores,
          bestStars: ps.bestStars,
          adventureBestStars: ps.adventureBestStars,
          journeyBestStars: ps.journeyBestStars,
        }).catch(() => {});
      }

      const progress = await fetchProgress(userId);
      useProgressStore.getState().importProgress(JSON.stringify(progress));
      await useImportedSongsStore.getState().syncFromPi();
      set({ currentUser: user, loading: false });
      localStorage.setItem(LAST_USER_KEY, userId);
    } catch {
      set({ loading: false });
    }
  },

  createUser: async (name: string) => {
    const user = await apiCreateUser(name);
    set((s) => ({ users: [...s.users, user] }));
    return user;
  },

  deleteUser: async (userId: string) => {
    await apiDeleteUser(userId);
    set((s) => ({
      users: s.users.filter((u) => u.id !== userId),
      currentUser: s.currentUser?.id === userId ? null : s.currentUser,
    }));
    if (localStorage.getItem(LAST_USER_KEY) === userId) {
      localStorage.removeItem(LAST_USER_KEY);
    }
  },

  logout: () => {
    const { currentUser } = get();
    if (currentUser) {
      const ps = useProgressStore.getState();
      saveProgress(currentUser.id, {
        version: 3,
        scores: ps.scores,
        bestStars: ps.bestStars,
        adventureBestStars: ps.adventureBestStars,
        journeyBestStars: ps.journeyBestStars,
      }).catch(() => {});
    }
    set({ currentUser: null });
    localStorage.removeItem(LAST_USER_KEY);
  },
}));

export function getLastUserId(): string | null {
  return localStorage.getItem(LAST_USER_KEY);
}
