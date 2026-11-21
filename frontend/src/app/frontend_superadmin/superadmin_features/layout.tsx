import type { ReactNode } from 'react';

// RESPONSIBILITY: Render layout boundary for SuperAdmin Feature & Module Control.
// Lockers, Members, Seats, Finance, Accounts, Communication jaise modules enable/disable karna.

export default function SuperadminFeaturesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
