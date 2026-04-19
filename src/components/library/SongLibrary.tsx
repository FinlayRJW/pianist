import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SONG_CATALOG } from '../../data/songs';
import { useProgressStore } from '../../stores/progressStore';
import { useImportedSongsStore } from '../../stores/importedSongsStore';
import { SongCard } from './SongCard';
import { MidiImport } from './MidiImport';
import { CalibrationModal } from '../onboarding/CalibrationModal';
import { NavigationTabs } from '../skilltree/NavigationTabs';
import { JourneyProgressBar } from '../journey/JourneyProgressBar';
import { countCompletedSteps } from '../../data/journey';
import type { SongGenre, SongMeta } from '../../types';

const GENRES: { value: SongGenre | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'baroque', label: 'Baroque' },
  { value: 'classical', label: 'Classical' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'impressionist', label: 'Impressionist' },
  { value: 'jazz', label: 'Jazz' },
];

type SortKey = 'difficulty' | 'name' | 'stars';

export function SongLibrary() {
  const navigate = useNavigate();
  const bestStars = useProgressStore((s) => s.bestStars);
  const freePlayUnlocked = useProgressStore((s) => s.freePlayUnlocked);
  const journeyStars = useProgressStore((s) => s.journeyBestStars);
  const importedSongs = useImportedSongsStore((s) => s.songs);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [genre, setGenre] = useState<SongGenre | 'all'>('all');
  const [difficulty, setDifficulty] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('difficulty');

  const applyFilters = useCallback((songs: SongMeta[]) => {
    let result = [...songs];
    if (genre !== 'all') result = result.filter((s) => (s.genres ?? [s.genre]).includes(genre));
    if (difficulty > 0) result = result.filter((s) => s.difficulty === difficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.composer.toLowerCase().includes(q),
      );
    }
    result.sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title);
      if (sort === 'stars') return (bestStars[b.id] ?? 0) - (bestStars[a.id] ?? 0);
      return a.difficulty - b.difficulty;
    });
    return result;
  }, [genre, difficulty, search, sort, bestStars]);

  const filteredImported = useMemo(
    () => applyFilters(importedSongs),
    [applyFilters, importedSongs],
  );
  const filteredCatalog = useMemo(
    () => applyFilters(SONG_CATALOG),
    [applyFilters],
  );

  if (!freePlayUnlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative px-6">
        <div className="max-w-sm text-center">
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="mx-auto mb-4">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Free Play Locked
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Complete the First Notes chapter to unlock the full song library.
            </p>
          </div>
          <div className="mb-6">
            <JourneyProgressBar completed={countCompletedSteps(journeyStars)} />
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-accent text-white font-medium hover:bg-accent-light transition-colors"
          >
            Back to Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative" style={{ background: 'var(--constellation-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <NavigationTabs />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowImport(true)}
              className="p-2 rounded-full t-bg-overlay t-text-tertiary t-bg-overlay-hover transition-colors"
              title="Import MIDI"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
            <button
              onClick={() => setShowCalibration(true)}
              className="p-2 rounded-full t-bg-overlay t-text-tertiary t-bg-overlay-hover transition-colors"
              title="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {GENRES.map((g) => (
              <button
                key={g.value}
                onClick={() => setGenre(g.value)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  genre === g.value
                    ? 'bg-accent text-white'
                    : 't-bg-overlay t-text-secondary hover:t-text'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 t-text-muted"
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search songs..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg t-bg-overlay t-text text-sm outline-none focus:ring-1 focus:ring-accent/50"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-1.5 rounded-lg t-bg-overlay text-sm outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-overlay)' }}
            >
              <option value="difficulty">Difficulty</option>
              <option value="name">Name</option>
              <option value="stars">Stars</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs t-text-tertiary">Difficulty:</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-0.5 rounded text-xs transition-all ${
                    difficulty === d ? 'bg-accent text-white' : 't-bg-overlay t-text-secondary'
                  }`}
                >
                  {d === 0 ? 'All' : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs t-text-muted mb-3">{filteredImported.length + filteredCatalog.length} songs</p>

        <div className="grid gap-3 pb-8">
          {filteredImported.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium t-text-secondary">Your Songs</span>
                <span className="text-[10px] t-text-muted">({filteredImported.length})</span>
                <div className="flex-1 h-px t-bg-overlay" />
              </div>
              {filteredImported.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  bestStars={bestStars[song.id] || 0}
                  onClick={() => navigate(`/play/${song.id}`, { state: { from: '/songs' } })}
                />
              ))}
            </>
          )}
          {filteredImported.length > 0 && filteredCatalog.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium t-text-secondary">Catalogue</span>
              <span className="text-[10px] t-text-muted">({filteredCatalog.length})</span>
              <div className="flex-1 h-px t-bg-overlay" />
            </div>
          )}
          {filteredCatalog.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              bestStars={bestStars[song.id] || 0}
              onClick={() => navigate(`/play/${song.id}`, { state: { from: '/songs' } })}
            />
          ))}
          {filteredImported.length === 0 && filteredCatalog.length === 0 && (
            <p className="text-center t-text-tertiary py-12 text-sm">No songs match your filters</p>
          )}
        </div>
      </div>
      {showCalibration && (
        <CalibrationModal onClose={() => setShowCalibration(false)} />
      )}
      {showImport && (
        <MidiImport
          onClose={() => setShowImport(false)}
          onImported={(songId) => {
            setShowImport(false);
            navigate(`/play/${songId}`, { state: { from: '/songs' } });
          }}
        />
      )}
    </div>
  );
}
