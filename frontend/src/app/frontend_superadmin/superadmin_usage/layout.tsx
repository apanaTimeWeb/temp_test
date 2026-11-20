import type { ReactNode } from 'react';

// RESPONSIBILITY: Render layout boundary for SuperAdmin Usage & Limit Monitoring.
// Branches, users, members, storage, messages, API usage tracking.

export default function SuperadminUsageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
