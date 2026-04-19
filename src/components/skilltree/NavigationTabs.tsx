import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../stores/progressStore';

export function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const isJourney = location.pathname === '/' || location.pathname === '';
  const freePlayUnlocked = useProgressStore((s) => s.freePlayUnlocked);
  const [showTooltip, setShowTooltip] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLButtonElement>(null);
  const freePlayRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    const activeRef = isJourney ? journeyRef : freePlayRef;
    const el = activeRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - containerRect.left, width: elRect.width });
    if (!hasAnimated.current) {
      requestAnimationFrame(() => { hasAnimated.current = true; });
    }
  }, [isJourney, freePlayUnlocked]);

  return (
    <div ref={containerRef} className="relative flex gap-1 p-1 rounded-lg t-bg-overlay">
      <div
        className="absolute rounded-md bg-accent shadow-sm"
        style={{
          left: indicator.left,
          width: indicator.width,
          top: 4,
          bottom: 4,
          transition: hasAnimated.current ? 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      />
      <button
        ref={journeyRef}
        onClick={() => navigate('/')}
        className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
          isJourney ? 'text-white' : 't-text-secondary hover:t-text'
        }`}
      >
        Journey
      </button>
      <div className="relative">
        <button
          ref={freePlayRef}
          onClick={() => freePlayUnlocked && navigate('/songs')}
          onMouseEnter={() => !freePlayUnlocked && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
            !isJourney ? 'text-white' : freePlayUnlocked ? 't-text-secondary hover:t-text' : 't-text-muted cursor-not-allowed'
          }`}
        >
          {!freePlayUnlocked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          Free Play
        </button>
        {!freePlayUnlocked && showTooltip && (
          <div
            className="absolute z-50 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap pointer-events-none"
            style={{
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 6,
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Complete First Notes to unlock
          </div>
        )}
      </div>
    </div>
  );
}
