import type { SongMeta } from '../../types';

interface Props {
  song: SongMeta;
  bestStars?: number;
  onClick: () => void;
  onDelete?: () => void;
}

const DIFFICULTY_LABELS = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
const DIFFICULTY_COLORS = ['', 'text-emerald-400', 'text-green-400', 't-warning', 'text-orange-400', 'text-red-400'];

const GENRE_DISPLAY: Record<string, string> = {
  baroque: 'Baroque',
  classical: 'Classical',
  romantic: 'Romantic',
  impressionist: 'Impressionist',
  jazz: 'Jazz',
};

const GENRE_COLORS: Record<string, string> = {
  baroque: 'bg-purple-500/15 text-purple-400',
  classical: 'bg-violet-500/15 text-violet-400',
  romantic: 'bg-pink-500/15 text-pink-400',
  impressionist: 'bg-sky-500/15 text-sky-400',
  jazz: 'bg-amber-500/15 text-amber-400',
};

export function SongCard({ song, bestStars = 0, onClick, onDelete }: Props) {
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
        <div className="flex items-center gap-2 ml-3 mt-1">
          {onDelete && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
              title="Remove song"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </span>
          )}
          <div className="flex gap-0.5">
            {[1, 2, 3].map((star) => (
              <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={bestStars >= star ? '#fbbf24' : 'none'} stroke={bestStars >= star ? '#fbbf24' : '#4b5563'} strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {(song.genres ?? [song.genre]).map((g) => (
          <span key={g} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${GENRE_COLORS[g] ?? 't-bg-overlay t-text-secondary'}`}>
            {GENRE_DISPLAY[g] ?? g}
          </span>
        ))}
        <span className={`text-xs font-medium ${DIFFICULTY_COLORS[song.difficulty]}`}>
          {DIFFICULTY_LABELS[song.difficulty]}
        </span>
        <span className="t-text-muted text-xs">&middot;</span>
        <span className="t-text-tertiary text-xs">{song.durationSec}s</span>
        <span className="t-text-muted text-xs">&middot;</span>
        <span className="t-text-tertiary text-xs">{song.bpm} BPM</span>
      </div>
    </button>
  );
}
