import { TOTAL_JOURNEY_STEPS } from '../../data/journey';

interface Props {
  completed: number;
}

export function JourneyProgressBar({ completed }: Props) {
  const pct = (completed / TOTAL_JOURNEY_STEPS) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #22d3ee, #c084fc, #f472b6, #fbbf24)',
          }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {completed} / {TOTAL_JOURNEY_STEPS}
      </span>
    </div>
  );
}
