import { useState, useCallback } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { MidiCheckStep } from './MidiCheckStep';
import { BridgeSetupStep } from './BridgeSetupStep';
import { HandPlacementStep } from './HandPlacementStep';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useUserStore } from '../../stores/userStore';

type Step = 'welcome' | 'midi-check' | 'bridge-setup' | 'hand-placement';

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome');

  const { completeOnboarding } = useOnboardingStore();
  const piConnected = useUserStore((s) => s.piConnected);

  const handleMidiFound = useCallback(() => {
    setStep('hand-placement');
  }, []);

  const handleNoMidi = useCallback(() => {
    setStep('bridge-setup');
  }, []);

  const handleUseBridge = useCallback(() => {
    setStep('bridge-setup');
  }, []);

  const handleBridgeConnected = useCallback(() => {
    setStep('hand-placement');
  }, []);

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
            <BridgeSetupStep onConnected={handleBridgeConnected} />
          </div>
        )}

        {step === 'hand-placement' && (
          <div className="animate-fadeIn">
            <HandPlacementStep onFinish={handleFinish} />
          </div>
        )}
      </div>
    </div>
  );
}
