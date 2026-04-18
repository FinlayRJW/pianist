import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SONG_CATALOG } from '../../data/songs';
import { useProgressStore } from '../../stores/progressStore';
import { SongCard } from './SongCard';
import { CalibrationModal } from '../onboarding/CalibrationModal';

export function SongLibrary() {
  const navigate = useNavigate();
  const bestStars = useProgressStore((s) => s.bestStars);
  const [showCalibration, setShowCalibration] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold t-text tracking-tight">Song Library</h1>
            <p className="t-text-secondary mt-2">Choose a song to practice</p>
          </div>
          <button
            onClick={() => setShowCalibration(true)}
            className="p-2 rounded-full t-bg-overlay t-text-tertiary t-bg-overlay-hover transition-colors mt-1"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <div className="grid gap-3">
          {SONG_CATALOG.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              bestStars={bestStars[song.id] || 0}
              onClick={() => navigate(`/play/${song.id}`)}
            />
          ))}
        </div>
      </div>
      {showCalibration && (
        <CalibrationModal onClose={() => setShowCalibration(false)} />
      )}
    </div>
  );
}
