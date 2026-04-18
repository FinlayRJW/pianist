import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SKILL_TREE_AREAS, SKILL_TREE_NODES, getAreaNodes } from '../../data/skill-tree';
import { SONG_CATALOG } from '../../data/songs';
import { useProgressStore } from '../../stores/progressStore';
import { SkillTreeAreaColumn } from './SkillTreeArea';
import { NavigationTabs } from './NavigationTabs';
import { CalibrationModal } from '../onboarding/CalibrationModal';

const BG_STARS = Array.from({ length: 120 }, (_, i) => ({
  x: (Math.sin(i * 7.3 + 1.2) * 0.5 + 0.5) * 100,
  y: (Math.sin(i * 13.7 + 5.8) * 0.5 + 0.5) * 100,
  size: (Math.sin(i * 3.1) * 0.5 + 0.5) * 1.2 + 0.4,
  opacity: (Math.sin(i * 11.3) * 0.5 + 0.5) * 0.25 + 0.03,
}));

export function SkillTree() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const bestStars = useProgressStore((s) => s.bestStars);
  const unlockedNodes = useProgressStore((s) => s.unlockedNodes);
  const totalStarsFn = useProgressStore((s) => s.totalStars);
  const areaStarsFn = useProgressStore((s) => s.areaStars);

  const songMap = useMemo(() => {
    const map: Record<string, (typeof SONG_CATALOG)[number]> = {};
    for (const s of SONG_CATALOG) map[s.id] = s;
    return map;
  }, []);

  const sortedAreas = useMemo(
    () => [...SKILL_TREE_AREAS].sort((a, b) => a.order - b.order),
    [],
  );

  const currentTotalStars = totalStarsFn();

  const firstStepsStars = useMemo(
    () =>
      SKILL_TREE_NODES
        .filter((n) => n.areaId === 'beginner')
        .reduce((sum, n) => sum + (bestStars[n.songId] ?? 0), 0),
    [bestStars],
  );

  const handlePlay = (songId: string) => navigate(`/play/${songId}`);

  useEffect(() => {
    if (!scrollRef.current) return;
    const idx = sortedAreas.findIndex((area) => {
      if (area.id !== 'beginner' && firstStepsStars < area.starsToUnlock) return false;
      const nodes = getAreaNodes(area.id);
      return nodes.some(
        (n) => unlockedNodes.includes(n.id) && !(bestStars[n.songId] > 0),
      );
    });
    if (idx > 0) {
      const inner = scrollRef.current.firstElementChild;
      const target = inner?.children[idx] as HTMLElement | undefined;
      target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: 'var(--constellation-bg)' }}>
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BG_STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              backgroundColor: 'var(--constellation-star-dot)',
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 relative z-10">
        <NavigationTabs />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {currentTotalStars}
            </span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrolling constellation map */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative z-10"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}
      >
        <div className="flex items-start py-4 pb-12" style={{ gap: '4rem', paddingLeft: '30vw', paddingRight: '30vw' }}>
          {sortedAreas.map((area) => {
            const areaNodes = getAreaNodes(area.id);
            const maxStars = areaNodes.length * 3;
            const stars = areaStarsFn(area.id);
            const isUnlocked = area.id === 'beginner' || firstStepsStars >= area.starsToUnlock;

            return (
              <SkillTreeAreaColumn
                key={area.id}
                area={area}
                nodes={areaNodes}
                songs={songMap}
                bestStars={bestStars}
                unlockedNodes={unlockedNodes}
                isAreaUnlocked={isUnlocked}
                areaStars={stars}
                maxStars={maxStars}
                firstStepsStars={firstStepsStars}
                onPlay={handlePlay}
              />
            );
          })}
        </div>
      </div>

      {showSettings && <CalibrationModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
