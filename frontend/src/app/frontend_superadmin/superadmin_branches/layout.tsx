import type { ReactNode } from 'react';

// RESPONSIBILITY: Render the layout boundary for the SuperAdmin Branch Management domain.
// Har Library Account ke andar branches create, edit, activate, suspend aur close karna.

export default function SuperadminBranchesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
