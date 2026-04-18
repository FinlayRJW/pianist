import { useOnboardingStore } from '../../stores/onboardingStore';

interface Props {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: Props) {
  const theme = useOnboardingStore((s) => s.theme);
  const setTheme = useOnboardingStore((s) => s.setTheme);

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-8">
      {/* Piano keys graphic */}
      <div className="flex gap-0.5">
        {Array.from({ length: 7 }, (_, i) => {
          const hasBlack = ![2, 6].includes(i);
          return (
            <div key={i} className="relative">
              <div
                className="w-10 h-28 bg-white rounded-b-md shadow-lg"
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              />
              {hasBlack && i < 6 && (
                <div className="absolute -right-2 top-0 w-6 h-16 rounded-b-md z-10" style={{ backgroundColor: 'var(--key-black)', borderColor: 'var(--key-black-border)', borderWidth: 1 }} />
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h1 className="text-4xl font-bold t-text tracking-tight">Pianist</h1>
        <p className="t-text-secondary mt-3 text-lg">Learn piano with real-time feedback</p>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center gap-3 t-bg-overlay rounded-full p-1">
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            theme === 'dark' ? 'bg-accent text-white' : 't-text-tertiary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          Dark
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            theme === 'light' ? 'bg-accent text-white' : 't-text-tertiary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      <button
        onClick={onContinue}
        className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors shadow-lg shadow-accent/30"
      >
        Get Started
      </button>
    </div>
  );
}
