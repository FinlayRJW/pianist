import { useState, useCallback } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { MidiCheckStep } from './MidiCheckStep';
import { BridgeSetupStep } from './BridgeSetupStep';
import { MicCalibrationStep } from './MicCalibrationStep';
import { HandPlacementStep } from './HandPlacementStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useUserStore } from '../../stores/userStore';
import type { CalibrationData } from '../../stores/onboardingStore';

type Step = 'welcome' | 'midi-check' | 'bridge-setup' | 'mic-calibration' | 'hand-placement';

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [inputMode, setInputMode] = useState<'midi' | 'mic'>('mic');

  const { completeOnboarding, setCalibration } = useOnboardingStore();
  const piConnected = useUserStore((s) => s.piConnected);

  const handleMidiFound = useCallback(() => {
    setInputMode('midi');
    setStep('hand-placement');
  }, []);

  const handleNoMidi = useCallback(() => {
    if (piConnected) {
      setStep('bridge-setup');
    } else {
      setStep('mic-calibration');
    }
  }, [piConnected]);

  const handleUseBridge = useCallback(() => {
    setStep('bridge-setup');
  }, []);

  const handleBridgeConnected = useCallback(() => {
    setInputMode('midi');
    setStep('hand-placement');
  }, []);

  const handleCalibrationComplete = useCallback((data: CalibrationData) => {
    setCalibration(data);
    setInputMode('mic');
    setStep('hand-placement');
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
            <WelcomeStep onContinue={() => setStep(piConnected ? 'bridge-setup' : 'midi-check')} />
          </div>
        )}

        {step === 'midi-check' && (
          <div className="animate-fadeIn">
            <MidiCheckStep onMidiFound={handleMidiFound} onNoMidi={handleNoMidi} onUseBridge={handleUseBridge} />
          </div>
        )}

        {step === 'bridge-setup' && (
          <div className="animate-fadeIn">
            <BridgeSetupStep onConnected={handleBridgeConnected} onSkip={handleNoMidi} piConnected={piConnected} />
          </div>
        )}

        {step === 'mic-calibration' && (
          <div className="animate-fadeIn">
            <MicCalibrationStep onComplete={handleCalibrationComplete} />
          </div>
        )}

        {step === 'hand-placement' && (
          <div className="animate-fadeIn">
            <HandPlacementStep hasMidi={inputMode === 'midi'} onFinish={handleFinish} />
          </div>
        )}
      </div>
    </div>
  );
}
