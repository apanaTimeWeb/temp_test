'use client';
// RESPONSIBILITY: Render the navigation navigation route navigation UI for navigation. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the navigation navigation route navigation UI for navigation. It does not own backend persistence or cross-feature business logic.
import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import ManagerNavigationSidebar from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationSidebar';
import ManagerNavigationHeader from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationHeader';
import '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationRouteProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
export type { ManagerNavigationRouteProps };



export function ManagerNavigationRoute({ children }: ManagerNavigationRouteProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isManagerNavigationRoute =
    pathname === MANAGER_NAVIGATION_NAVIGATION_ROUTES.ROOT ||
    pathname.startsWith(`${MANAGER_NAVIGATION_NAVIGATION_ROUTES.ROOT}/`) ||
    pathname === '/manager' ||
    pathname.startsWith('/manager/');
  if (!isManagerNavigationRoute) return <>{children}</>;

  return (
    <div className="mgr-theme" data-testid="manager-role-shell">
      <div className="mgr-shell-flex">
        <ManagerNavigationSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
          mobileOpen={mobileOpen}
          onMobileClose={closeMobile}
        />
        <div className={`mgr-main-offset${collapsed ? ' mgr-main-offset-collapsed' : ''}`}>
          <ManagerNavigationHeader collapsed={collapsed} onMobileOpen={() => setMobileOpen(true)} />
          <main className="mgr-shell-content" data-testid="manager-main-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
