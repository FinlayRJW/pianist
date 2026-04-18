import type { SongScore } from '../../types';

interface Props {
  results: SongScore;
  onRetry: () => void;
  onBack: () => void;
}

function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={filled ? color : '#4b5563'} strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const STAR_COLORS = ['', '#d97706', '#94a3b8', '#fbbf24'];

export function ResultsModal({ results, onRetry, onBack }: Props) {
  const { stars, accuracy, hits, maxCombo } = results;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
      <div className="t-bg-modal rounded-2xl p-8 text-center shadow-2xl border t-border-light min-w-[320px]">
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <StarIcon key={s} filled={stars >= s} color={STAR_COLORS[stars] || '#fbbf24'} />
          ))}
        </div>

        <h2 className="text-2xl font-bold t-text mb-1">
          {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great Job!' : stars === 1 ? 'Nice Try!' : 'Keep Practicing!'}
        </h2>
        <p className="t-text-secondary text-sm mb-6">{Math.round(accuracy * 100)}% accuracy</p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
          <div className="text-right text-hit-perfect">Perfect</div>
          <div className="text-left t-text-secondary">{hits.perfect}</div>
          <div className="text-right text-hit-great">Great</div>
          <div className="text-left t-text-secondary">{hits.great}</div>
          <div className="text-right text-hit-good">Good</div>
          <div className="text-left t-text-secondary">{hits.good}</div>
          <div className="text-right text-hit-miss">Miss</div>
          <div className="text-left t-text-secondary">{hits.miss}</div>
          <div className="text-right t-text-tertiary">Max Combo</div>
          <div className="text-left t-text-secondary">{maxCombo}</div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-full bg-accent text-white font-medium hover:bg-accent-light transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-full t-bg-overlay t-text font-medium t-bg-overlay-hover transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
