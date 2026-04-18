import { useNavigate } from 'react-router-dom';
import { SONG_CATALOG } from '../../data/songs';
import { useProgressStore } from '../../stores/progressStore';
import { SongCard } from './SongCard';

export function SongLibrary() {
  const navigate = useNavigate();
  const bestStars = useProgressStore((s) => s.bestStars);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Song Library</h1>
          <p className="text-white/50 mt-2">Choose a song to practice</p>
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
    </div>
  );
}
