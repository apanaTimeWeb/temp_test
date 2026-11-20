import type { ReactNode } from 'react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

// RESPONSIBILITY: Render the layout boundary for the SuperAdmin Support domain.
// Student physical complaints are handled at the library branch desk by Managers/Admins; SuperAdmin deals strictly with SaaS & software technical issues.

export default function DomainLayout({ children }: { children: ReactNode }) {
  void SUPERADMIN_NAVIGATION_ROUTES;
  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
