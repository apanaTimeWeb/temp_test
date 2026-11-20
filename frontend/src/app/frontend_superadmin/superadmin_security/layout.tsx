import type { ReactNode } from 'react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

// RESPONSIBILITY: Render the navigation/layout boundary for the Security domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_security/layout.tsx -> role-level navigation registry and child route content.

/**
 * Domain layout for the SuperAdmin Security domain.
 * Passes child views directly without redundant top navigation buttons.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  void SUPERADMIN_NAVIGATION_ROUTES;
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      {children}
    </div>
  );
}
