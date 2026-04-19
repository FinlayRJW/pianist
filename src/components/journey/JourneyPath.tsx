import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { JOURNEY_CHAPTERS, JOURNEY_STEPS, getChapterSteps, getChapterProgress, isStepUnlocked, isStepComplete, countCompletedSteps, isJourneyComplete, getNextIncompleteStep } from '../../data/journey';
import { SONG_CATALOG } from '../../data/songs';
import { useProgressStore } from '../../stores/progressStore';
import { NavigationTabs } from '../skilltree/NavigationTabs';
import { CalibrationModal } from '../onboarding/CalibrationModal';
import { JourneyNode } from './JourneyNode';
import { JourneyProgressBar } from './JourneyProgressBar';
import { JourneyCompletionModal } from './JourneyCompletionModal';
import type { JourneyChapter, JourneyStep } from '../../types';

const BG_STARS = Array.from({ length: 100 }, (_, i) => ({
  x: (Math.sin(i * 7.3 + 1.2) * 0.5 + 0.5) * 100,
  y: (Math.sin(i * 13.7 + 5.8) * 0.5 + 0.5) * 100,
  size: (Math.sin(i * 3.1) * 0.5 + 0.5) * 1.2 + 0.4,
  opacity: (Math.sin(i * 11.3) * 0.5 + 0.5) * 0.2 + 0.03,
}));

const STEP_SPACING_X = 240;
const CHAPTER_GAP_X = 100;
const SWING_Y = 60;
const NODE_BTN_W = 100;
const BRANCH_OFFSET_Y = 70;
const DESC_W = 200;

interface NodePos {
  step: JourneyStep;
  chapter: JourneyChapter;
  x: number;
  y: number;
  branchY?: [number, number];
}

function computeLayout(centerY: number): { nodes: NodePos[]; chapterLabels: { chapter: JourneyChapter; x: number; width: number }[]; totalWidth: number } {
  const nodes: NodePos[] = [];
  const chapterLabels: { chapter: JourneyChapter; x: number; width: number }[] = [];
  let x = 140;

  for (const chapter of JOURNEY_CHAPTERS) {
    const steps = getChapterSteps(chapter.id);
    if (steps.length === 0) continue;

    const chapterStartX = x;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const globalIdx = JOURNEY_STEPS.indexOf(step);
      const dy = Math.sin(globalIdx * 1.8 + chapter.number * 0.7) * SWING_Y;

      if (step.type === 'branch') {
        const by1 = centerY + dy * 0.3 - BRANCH_OFFSET_Y;
        const by2 = centerY + dy * 0.3 + BRANCH_OFFSET_Y;
        nodes.push({ step, chapter, x, y: centerY + dy * 0.3, branchY: [by1, by2] });
      } else {
        nodes.push({ step, chapter, x, y: centerY + dy });
      }
      x += STEP_SPACING_X;
    }

    const chapterEndX = x - STEP_SPACING_X;
    const chapterMidX = (chapterStartX + chapterEndX) / 2;
    chapterLabels.push({ chapter, x: chapterMidX, width: chapterEndX - chapterStartX });

    x += CHAPTER_GAP_X;
  }

  return { nodes, chapterLabels, totalWidth: x + 80 };
}

export function JourneyPath() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentStepRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [containerH, setContainerH] = useState(600);

  const journeyStars = useProgressStore((s) => s.journeyBestStars);
  const freePlayUnlocked = useProgressStore((s) => s.freePlayUnlocked);
  const [showFreePlayToast, setShowFreePlayToast] = useState(false);
  const prevFreePlayRef = useRef(freePlayUnlocked);

  useEffect(() => {
    if (freePlayUnlocked && !prevFreePlayRef.current) {
      setShowFreePlayToast(true);
      const timer = setTimeout(() => setShowFreePlayToast(false), 5000);
      return () => clearTimeout(timer);
    }
    prevFreePlayRef.current = freePlayUnlocked;
  }, [freePlayUnlocked]);

  const measureRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    scrollRef.current = el;
    const ro = new ResizeObserver(([entry]) => {
      setContainerH(entry.contentRect.height);
    });
    ro.observe(el);
    setContainerH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const songMap = useMemo(() => {
    const map: Record<string, (typeof SONG_CATALOG)[number]> = {};
    for (const s of SONG_CATALOG) map[s.id] = s;
    return map;
  }, []);

  const centerY = containerH / 2;
  const layout = useMemo(() => computeLayout(centerY), [centerY]);
  const completed = countCompletedSteps(journeyStars);
  const nextStep = getNextIncompleteStep(journeyStars);
  const allDone = isJourneyComplete(journeyStars);

  useEffect(() => {
    const timer = setTimeout(() => {
      currentStepRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = (songId: string) => {
    navigate(`/play/${songId}`, { state: { from: '/', journeyMode: true } });
  };

  const connections = useMemo(() => {
    const paths: { d: string; lit: boolean; color: string; chapterId: string }[] = [];

    const bezier = (x1: number, y1: number, x2: number, y2: number) => {
      const midX = (x1 + x2) / 2;
      return `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
    };

    for (let i = 1; i < layout.nodes.length; i++) {
      const prev = layout.nodes[i - 1];
      const curr = layout.nodes[i];
      const prevComplete = isStepComplete(prev.step, journeyStars);
      const currUnlocked = isStepUnlocked(curr.step, journeyStars);
      const lit = prevComplete && currUnlocked;
      const color = curr.chapter.color;
      const chapterId = curr.chapter.id;

      if (prev.branchY) {
        for (const by of prev.branchY) {
          if (curr.branchY) {
            for (const cy of curr.branchY) {
              paths.push({ d: bezier(prev.x, by, curr.x, cy), lit, color, chapterId });
            }
          } else {
            paths.push({ d: bezier(prev.x, by, curr.x, curr.y), lit, color, chapterId });
          }
        }
      } else if (curr.branchY) {
        for (const cy of curr.branchY) {
          paths.push({ d: bezier(prev.x, prev.y, curr.x, cy), lit, color, chapterId });
        }
      } else {
        paths.push({ d: bezier(prev.x, prev.y, curr.x, curr.y), lit, color, chapterId });
      }
    }
    return paths;
  }, [layout.nodes, journeyStars]);

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
      <div className="flex items-center justify-between px-6 py-3 shrink-0 relative z-20">
        <NavigationTabs />
        <div className="flex items-center gap-2">
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

      {/* Progress bar */}
      <div className="px-6 pb-2 shrink-0 relative z-20">
        <JourneyProgressBar completed={completed} />
      </div>

      {/* Horizontal scrolling constellation path */}
      <div
        ref={measureRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative z-10"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="relative" style={{ width: layout.totalWidth, height: '100%' }}>
          {/* SVG connection lines */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={layout.totalWidth}
            height={containerH}
          >
            <defs>
              {JOURNEY_CHAPTERS.map((ch) => (
                <filter key={ch.id} id={`journey-glow-${ch.id}`}>
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>
            {connections.map((c, i) => (
              <path
                key={i}
                d={c.d}
                fill="none"
                stroke={c.lit ? c.color : 'var(--constellation-connection-dim)'}
                strokeWidth={c.lit ? 2.5 : 1}
                opacity={c.lit ? 0.7 : 1}
                filter={c.lit ? `url(#journey-glow-${c.chapterId})` : undefined}
              />
            ))}
          </svg>

          {/* Chapter labels */}
          {layout.chapterLabels.map(({ chapter, x }) => {
            const progress = getChapterProgress(chapter.id, journeyStars);
            const steps = getChapterSteps(chapter.id);
            const isUnlocked = steps.some((s) => isStepUnlocked(s, journeyStars));

            return (
              <div
                key={chapter.id}
                className="absolute flex items-center gap-3 pointer-events-none"
                style={{
                  left: x,
                  top: 28,
                  transform: 'translateX(-50%)',
                  opacity: isUnlocked ? 1 : 0.3,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: isUnlocked ? chapter.color : 'var(--bg-overlay)',
                    color: isUnlocked ? 'rgba(0,0,0,0.8)' : 'var(--text-muted)',
                    boxShadow: isUnlocked ? `0 0 12px ${chapter.color}55` : 'none',
                  }}
                >
                  {chapter.number}
                </div>
                <div className="whitespace-nowrap">
                  <span
                    className="text-sm font-bold tracking-wide"
                    style={{ color: isUnlocked ? chapter.color : 'var(--constellation-locked-text)' }}
                  >
                    {chapter.title}
                  </span>
                  <span className="text-xs font-medium ml-2" style={{ color: isUnlocked ? chapter.color : 'var(--constellation-stats)', opacity: 0.5 }}>
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Step nodes + descriptions */}
          {layout.nodes.map((nodePos) => {
            const unlocked = isStepUnlocked(nodePos.step, journeyStars);
            const complete = isStepComplete(nodePos.step, journeyStars);
            const isCurrent = nextStep?.id === nodePos.step.id;

            if (nodePos.branchY && nodePos.step.type === 'branch') {
              const songIds = nodePos.step.songChoices;
              return (
                <div key={nodePos.step.id}>
                  {songIds.map((songId, idx) => {
                    const song = songMap[songId];
                    if (!song) return null;
                    const by = nodePos.branchY![idx];
                    const songStars = journeyStars[songId] ?? 0;
                    const songComplete = songStars >= 1;
                    return (
                      <div key={songId}>
                        <div
                          ref={isCurrent && idx === 0 ? currentStepRef : undefined}
                          className="absolute"
                          style={{
                            left: nodePos.x - NODE_BTN_W / 2,
                            top: by - 22,
                          }}
                        >
                          <JourneyNode
                            song={song}
                            songStars={songStars}
                            isUnlocked={unlocked}
                            isCurrent={isCurrent && !complete}
                            isComplete={songComplete}
                            chapterColor={nodePos.chapter.color}
                            onPlay={() => handlePlay(songId)}
                          />
                        </div>
                        {unlocked && (
                          <NodeDescription
                            title={song.title}
                            teaches={nodePos.step.teaches}
                            description={nodePos.step.description}
                            composer={song.composer}
                            color={nodePos.chapter.color}
                            x={nodePos.x}
                            y={by}
                            above={idx === 0}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            const songId = nodePos.step.type === 'linear' ? nodePos.step.songId : '';
            const song = songMap[songId];
            if (!song) return null;
            const songStars = journeyStars[songId] ?? 0;

            return (
              <div key={nodePos.step.id}>
                <div
                  ref={isCurrent ? currentStepRef : undefined}
                  className="absolute"
                  style={{
                    left: nodePos.x - NODE_BTN_W / 2,
                    top: nodePos.y - 22,
                  }}
                >
                  <JourneyNode
                    song={song}
                    songStars={songStars}
                    isUnlocked={unlocked}
                    isCurrent={isCurrent}
                    isComplete={complete}
                    chapterColor={nodePos.chapter.color}
                    onPlay={() => handlePlay(songId)}
                  />
                </div>
                {unlocked && (
                  <NodeDescription
                    title={song.title}
                    teaches={nodePos.step.teaches}
                    description={nodePos.step.description}
                    composer={song.composer}
                    color={nodePos.chapter.color}
                    x={nodePos.x}
                    y={nodePos.y}
                    above={nodePos.y >= centerY}
                  />
                )}
              </div>
            );
          })}

          {/* Journey complete button */}
          {allDone && (
            <div
              className="absolute"
              style={{ left: layout.totalWidth - 80, top: centerY, transform: 'translate(-50%, -50%)' }}
            >
              <button
                onClick={() => setShowCompletion(true)}
                className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105 animate-celebrateGlow"
                style={{ background: '#fbbf24', color: 'rgba(0,0,0,0.8)' }}
              >
                Journey Complete!
              </button>
            </div>
          )}
        </div>
      </div>

      {showFreePlayToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-scaleIn">
          <button
            onClick={() => { setShowFreePlayToast(false); navigate('/songs'); }}
            className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border transition-transform hover:scale-105"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-light)',
              boxShadow: '0 0 20px rgba(34,211,238,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: '#22d3ee' }}>Free Play Unlocked!</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Tap to explore the full song library</p>
            </div>
          </button>
        </div>
      )}

      {showSettings && <CalibrationModal onClose={() => setShowSettings(false)} />}
      {showCompletion && (
        <JourneyCompletionModal
          onClose={() => setShowCompletion(false)}
          onFreePlay={() => { setShowCompletion(false); navigate('/songs'); }}
        />
      )}
    </div>
  );
}

function NodeDescription({ title, teaches, description, composer, color, x, y, above }: {
  title?: string; teaches?: string; description: string; composer?: string; color: string; x: number; y: number; above: boolean;
}) {
  const NODE_GAP = 40;
  return (
    <div
      className="absolute pointer-events-none text-center"
      style={{
        left: x - DESC_W / 2,
        top: above ? y - NODE_GAP : y + NODE_GAP,
        width: DESC_W,
        ...(above ? { transform: 'translateY(-100%)' } : {}),
      }}
    >
      {title && (
        <p className="text-[11px] font-semibold mb-0.5 leading-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
      )}
      {composer && (
        <p className="text-[10px] font-medium mb-0.5" style={{ color, opacity: 0.8 }}>
          {composer}
        </p>
      )}
      <p
        className="text-[10px] leading-relaxed"
        style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
      >
        {description}
      </p>
      {teaches && (
        <p className="text-[9px] mt-0.5 italic" style={{ color, opacity: 0.6 }}>
          {teaches}
        </p>
      )}
    </div>
  );
}
