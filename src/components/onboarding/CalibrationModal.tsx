import { MicCalibrationStep } from './MicCalibrationStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import type { CalibrationData } from '../../stores/onboardingStore';

interface Props {
  onClose: () => void;
}

export function CalibrationModal({ onClose }: Props) {
  const setCalibration = useOnboardingStore((s) => s.setCalibration);
  const theme = useOnboardingStore((s) => s.theme);
  const setTheme = useOnboardingStore((s) => s.setTheme);

  const handleComplete = (data: CalibrationData) => {
    setCalibration(data);
    onClose();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <div className="t-bg-modal rounded-2xl p-8 shadow-2xl border t-border-light max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 t-text-muted hover:t-text-secondary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Theme toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1 t-bg-overlay rounded-full p-0.5">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                theme === 'dark' ? 'bg-accent text-white' : 't-text-tertiary'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                theme === 'light' ? 'bg-accent text-white' : 't-text-tertiary'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light
            </button>
          </div>
        </div>

        <MicCalibrationStep onComplete={handleComplete} />
      </div>
    </div>
  );
}
