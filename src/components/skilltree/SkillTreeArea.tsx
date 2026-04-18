import type { SkillTreeArea, SkillTreeNode, SongMeta } from '../../types';
import { SkillTreeNodeCircle, UNLOCKED_SIZE } from './SkillTreeNode';

interface Props {
  area: SkillTreeArea;
  nodes: SkillTreeNode[];
  songs: Record<string, SongMeta>;
  bestStars: Record<string, 0 | 1 | 2 | 3>;
  unlockedNodes: string[];
  isAreaUnlocked: boolean;
  areaStars: number;
  maxStars: number;
  firstStepsStars: number;
  onPlay: (songId: string) => void;
}

const NODE_BTN_W = 86;
const PAD = 60;

export function SkillTreeAreaColumn({
  area, nodes, songs, bestStars, unlockedNodes,
  isAreaUnlocked, areaStars, maxStars, firstStepsStars, onPlay,
}: Props) {
  if (nodes.length === 0) return null;

  const allX = nodes.map((n) => n.x);
  const allY = nodes.map((n) => n.y);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const svgW = maxX - minX + PAD * 2;
  const svgH = maxY - minY + PAD * 2;
  const containerW = Math.max(svgW, NODE_BTN_W * 3 + 20);
  const titleH = 52;
  const containerH = svgH + titleH;
  const ox = (containerW - svgW) / 2;

  const toLocal = (nx: number, ny: number) => ({
    lx: nx - minX + PAD + ox,
    ly: ny - minY + PAD + titleH,
  });

  const connections: { x1: number; y1: number; x2: number; y2: number; lit: boolean }[] = [];
  for (const node of nodes) {
    const to = toLocal(node.x, node.y);
    const toUnlocked = unlockedNodes.includes(node.id);
    for (const reqId of node.requires) {
      const from = nodes.find((n) => n.id === reqId);
      if (!from) continue;
      const fl = toLocal(from.x, from.y);
      const fromUnlocked = unlockedNodes.includes(from.id);
      connections.push({
        x1: fl.lx, y1: fl.ly,
        x2: to.lx, y2: to.ly,
        lit: fromUnlocked && toUnlocked,
      });
    }
  }

  const starsShort = Math.max(0, area.starsToUnlock - firstStepsStars);

  return (
    <div className="flex-shrink-0 relative" style={{ width: containerW, height: containerH }}>
      {/* Constellation title */}
      <div className="text-center" style={{ height: titleH, paddingTop: 8 }}>
        <h3
          className="text-xs font-semibold tracking-[0.2em] uppercase"
          style={{ color: isAreaUnlocked ? area.color : 'rgba(255,255,255,0.12)' }}
        >
          {area.name}
        </h3>
        {isAreaUnlocked ? (
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {areaStars} / {maxStars} ★
          </span>
        ) : (
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.1)' }}>
            {starsShort} more ★ in First Steps
          </span>
        )}
      </div>

      {/* Connection lines */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: 0, top: titleH }}
        width={containerW}
        height={svgH}
      >
        <defs>
          <filter id={`glow-${area.id}`}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {connections.map((c, i) => (
          <line
            key={i}
            x1={c.x1} y1={c.y1 - titleH} x2={c.x2} y2={c.y2 - titleH}
            stroke={c.lit ? area.color : 'rgba(255,255,255,0.04)'}
            strokeWidth={c.lit ? 1.5 : 0.5}
            opacity={c.lit ? 0.5 : 1}
            filter={c.lit ? `url(#glow-${area.id})` : undefined}
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const { lx, ly } = toLocal(node.x, node.y);
        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: lx - NODE_BTN_W / 2,
              top: ly - UNLOCKED_SIZE / 2,
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
        );
      })}
    </div>
  );
}
