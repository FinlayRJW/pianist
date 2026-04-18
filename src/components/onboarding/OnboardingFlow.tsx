import { useState, useCallback } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { MidiCheckStep } from './MidiCheckStep';
import { MicCalibrationStep } from './MicCalibrationStep';
import { CompleteStep } from './CompleteStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import type { CalibrationData } from '../../stores/onboardingStore';

type Step = 'welcome' | 'midi-check' | 'mic-calibration' | 'complete';

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [completeMode, setCompleteMode] = useState<'midi' | 'mic'>('mic');
  const [completeDetail, setCompleteDetail] = useState('');

  const { completeOnboarding, setCalibration } = useOnboardingStore();

  const handleMidiFound = useCallback((deviceName: string) => {
    setCompleteMode('midi');
    setCompleteDetail(deviceName);
    setStep('complete');
  }, []);

  const handleNoMidi = useCallback(() => {
    setStep('mic-calibration');
  }, []);

  const handleCalibrationComplete = useCallback((data: CalibrationData) => {
    setCalibration(data);
    setCompleteMode('mic');
    setCompleteDetail('Microphone calibrated');
    setStep('complete');
  }, [setCalibration]);

  const handleFinish = useCallback(() => {
    window.history.replaceState(null, '', import.meta.env.BASE_URL);
    completeOnboarding();
  }, [completeOnboarding]);

  return (
    <div className="h-full bg-midnight flex items-center justify-center">
      <div className="w-full max-w-md">
        {step === 'welcome' && (
          <div className="animate-fadeIn">
            <WelcomeStep onContinue={() => setStep('midi-check')} />
          </div>
        )}

        {step === 'midi-check' && (
          <div className="animate-fadeIn">
            <MidiCheckStep onMidiFound={handleMidiFound} onNoMidi={handleNoMidi} />
          </div>
        )}

        {step === 'mic-calibration' && (
          <div className="animate-fadeIn">
            <MicCalibrationStep onComplete={handleCalibrationComplete} />
          </div>
        )}

        {step === 'complete' && (
          <div className="animate-fadeIn">
            <CompleteStep mode={completeMode} detail={completeDetail} onFinish={handleFinish} />
          </div>
        )}
      </div>
    </div>
  );
}
