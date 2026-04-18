import type { SkillTreeArea, SkillTreeNode, SongMeta } from '../../types';
import { SkillTreeNodeCircle } from './SkillTreeNode';

interface Props {
  area: SkillTreeArea;
  nodes: SkillTreeNode[];
  songs: Record<string, SongMeta>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  unlockedNodes: string[];
  isAreaUnlocked: boolean;
  areaStars: number;
  maxStars: number;
  totalStars: number;
  onPlay: (songId: string) => void;
}

const COL_W = 110;
const ROW_H = 105;
const CIRCLE_CY = 22;

export function SkillTreeAreaColumn({
  area, nodes, songs, bestStars, unlockedNodes,
  isAreaUnlocked, areaStars, maxStars, totalStars, onPlay,
}: Props) {
  const maxX = Math.max(...nodes.map((n) => n.x), 0);
  const maxY = Math.max(...nodes.map((n) => n.y), 0);
  const gridW = (maxY + 1) * COL_W;
  const gridH = (maxX + 1) * ROW_H;

  const circleCx = (y: number) => y * COL_W + COL_W / 2;
  const circleCy = (x: number) => x * ROW_H + CIRCLE_CY;

  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const node of nodes) {
    const toCx = circleCx(node.y);
    const toCy = circleCy(node.x);
    for (const reqId of node.requires) {
      const from = nodes.find((n) => n.id === reqId);
      if (!from) continue;
      connections.push({
        x1: circleCx(from.y),
        y1: circleCy(from.x),
        x2: toCx,
        y2: toCy,
      });
    }
  }

  const starsShort = Math.max(0, area.starsToUnlock - totalStars);

  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden"
      style={{
        width: gridW + 48,
        backgroundColor: isAreaUnlocked ? 'var(--bg-overlay)' : 'rgba(255,255,255,0.015)',
        borderTop: `3px solid ${isAreaUnlocked ? area.color : '#374151'}`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: isAreaUnlocked ? area.color : '#4b5563' }}
          />
          <h3 className={`text-sm font-bold tracking-tight ${isAreaUnlocked ? 't-text' : 'text-gray-500'}`}>
            {area.name}
          </h3>
        </div>

        {isAreaUnlocked ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (areaStars / maxStars) * 100)}%`,
                  backgroundColor: area.color,
                }}
              />
            </div>
            <span className="text-[10px] t-text-tertiary whitespace-nowrap">
              {areaStars}/{maxStars} ★
            </span>
          </div>
        ) : (
          <p className="text-[10px] text-gray-600">
            Need {starsShort} more ★
          </p>
        )}
      </div>

      {/* Node grid — x maps to rows (top→bottom), y maps to columns (left→right) */}
      <div className="relative px-6 pb-5" style={{ height: gridH }}>
        <svg
          className="absolute pointer-events-none"
          style={{ left: 24, top: 0 }}
          width={gridW}
          height={gridH}
        >
          {connections.map((c, i) => (
            <line
              key={i}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={isAreaUnlocked ? `${area.color}33` : 'rgba(255,255,255,0.04)'}
              strokeWidth={2}
              strokeDasharray={isAreaUnlocked ? undefined : '4 4'}
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.y * COL_W + (COL_W - 76) / 2,
              top: node.x * ROW_H,
            }}
          >
            <SkillTreeNodeCircle
              node={node}
              song={songs[node.songId]}
              bestStars={(bestStars[node.songId] ?? 0) as 0 | 1 | 2 | 3}
              isUnlocked={unlockedNodes.includes(node.id)}
              areaColor={area.color}
              onPlay={onPlay}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
