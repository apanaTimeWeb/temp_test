import type { ReactNode } from 'react';

// RESPONSIBILITY: Render layout boundary for SuperAdmin Data & Backup Management.
// Backup, restore, import, export, archive, retention.

export default function SuperadminDataLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
