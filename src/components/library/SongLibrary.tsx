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
            <h1 className="text-3xl font-bold text-white tracking-tight">Song Library</h1>
            <p className="text-white/50 mt-2">Choose a song to practice</p>
          </div>
          <button
            onClick={() => setShowCalibration(true)}
            className="p-2 rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors mt-1"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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
