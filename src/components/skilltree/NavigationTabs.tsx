import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../stores/progressStore';

export function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const isJourney = location.pathname === '/' || location.pathname === '';
  const freePlayUnlocked = useProgressStore((s) => s.freePlayUnlocked);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex gap-1 p-1 rounded-lg t-bg-overlay">
      <button
        onClick={() => navigate('/')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          isJourney ? 'bg-accent text-white shadow-sm' : 't-text-secondary hover:t-text'
        }`}
      >
        Journey
      </button>
      <div className="relative">
        <button
          onClick={() => freePlayUnlocked && navigate('/songs')}
          onMouseEnter={() => !freePlayUnlocked && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
            !isJourney ? 'bg-accent text-white shadow-sm' : freePlayUnlocked ? 't-text-secondary hover:t-text' : 't-text-muted cursor-not-allowed'
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
