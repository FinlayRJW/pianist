import { useRef, useEffect, useState } from 'react';

interface Props {
  score: number;
  combo: number;
  lastRating: { rating: string; time: number } | null;
}

const RATING_COLORS: Record<string, string> = {
  perfect: 'text-hit-perfect',
  great: 'text-hit-great',
  good: 'text-hit-good',
  miss: 'text-hit-miss',
};

const RATING_LABELS: Record<string, string> = {
  perfect: 'PERFECT',
  great: 'GREAT',
  good: 'GOOD',
  miss: 'MISS',
};

export function ScoreOverlay({ score, combo, lastRating }: Props) {
  const [visibleRating, setVisibleRating] = useState<{ rating: string; key: number } | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (lastRating && lastRating.time !== lastTimeRef.current) {
      lastTimeRef.current = lastRating.time;
      setVisibleRating({ rating: lastRating.rating, key: lastRating.time });
      const timeout = setTimeout(() => setVisibleRating(null), 600);
      return () => clearTimeout(timeout);
    }
  }, [lastRating]);

  return (
    <div className="absolute top-4 left-0 right-0 pointer-events-none z-5 flex justify-between px-6">
      <div>
        <div className="text-white/80 text-2xl font-bold tabular-nums">
          {Math.round(score).toLocaleString()}
        </div>
        {combo > 1 && (
          <div className="text-accent-light text-sm font-medium">
            {combo}x combo
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-40">
        {visibleRating && (
          <div
            key={visibleRating.key}
            className={`text-2xl font-bold animate-rating ${RATING_COLORS[visibleRating.rating]}`}
          >
            {RATING_LABELS[visibleRating.rating]}
          </div>
        )}
      </div>
    </div>
  );
}
