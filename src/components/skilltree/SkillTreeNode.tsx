import type { SkillTreeNode, SongMeta } from '../../types';

interface Props {
  node: SkillTreeNode;
  song: SongMeta | undefined;
  bestStars: 0 | 1 | 2 | 3;
  isUnlocked: boolean;
  areaColor: string;
  onPlay: (songId: string) => void;
}

export function SkillTreeNodeCircle({ node, song, bestStars, isUnlocked, areaColor, onPlay }: Props) {
  if (!song) return null;

  const hasStars = bestStars > 0;

  return (
    <button
      onClick={() => isUnlocked && onPlay(node.songId)}
      disabled={!isUnlocked}
      className={`flex flex-col items-center gap-1.5 w-[76px] transition-transform duration-200 ${
        isUnlocked ? 'cursor-pointer hover:scale-105' : 'cursor-default'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
          !isUnlocked
            ? 'bg-gray-800/60 border border-gray-700/40'
            : hasStars
              ? 'border-2 border-white/20'
              : 'border-2 border-white/10 animate-node-glow'
        }`}
        style={isUnlocked ? {
          backgroundColor: areaColor,
          boxShadow: hasStars
            ? `0 0 20px ${areaColor}55, 0 2px 8px ${areaColor}33`
            : `0 0 10px ${areaColor}33`,
        } : undefined}
      >
        {!isUnlocked ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-600">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : song.requiresMidi ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <line x1="6" y1="7" x2="6" y2="17" />
            <line x1="10" y1="7" x2="10" y2="17" />
            <line x1="14" y1="7" x2="14" y2="17" />
            <line x1="18" y1="7" x2="18" y2="17" />
          </svg>
        ) : (
          <span className="text-white text-xs font-bold drop-shadow-sm">
            {song.difficulty}
          </span>
        )}
      </div>

      <div className="flex gap-px">
        {[1, 2, 3].map((star) => (
          <svg
            key={star}
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill={bestStars >= star ? '#fbbf24' : 'none'}
            stroke={isUnlocked ? (bestStars >= star ? '#fbbf24' : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.06)'}
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <span className={`text-[10px] leading-tight text-center line-clamp-2 transition-colors ${
        isUnlocked ? 't-text-secondary' : 'text-gray-700'
      }`}>
        {song.title}
      </span>
    </button>
  );
}
