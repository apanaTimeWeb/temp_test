import type { ReactNode } from 'react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

/**
 * Domain layout for the SuperAdmin Users domain.
 * Passes child views directly without top navigation buttons.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  void SUPERADMIN_NAVIGATION_ROUTES;
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      {children}
    </div>
  );
}
