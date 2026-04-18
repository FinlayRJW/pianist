import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { SongLibrary } from './components/library/SongLibrary';
import { PlayRoute } from './components/game/PlayRoute';

export default function App() {
  return (
    <BrowserRouter basename="/pianist">
      <AppShell>
        <Routes>
          <Route path="/songs" element={<SongLibrary />} />
          <Route path="/play/:songId" element={<PlayRoute />} />
          <Route path="*" element={<Navigate to="/songs" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
