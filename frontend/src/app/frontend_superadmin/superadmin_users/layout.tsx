import type { ReactNode } from 'react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

/**
 * Domain layout for the SuperAdmin Users domain.
 * Configured with p-0 full-width container matching API & Integration layout standard.
 */
export default function DomainLayout({ children }: { children: ReactNode }) {
  void SUPERADMIN_NAVIGATION_ROUTES;
  return (
    <div className="w-full max-w-full min-w-0 p-0">
      {children}
    </div>
  );
}
