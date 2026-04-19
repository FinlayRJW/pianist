import { useState, useEffect } from 'react';
import { useUserStore, getLastUserId } from '../../stores/userStore';

export function UserPicker() {
  const { users, loading, selectUser, createUser, deleteUser, loadUsers } = useUserStore();
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [autoSelectAttempted, setAutoSelectAttempted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (autoSelectAttempted || users.length === 0) return;
    setAutoSelectAttempted(true);
    const lastId = getLastUserId();
    if (lastId && users.some((u) => u.id === lastId)) {
      selectUser(lastId);
    }
  }, [users, autoSelectAttempted, selectUser]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const user = await createUser(name);
      setNewName('');
      setShowNewUser(false);
      await selectUser(user.id);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-midnight">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="t-text-secondary text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-midnight p-6">
      <div className="w-full max-w-sm">
        <h1 className="t-text text-2xl font-bold text-center mb-2">Who's playing?</h1>
        <p className="t-text-secondary text-sm text-center mb-8">
          Pick your profile to track your progress
        </p>

        <div className="space-y-3 mb-6">
          {users.map((user) => (
            <div key={user.id} className="relative">
              <button
                onClick={() => selectUser(user.id)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-surface/60 hover:bg-surface/80 border t-border-light hover:border-accent/40 transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center text-accent-light text-lg font-bold shrink-0 group-hover:bg-accent/30 transition-colors">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="t-text font-medium text-base flex-1 text-left">{user.name}</span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(user.id); }}
                  className="t-text-muted hover:text-red-400 transition-colors p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </span>
              </button>
              {deleteConfirm === user.id && (
                <div className="absolute inset-0 rounded-xl bg-midnight/90 backdrop-blur-sm flex items-center justify-center gap-3 z-10">
                  <span className="text-sm t-text-secondary">Delete player?</span>
                  <button
                    onClick={() => { deleteUser(user.id); setDeleteConfirm(null); }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1.5 rounded-lg t-bg-overlay t-text-secondary text-xs font-medium hover:t-text transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showNewUser ? (
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Enter your name"
              autoFocus
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl t-bg-overlay t-text text-sm border t-border-light outline-none focus:border-accent/50 transition-colors placeholder:t-text-muted"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowNewUser(false); setNewName(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl t-bg-overlay t-text-secondary text-sm font-medium hover:t-bg-overlay-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewUser(true)}
            className="w-full px-4 py-3 rounded-xl border border-dashed t-border-light t-text-secondary text-sm font-medium hover:border-accent/40 hover:text-accent-light transition-colors"
          >
            + New Player
          </button>
        )}
      </div>
    </div>
  );
}
