'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AdminQueryProvider } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminQueryProvider';
import { AdminNavigationSidebar } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/components/AdminNavigationSidebar';
import { AdminShellHeader } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellHeader';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/application_infrastructure.css';

/**
 * @description Owns the admin application shell only: provider, responsive sidebar, fixed header, and content offset.
 * @dependencies Uses only zero-business shell primitives.
 * @edge-case Non-admin routes bypass the shell completely; this shell owns mobile drawer state so the header and sidebar stay synchronized.
 */
export function AdminShellRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const closeMobileNavigation = useCallback(() => setMobileNavigationOpen(false), []);
  useEffect(() => { setMobileNavigationOpen(false); }, [pathname]);
  const isAdminRoute =
    pathname === ADMIN_ROUTES.PREFIX ||
    pathname.startsWith(`${ADMIN_ROUTES.PREFIX}/`) ||
    pathname === '/frontend_admin' ||
    pathname.startsWith('/frontend_admin/');

  if (!isAdminRoute) return <>{children}</>;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AdminQueryProvider>
        <div className="admin-theme admin-shell-flex">
          <AdminNavigationSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} mobileOpen={mobileNavigationOpen} onMobileClose={closeMobileNavigation} />
          <div className={`admin-main-offset ${sidebarCollapsed ? 'admin-main-offset-collapsed' : 'admin-main-offset-expanded'}`}>
            <AdminShellHeader onMobileOpen={() => setMobileNavigationOpen(true)} />
            <main className="admin-shell-content">
              <div className="motion-safe:transition-opacity motion-safe:duration-base">{children}</div>
            </main>
          </div>
          <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: 'bg-overlay text-text-primary border border-border text-body' }} />
        </div>
      </AdminQueryProvider>
    </ThemeProvider>
  );
}
