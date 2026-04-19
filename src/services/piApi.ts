import type { SongMeta } from '../types';
import { useOnboardingStore } from '../stores/onboardingStore';

export interface PiUser {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProgressData {
  version: number;
  scores: Record<string, unknown[]>;
  bestStars: Record<string, number>;
  adventureBestStars: Record<string, number>;
  journeyBestStars: Record<string, number>;
  onboardingCompleted?: boolean;
  exportedAt?: string;
}

function getApiBase(): string | null {
  const wsUrl = useOnboardingStore.getState().midiBridgeUrl;
  if (wsUrl) {
    return wsUrl.replace(/^ws(s?):\/\//, 'http$1://').replace(/\/?$/, '') + '/api';
  }
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `${window.location.origin}/api`;
  }
  return null;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBase();
  if (!base) throw new Error('Pi not configured');
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || res.statusText);
  }
  return res;
}

// ── Users ──

export async function fetchUsers(): Promise<PiUser[]> {
  const res = await apiFetch('/users');
  return res.json();
}

export async function createUser(name: string): Promise<PiUser> {
  const res = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch(`/users/${id}`, { method: 'DELETE' });
}

// ── Progress ──

export async function fetchProgress(userId: string): Promise<ProgressData> {
  const res = await apiFetch(`/users/${userId}/progress`);
  return res.json();
}

export async function saveProgress(userId: string, data: ProgressData): Promise<void> {
  await apiFetch(`/users/${userId}/progress`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Settings ──

export interface UserSettings {
  theme?: 'dark' | 'light';
  viewMode?: 'waterfall' | 'sheet' | 'combined';
  octaveEquivalence?: boolean;
  autoPlaySound?: boolean;
}

export async function fetchSettings(userId: string): Promise<UserSettings> {
  const res = await apiFetch(`/users/${userId}/settings`);
  return res.json();
}

export async function saveSettings(userId: string, data: UserSettings): Promise<void> {
  await apiFetch(`/users/${userId}/settings`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Songs ──

export async function fetchSongs(): Promise<SongMeta[]> {
  const res = await apiFetch('/songs');
  return res.json();
}

export async function uploadSong(meta: SongMeta, midiData: ArrayBuffer): Promise<SongMeta> {
  const midi = btoa(
    new Uint8Array(midiData).reduce((s, b) => s + String.fromCharCode(b), ''),
  );
  const res = await apiFetch('/songs', {
    method: 'POST',
    body: JSON.stringify({ meta, midi }),
  });
  return res.json();
}

export async function deleteSong(songId: string): Promise<void> {
  await apiFetch(`/songs/${songId}`, { method: 'DELETE' });
}

export async function fetchMidiData(songId: string): Promise<ArrayBuffer> {
  const base = getApiBase();
  if (!base) throw new Error('Pi not configured');
  const res = await fetch(`${base}/songs/${songId}/midi`);
  if (!res.ok) throw new Error('MIDI file not found');
  return res.arrayBuffer();
}

export async function checkPiReachable(): Promise<boolean> {
  try {
    const base = getApiBase();
    if (!base) return false;
    const res = await fetch(`${base}/users`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
