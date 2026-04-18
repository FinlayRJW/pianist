import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="h-full flex flex-col bg-midnight">
      {children}
    </div>
  );
}
