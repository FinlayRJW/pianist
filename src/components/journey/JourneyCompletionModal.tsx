import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
  onFreePlay: () => void;
}

export function JourneyCompletionModal({ onClose, onFreePlay }: Props) {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#22d3ee', '#c084fc', '#f472b6', '#fbbf24', '#34d399', '#a78bfa'];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[i % colors.length],
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full animate-confettiDrift"
            style={{
              left: `${p.x}%`,
              top: '-8px',
              background: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="t-bg-modal rounded-2xl p-8 text-center shadow-2xl border t-border-light max-w-sm mx-4 animate-scaleIn relative">
        <div className="text-5xl mb-4 animate-celebrateGlow inline-block">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: '#fbbf24' }}>
          Journey Complete!
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
          From first notes to Moonlight Sonata
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
          You&apos;ve mastered every step of the journey. Keep playing!
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onFreePlay}
            className="px-6 py-2.5 rounded-full font-medium transition-all hover:scale-105"
            style={{ background: '#fbbf24', color: 'rgba(0,0,0,0.8)' }}
          >
            Free Play
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-medium t-bg-overlay t-text t-bg-overlay-hover transition-colors"
          >
            Stay
          </button>
        </div>
      </div>
    </div>
  );
}
