import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { SongLibrary } from './components/library/SongLibrary';
import { JourneyPath } from './components/journey/JourneyPath';
import { PlayRoute } from './components/game/PlayRoute';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { UserPicker } from './components/user/UserPicker';
import { useOnboardingStore } from './stores/onboardingStore';
import { useUserStore } from './stores/userStore';
import { invalidateCanvasThemeCache } from './canvas/theme';

export default function App() {
  const onboardingCompleted = useOnboardingStore((s) => s.completed);
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);
  const theme = useOnboardingStore((s) => s.theme);
  const piConnected = useUserStore((s) => s.piConnected);
  const currentUser = useUserStore((s) => s.currentUser);
  const checkPi = useUserStore((s) => s.checkPi);
  const piChecked = useUserStore((s) => s.piChecked);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    invalidateCanvasThemeCache();
  }, [theme]);

  const shouldCheckPi = !!midiBridgeUrl || (
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  );

  useEffect(() => {
    if (shouldCheckPi) {
      checkPi();
    }
  }, [shouldCheckPi, checkPi]);

  if (shouldCheckPi && !piChecked) {
    return (
      <div className="h-full flex items-center justify-center bg-midnight">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (piConnected && !currentUser) {
    return <UserPicker />;
  }

  if (!onboardingCompleted) {
    return <OnboardingFlow />;
  }

  return (
    <BrowserRouter basename="/pianist">
      <AppShell>
        <Routes>
          <Route path="/" element={<JourneyPath />} />
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/play/:songId" element={<PlayRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
