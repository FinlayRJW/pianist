import { useUserStore } from '../../stores/userStore';

export function UserBadge() {
  const currentUser = useUserStore((s) => s.currentUser);
  const piConnected = useUserStore((s) => s.piConnected);
  const logout = useUserStore((s) => s.logout);

  if (!piConnected || !currentUser) return null;

  return (
    <button
      onClick={logout}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full t-bg-overlay hover:t-bg-overlay-hover transition-colors"
      title={`Signed in as ${currentUser.name} — tap to switch`}
    >
      <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center text-accent-light text-[10px] font-bold">
        {currentUser.name[0].toUpperCase()}
      </div>
      <span className="t-text-secondary text-[11px] font-medium max-w-[60px] truncate">
        {currentUser.name}
      </span>
    </button>
  );
}
