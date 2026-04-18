import { useRef, useState } from 'react';
import { MicCalibrationStep } from './MicCalibrationStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useProgressStore } from '../../stores/progressStore';
import type { CalibrationData } from '../../stores/onboardingStore';
import type { DisplayMode } from '../../types';

interface Props {
  onClose: () => void;
}

const DISPLAY_MODES: { value: DisplayMode; label: string }[] = [
  { value: 'falling', label: 'Falling Notes' },
  { value: 'sheet-and-falling', label: 'Both' },
  { value: 'sheet-only', label: 'Sheet Music' },
];

export function CalibrationModal({ onClose }: Props) {
  const setCalibration = useOnboardingStore((s) => s.setCalibration);
  const theme = useOnboardingStore((s) => s.theme);
  const setTheme = useOnboardingStore((s) => s.setTheme);
  const displayMode = useOnboardingStore((s) => s.displayMode);
  const setDisplayMode = useOnboardingStore((s) => s.setDisplayMode);

  const exportProgress = useProgressStore((s) => s.exportProgress);
  const importProgress = useProgressStore((s) => s.importProgress);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleComplete = (data: CalibrationData) => {
    setCalibration(data);
    onClose();
  };

  const handleExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pianist-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importProgress(reader.result as string);
        setImportStatus('Progress restored successfully');
        setTimeout(() => setImportStatus(null), 3000);
      } catch {
        setImportStatus('Invalid backup file');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <div className="t-bg-modal rounded-2xl p-8 shadow-2xl border t-border-light max-w-md w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 t-text-muted hover:t-text-secondary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-lg font-bold t-text mb-6 text-center">Settings</h2>

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

        {/* Display mode */}
        <div className="mb-6">
          <label className="text-xs font-medium t-text-secondary block mb-2">Display Mode</label>
          <div className="flex gap-1 t-bg-overlay rounded-lg p-1">
            {DISPLAY_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setDisplayMode(m.value)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  displayMode === m.value
                    ? 'bg-accent text-white shadow-sm'
                    : 't-text-secondary hover:t-text'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress backup */}
        <div className="mb-6">
          <label className="text-xs font-medium t-text-secondary block mb-2">Progress</label>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 rounded-lg t-bg-overlay t-text-secondary hover:t-text text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-3 py-2 rounded-lg t-bg-overlay t-text-secondary hover:t-text text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          {importStatus && (
            <p className={`text-xs mt-2 ${importStatus.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
              {importStatus}
            </p>
          )}
          <div className="mt-2">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
              >
                Reset all progress
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Are you sure?</span>
                <button
                  onClick={handleReset}
                  className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs t-text-muted hover:t-text-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calibration */}
        <div className="border-t t-border pt-5">
          <label className="text-xs font-medium t-text-secondary block mb-3">Input Calibration</label>
          <MicCalibrationStep onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
