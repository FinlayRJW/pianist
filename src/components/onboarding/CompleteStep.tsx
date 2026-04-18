interface Props {
  mode: 'midi' | 'mic';
  detail: string;
  onFinish: () => void;
}

export function CompleteStep({ mode, detail, onFinish }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-8">
      <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center animate-scaleIn">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white">You're All Set!</h2>
        <div className="mt-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-3">
          {mode === 'midi' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="8" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="16" cy="12" r="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          )}
          <span className="text-white/70 text-sm">{detail}</span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors shadow-lg shadow-accent/30"
      >
        Start Playing
      </button>
    </div>
  );
}
