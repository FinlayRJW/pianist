import { useState } from 'react';
import type { SkillTreeNode, SongMeta } from '../../types';

interface Props {
  node: SkillTreeNode;
  song: SongMeta | undefined;
  songs: Record<string, SongMeta>;
  bestStars: 0 | 1 | 2 | 3;
  isUnlocked: boolean;
  isAreaUnlocked: boolean;
  areaColor: string;
  onPlay: (songId: string) => void;
}

export const UNLOCKED_SIZE = 40;
export const LOCKED_SIZE = 22;

export function SkillTreeNodeCircle({ node, song, songs, bestStars, isUnlocked, isAreaUnlocked, areaColor, onPlay }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  if (!song) return null;
  const hasStars = bestStars > 0;
  const isPlayable = isUnlocked;
  const size = isUnlocked ? UNLOCKED_SIZE : LOCKED_SIZE;

  const reqSong = node.requires.length > 0 ? songs[node.requires[0]] : undefined;

  return (
    <button
      onClick={() => {
        if (isPlayable) {
          onPlay(node.songId);
        } else {
          setShowTooltip((prev) => !prev);
        }
      }}
      onMouseEnter={() => !isPlayable && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative flex flex-col items-center transition-transform duration-200 ${
        isPlayable ? 'cursor-pointer hover:scale-110' : 'cursor-help'
      }`}
      style={{ width: 86 }}
    >
      <div
        className={isUnlocked && !hasStars ? 'animate-node-glow' : undefined}
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
                background: `radial-gradient(circle at 38% 32%, var(--constellation-node-highlight), ${areaColor} 65%)`,
                boxShadow: hasStars
                  ? `0 0 6px rgba(255,255,255,0.4), 0 0 16px ${areaColor}aa, 0 0 40px ${areaColor}55, 0 0 70px ${areaColor}22`
                  : `0 0 4px rgba(255,255,255,0.2), 0 0 12px ${areaColor}66, 0 0 30px ${areaColor}33`,
              }
            : {
                background: 'var(--constellation-locked-node-bg)',
                boxShadow: `0 0 3px var(--constellation-locked-node-shadow)`,
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
              fill={bestStars >= star ? '#fbbf24' : 'none'}
              stroke={bestStars >= star ? '#fbbf24' : 'var(--constellation-star-stroke)'}
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      )}

      <span
        className="text-center leading-tight line-clamp-2 mt-1"
        style={{
          fontSize: '9px',
          color: isUnlocked ? 'var(--constellation-song-title)' : 'var(--constellation-song-title-locked)',
          transition: 'color 0.3s',
        }}
      >
        {song.title}
      </span>

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
          <div className="font-medium" style={{ color: areaColor }}>{song.title}</div>
          {!isAreaUnlocked ? (
            <div style={{ color: 'var(--text-secondary)' }}>Unlock this constellation first</div>
          ) : reqSong ? (
            <div style={{ color: 'var(--text-secondary)' }}>
              Earn {node.starsRequired}+ star{node.starsRequired !== 1 ? 's' : ''} on{' '}
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{reqSong.title}</span>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>Complete prerequisite songs</div>
          )}
        </div>
      )}
    </button>
  );
}
