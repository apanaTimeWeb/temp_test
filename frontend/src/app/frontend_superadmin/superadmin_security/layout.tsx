import type { ReactNode } from 'react';

// RESPONSIBILITY: Render the domain layout container for the Security domain.
// FLOW: Domain route -> superadmin_security/layout.tsx -> child route content.

/**
 * Domain layout for the SuperAdmin Security domain.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
