import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SongMeta } from '../types';
import {
  uploadSong as apiUploadSong,
  deleteSong as apiDeleteSong,
  fetchSongs as apiFetchSongs,
  fetchMidiData as apiFetchMidiData,
} from '../services/piApi';

const DB_NAME = 'pianist-imported';
const STORE_NAME = 'midi-files';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveMidiData(songId: string, data: ArrayBuffer): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, songId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadMidiData(songId: string): Promise<ArrayBuffer | null> {
  if (isPiConnected()) {
    try {
      return await apiFetchMidiData(songId);
    } catch {
      // fall through to local
    }
  }
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(songId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteMidiData(songId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(songId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function isPiConnected(): boolean {
  try {
    const { useUserStore } = require('./userStore');
    return useUserStore.getState().piConnected;
  } catch {
    return false;
  }
}

interface ImportedSongsStore {
  songs: SongMeta[];
  addSong: (meta: SongMeta, midiData: ArrayBuffer) => Promise<void>;
  removeSong: (songId: string) => Promise<void>;
  syncFromPi: () => Promise<void>;
}

export const useImportedSongsStore = create<ImportedSongsStore>()(
  persist(
    (set) => ({
      songs: [],

      addSong: async (meta, midiData) => {
        await saveMidiData(meta.id, midiData);
        if (isPiConnected()) {
          try {
            await apiUploadSong(meta, midiData);
          } catch {
            // local-only is fine
          }
        }
        set((state) => ({
          songs: [...state.songs.filter((s) => s.id !== meta.id), meta],
        }));
      },

      removeSong: async (songId) => {
        await deleteMidiData(songId);
        if (isPiConnected()) {
          try {
            await apiDeleteSong(songId);
          } catch {
            // local-only removal
          }
        }
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== songId),
        }));
      },

      syncFromPi: async () => {
        if (!isPiConnected()) return;
        try {
          const piSongs = await apiFetchSongs();
          set({ songs: piSongs });
        } catch {
          // keep local state
        }
      },
    }),
    {
      name: 'pianist-imported-songs',
      partialize: (state) => ({ songs: state.songs }),
    },
  ),
);
