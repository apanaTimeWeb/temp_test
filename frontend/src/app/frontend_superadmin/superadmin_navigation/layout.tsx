import type { ReactNode } from 'react';

/**
 * Domain layout for the SuperAdmin Navigation Shell domain.
 * Passes child views directly without redundant wrappers.
 */
export default function SuperadminNavigationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
