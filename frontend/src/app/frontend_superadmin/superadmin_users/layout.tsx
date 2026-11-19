import type { ReactNode } from 'react';

/**
 * Domain layout for the SuperAdmin Users domain.
 * Passes child views directly without top navigation buttons.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      {children}
    </div>
  );
}
