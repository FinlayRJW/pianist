import { useState } from 'react';
import type { SongMeta } from '../../types';

interface Props {
  song: SongMeta;
  songStars: 0 | 1 | 2 | 3;
  isUnlocked: boolean;
  isCurrent: boolean;
  isComplete: boolean;
  chapterColor: string;
  onPlay: () => void;
}

const UNLOCKED_SIZE = 44;
const LOCKED_SIZE = 24;

export function JourneyNode({ song, songStars, isUnlocked, isCurrent, isComplete, chapterColor, onPlay }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const size = isUnlocked ? UNLOCKED_SIZE : LOCKED_SIZE;
  const isPlayable = isUnlocked;

  return (
    <button
      onClick={() => {
        if (isPlayable) {
          onPlay();
        } else {
          setShowTooltip((v) => !v);
        }
      }}
      onMouseEnter={() => !isPlayable && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative flex flex-col items-center transition-transform duration-200 ${
        isPlayable ? 'cursor-pointer hover:scale-110' : 'cursor-help'
      }`}
      style={{ width: 100 }}
    >
      <div
        className={isCurrent ? 'animate-node-glow' : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.4s ease',
          ...(isUnlocked
            ? {
                background: `radial-gradient(circle at 38% 32%, var(--constellation-node-highlight), ${chapterColor} 65%)`,
                boxShadow: isComplete
                  ? `0 0 6px rgba(255,255,255,0.4), 0 0 16px ${chapterColor}aa, 0 0 40px ${chapterColor}55, 0 0 70px ${chapterColor}22`
                  : `0 0 4px rgba(255,255,255,0.2), 0 0 12px ${chapterColor}66, 0 0 30px ${chapterColor}33`,
              }
            : {
                background: 'var(--constellation-locked-node-bg)',
                boxShadow: '0 0 3px var(--constellation-locked-node-shadow)',
              }),
        }}
      >
        {isUnlocked && (
          <span
            className="text-[11px] font-bold"
            style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {song.difficulty}
          </span>
        )}
      </div>

      {isUnlocked && (
        <div className="flex gap-px mt-1.5">
          {[1, 2, 3].map((star) => (
            <svg
              key={star}
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill={songStars >= star ? '#fbbf24' : 'none'}
              stroke={songStars >= star ? '#fbbf24' : 'var(--constellation-star-stroke)'}
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      )}

      {!isUnlocked && (
        <span
          className="text-center leading-tight line-clamp-2 mt-1"
          style={{
            fontSize: '9px',
            color: 'var(--constellation-song-title-locked)',
            transition: 'color 0.3s',
          }}
        >
          {song.title}
        </span>
      )}

      {!isPlayable && showTooltip && (
        <div
          className="absolute z-50 px-3 py-2 rounded-lg text-xs leading-relaxed whitespace-nowrap pointer-events-none"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div className="font-medium" style={{ color: chapterColor }}>{song.title}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Complete the previous step first</div>
        </div>
      )}
    </button>
  );
}
