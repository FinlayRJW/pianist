import { useNavigate, useLocation } from 'react-router-dom';

export function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdventure = location.pathname === '/' || location.pathname === '';

  return (
    <div className="flex gap-1 p-1 rounded-lg t-bg-overlay">
      <button
        onClick={() => navigate('/')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          isAdventure ? 'bg-accent text-white shadow-sm' : 't-text-secondary hover:t-text'
        }`}
      >
        Adventure
      </button>
      <button
        onClick={() => navigate('/songs')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          !isAdventure ? 'bg-accent text-white shadow-sm' : 't-text-secondary hover:t-text'
        }`}
      >
        Free Play
      </button>
    </div>
  );
}
