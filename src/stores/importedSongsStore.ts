import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SongMeta } from '../types';

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

interface ImportedSongsStore {
  songs: SongMeta[];
  addSong: (meta: SongMeta, midiData: ArrayBuffer) => Promise<void>;
  removeSong: (songId: string) => Promise<void>;
}

export const useImportedSongsStore = create<ImportedSongsStore>()(
  persist(
    (set) => ({
      songs: [],

      addSong: async (meta, midiData) => {
        await saveMidiData(meta.id, midiData);
        set((state) => ({
          songs: [...state.songs.filter((s) => s.id !== meta.id), meta],
        }));
      },

      removeSong: async (songId) => {
        await deleteMidiData(songId);
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== songId),
        }));
      },
    }),
    {
      name: 'pianist-imported-songs',
      partialize: (state) => ({ songs: state.songs }),
    },
  ),
);
