import { useEffect, useRef, useState } from 'react';
import { useCalibration } from '../../hooks/useCalibration';
import type { CalibrationData } from '../../stores/onboardingStore';

interface Props {
  onComplete: (data: CalibrationData) => void;
  autoStart?: boolean;
}

export function MicCalibrationStep({ onComplete, autoStart = false }: Props) {
  const cal = useCalibration();
  const startedRef = useRef(false);
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      startedRef.current = true;
      cal.start();
    }
  }, [autoStart, cal.start]);

  useEffect(() => {
    if (cal.phase === 'waiting-for-note') {
      hintTimerRef.current = setTimeout(() => setShowHint(true), 10000);
    } else {
      setShowHint(false);
      clearTimeout(hintTimerRef.current);
    }
    return () => clearTimeout(hintTimerRef.current);
  }, [cal.phase]);

  const handleStart = () => {
    startedRef.current = true;
    cal.start();
  };

  const handleRetry = () => {
    setShowHint(false);
    cal.reset();
    setTimeout(() => cal.start(), 50);
  };

  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ambientStroke = ringCircumference * (1 - cal.ambientProgress);

  const rmsScale = Math.min(cal.rmsLevel * 30, 1);

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-8">
      {/* Visual feedback circle */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Progress ring for ambient phase */}
        {(cal.phase === 'measuring-ambient' || cal.phase === 'waiting-for-note' || cal.phase === 'note-detected') && (
          <svg className="absolute inset-0 -rotate-90" width="160" height="160">
            <circle cx="80" cy="80" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle
              cx="80" cy="80" r={ringRadius} fill="none"
              stroke={cal.phase === 'measuring-ambient' ? '#6366f1' : '#22c55e'}
              strokeWidth="4"
              strokeDasharray={ringCircumference}
              strokeDashoffset={cal.phase === 'measuring-ambient' ? ambientStroke : 0}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
        )}

        {/* RMS reactive circle */}
        {(cal.phase === 'measuring-ambient' || cal.phase === 'waiting-for-note') && (
          <div
            className="absolute rounded-full bg-accent/10 transition-transform duration-75"
            style={{
              width: `${60 + rmsScale * 40}px`,
              height: `${60 + rmsScale * 40}px`,
              transform: `scale(${1 + rmsScale * 0.3})`,
            }}
          />
        )}

        {/* Center content */}
        {cal.phase === 'idle' && (
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </div>
        )}

        {cal.phase === 'requesting-mic' && (
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </div>
        )}

        {cal.phase === 'measuring-ambient' && (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white tabular-nums">{Math.round(cal.ambientProgress * 100)}%</span>
          </div>
        )}

        {cal.phase === 'waiting-for-note' && (
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}

        {cal.phase === 'note-detected' && (
          <div className="flex flex-col items-center animate-scaleIn">
            <span className="text-4xl font-bold text-emerald-400">{cal.detectedNote}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mt-1">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {cal.phase === 'error' && (
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        {cal.phase === 'idle' && (
          <>
            <h2 className="text-2xl font-bold text-white">Microphone Calibration</h2>
            <p className="text-white/40 mt-2">We'll measure your room's background noise, then ask you to play a note</p>
          </>
        )}

        {cal.phase === 'requesting-mic' && (
          <>
            <h2 className="text-2xl font-bold text-white">Requesting Microphone Access</h2>
            <p className="text-white/40 mt-2">Please allow microphone access when prompted</p>
          </>
        )}

        {cal.phase === 'measuring-ambient' && (
          <>
            <h2 className="text-2xl font-bold text-white">Listening to Your Room</h2>
            <p className="text-white/40 mt-2">Stay quiet — don't play anything yet</p>
          </>
        )}

        {cal.phase === 'waiting-for-note' && (
          <>
            <h2 className="text-2xl font-bold text-white">Now Play a Note!</h2>
            <p className="text-white/40 mt-2">Play any single note on your instrument</p>
            {showHint && (
              <p className="text-amber-400 mt-3 text-sm">
                Having trouble? Try playing louder or moving closer to your mic.
              </p>
            )}
          </>
        )}

        {cal.phase === 'note-detected' && (
          <>
            <h2 className="text-2xl font-bold text-white">Sounds Great!</h2>
            <p className="text-white/40 mt-2">
              We detected <span className="text-emerald-400 font-semibold">{cal.detectedNote}</span> — your microphone is calibrated
            </p>
          </>
        )}

        {cal.phase === 'error' && (
          <>
            <h2 className="text-2xl font-bold text-white">Microphone Error</h2>
            <p className="text-red-400 mt-2">{cal.error}</p>
          </>
        )}
      </div>

      {/* Actions */}
      {cal.phase === 'idle' && (
        <button
          onClick={handleStart}
          className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
        >
          Start Calibration
        </button>
      )}

      {cal.phase === 'note-detected' && cal.result && (
        <button
          onClick={() => onComplete(cal.result!)}
          className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
        >
          Continue
        </button>
      )}

      {(cal.phase === 'error' || showHint) && (
        <button
          onClick={handleRetry}
          className="px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
