import type { SkillTreeNode, SongMeta } from '../../types';

interface Props {
  node: SkillTreeNode;
  song: SongMeta | undefined;
  bestStars: 0 | 1 | 2 | 3;
  isUnlocked: boolean;
  areaColor: string;
  onPlay: (songId: string) => void;
}

export const UNLOCKED_SIZE = 40;
export const LOCKED_SIZE = 10;

export function SkillTreeNodeCircle({ node, song, bestStars, isUnlocked, areaColor, onPlay }: Props) {
  if (!song) return null;
  const hasStars = bestStars > 0;
  const size = isUnlocked ? UNLOCKED_SIZE : LOCKED_SIZE;

  return (
    <button
      onClick={() => isUnlocked && onPlay(node.songId)}
      disabled={!isUnlocked}
      className={`flex flex-col items-center transition-transform duration-200 ${
        isUnlocked ? 'cursor-pointer hover:scale-110' : 'cursor-default'
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
                background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.85), ${areaColor} 65%)`,
                boxShadow: hasStars
                  ? `0 0 6px rgba(255,255,255,0.4), 0 0 16px ${areaColor}aa, 0 0 40px ${areaColor}55, 0 0 70px ${areaColor}22`
                  : `0 0 4px rgba(255,255,255,0.2), 0 0 12px ${areaColor}66, 0 0 30px ${areaColor}33`,
              }
            : {
                background: 'rgba(255,255,255,0.07)',
                boxShadow: '0 0 3px rgba(255,255,255,0.04)',
              }),
        }}
      >
        {isUnlocked && (
          <span
            className="text-[11px] font-bold"
            style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
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
              stroke={bestStars >= star ? '#fbbf24' : 'rgba(255,255,255,0.12)'}
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
          color: isUnlocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.08)',
          transition: 'color 0.3s',
        }}
      >
        {song.title}
      </span>
    </button>
  );
}
