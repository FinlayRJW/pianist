interface Props {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: Props) {
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
                <div className="absolute -right-2 top-0 w-6 h-16 bg-midnight rounded-b-md z-10 border border-white/10" />
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Pianist</h1>
        <p className="text-white/50 mt-3 text-lg">Learn piano with real-time feedback</p>
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
