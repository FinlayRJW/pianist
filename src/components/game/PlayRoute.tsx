import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ParsedSong } from '../../types';
import { getSongById } from '../../data/songs';
import { useImportedSongsStore, loadMidiData } from '../../stores/importedSongsStore';
import { parseMidiFile } from '../../utils/midi-parser';
import { GameScreen } from './GameScreen';

export function PlayRoute() {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<ParsedSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  const importedSongs = useImportedSongsStore((s) => s.songs);

  useEffect(() => {
    if (!songId) return;

    const meta = getSongById(songId) ?? importedSongs.find((s) => s.id === songId);
    if (!meta) {
      setError(`Song "${songId}" not found`);
      return;
    }

    if (meta.source === 'imported') {
      loadMidiData(songId)
        .then((data) => {
          if (!data) throw new Error('MIDI data not found in storage');
          return parseMidiFile(data, meta);
        })
        .then(setSong)
        .catch((err) => setError(err.message));
    } else {
      const base = import.meta.env.BASE_URL;
      const url = `${base}${meta.midiFile}`;
      parseMidiFile(url, meta)
        .then(setSong)
        .catch((err) => setError(err.message));
    }
  }, [songId, importedSongs]);

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
        <div className="t-text-secondary">Loading song...</div>
      </div>
    );
  }

  return <GameScreen song={song} onBack={() => navigate('/songs')} />;
}
