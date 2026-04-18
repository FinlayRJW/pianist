import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { SongLibrary } from './components/library/SongLibrary';
import { SkillTree } from './components/skilltree/SkillTree';
import { PlayRoute } from './components/game/PlayRoute';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { useOnboardingStore } from './stores/onboardingStore';
import { invalidateCanvasThemeCache } from './canvas/theme';

export default function App() {
  const onboardingCompleted = useOnboardingStore((s) => s.completed);
  const theme = useOnboardingStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    invalidateCanvasThemeCache();
  }, [theme]);

  if (!onboardingCompleted) {
    return <OnboardingFlow />;
  }

  return (
    <BrowserRouter basename="/pianist">
      <AppShell>
        <Routes>
          <Route path="/" element={<SkillTree />} />
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/play/:songId" element={<PlayRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
