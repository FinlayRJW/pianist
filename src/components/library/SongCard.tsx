import type { SongMeta } from '../../types';

interface Props {
  song: SongMeta;
  bestStars?: number;
  onClick: () => void;
}

const DIFFICULTY_LABELS = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
const DIFFICULTY_COLORS = ['', 'text-emerald-400', 'text-green-400', 't-warning', 'text-orange-400', 'text-red-400'];

const GENRE_DISPLAY: Record<string, string> = {
  beginner: 'First Steps',
  folk: 'Folk',
  baroque: 'Baroque',
  classical: 'Classical',
  romantic: 'Romantic',
  impressionist: 'Impressionist',
  jazz: 'Jazz',
  advanced: 'Advanced',
  god: 'God Tier',
};

const GENRE_COLORS: Record<string, string> = {
  beginner: 'bg-cyan-500/15 text-cyan-400',
  folk: 'bg-emerald-500/15 text-emerald-400',
  baroque: 'bg-purple-500/15 text-purple-400',
  classical: 'bg-violet-500/15 text-violet-400',
  romantic: 'bg-pink-500/15 text-pink-400',
  impressionist: 'bg-sky-500/15 text-sky-400',
  jazz: 'bg-amber-500/15 text-amber-400',
  advanced: 'bg-yellow-500/15 text-yellow-400',
  god: 'bg-red-500/15 text-red-400',
};

export function SongCard({ song, bestStars = 0, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-light/50 hover:bg-surface-light border t-border hover:border-accent/30 rounded-xl p-5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="t-text font-medium text-base group-hover:text-accent-light transition-colors truncate">
              {song.title}
            </h3>
          </div>
          <p className="t-text-tertiary text-sm mt-0.5">{song.composer}</p>
        </div>
        <div className="flex gap-0.5 ml-3 mt-1">
          {[1, 2, 3].map((star) => (
            <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={bestStars >= star ? '#fbbf24' : 'none'} stroke={bestStars >= star ? '#fbbf24' : '#4b5563'} strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${GENRE_COLORS[song.genre] ?? 't-bg-overlay t-text-secondary'}`}>
          {GENRE_DISPLAY[song.genre] ?? song.genre}
        </span>
        <span className={`text-xs font-medium ${song.genre === 'god' ? 'text-red-400' : DIFFICULTY_COLORS[song.difficulty]}`}>
          {song.genre === 'god' ? 'Impossible' : DIFFICULTY_LABELS[song.difficulty]}
        </span>
        <span className="t-text-muted text-xs">&middot;</span>
        <span className="t-text-tertiary text-xs">{song.durationSec}s</span>
        <span className="t-text-muted text-xs">&middot;</span>
        <span className="t-text-tertiary text-xs">{song.bpm} BPM</span>
        {song.requiresMidi && (
          <>
            <span className="t-text-muted text-xs">&middot;</span>
            <span className="text-xs font-medium text-orange-400 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="14" rx="1" />
                <line x1="8" y1="6" x2="8" y2="16" />
                <line x1="12" y1="6" x2="12" y2="16" />
                <line x1="16" y1="6" x2="16" y2="16" />
              </svg>
              MIDI
            </span>
          </>
        )}
      </div>
    </button>
  );
}
