import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ParsedSong } from '../../types';
import { getSongById } from '../../data/songs';
import { parseMidiFile } from '../../utils/midi-parser';
import { GameScreen } from './GameScreen';

export function PlayRoute() {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<ParsedSong | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!songId) return;
    const meta = getSongById(songId);
    if (!meta) {
      setError(`Song "${songId}" not found`);
      return;
    }

    const base = import.meta.env.BASE_URL;
    const url = `${base}${meta.midiFile}`;
    parseMidiFile(url, meta)
      .then(setSong)
      .catch((err) => setError(err.message));
  }, [songId]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/songs')}
            className="px-6 py-2 rounded-full bg-accent text-white"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white/50">Loading song...</div>
      </div>
    );
  }

  return <GameScreen song={song} onBack={() => navigate('/songs')} />;
}
