import { MicCalibrationStep } from './MicCalibrationStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import type { CalibrationData } from '../../stores/onboardingStore';

interface Props {
  onClose: () => void;
}

export function CalibrationModal({ onClose }: Props) {
  const setCalibration = useOnboardingStore((s) => s.setCalibration);

  const handleComplete = (data: CalibrationData) => {
    setCalibration(data);
    onClose();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <div className="bg-[#1a1a2a] rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <MicCalibrationStep onComplete={handleComplete} />
      </div>
    </div>
  );
}
