'use client';
/** Responsibility: Superadmin Navigation Main; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: pathname, shell verification state, density and sidebar state -> role route gate/layout -> child page rendering; client-side gating is not a substitute for host server authorization. */
import { useSuperadminNavigationShellState } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellState';
import SuperadminNavigationShellSidebar from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellSidebar';
import SuperadminNavigationShellHeader from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellHeader';
import SuperadminNavigationShellPreviewNotice from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellPreviewNotice';
import SuperadminNavigationShellCommandPalette from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellCommandPalette';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';




/**
 * Performs the superadmin navigation shell main operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: React.ReactNode; }.
 */
export default function SuperadminNavigationShellMain({ children }: { children: React.ReactNode }) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const { pathname, sidebarOpen, setSidebarOpen, isMobileViewport, verifiedPath, density, setDensity, isSuperadminRoute } = useSuperadminNavigationShellState();

  if (!isSuperadminRoute) return <>{children}</>;

  // Show nothing while the client-side role check is pending; the host must enforce authorization server-side as well.
  if (verifiedPath !== pathname) {
    return (
      <div className="superadmin-theme sa-shell-verification" role="status" aria-busy="true" aria-label={t("COPY.VERIFYING_SUPER_ADMIN_ACCESS")}>
        <div className="mx-auto mt-16 max-w-xl space-y-3 p-6" aria-hidden="true">
          <div className="h-7 w-56 max-w-full rounded bg-surface-highlight motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-4 w-80 max-w-full rounded bg-surface-hover motion-safe:animate-pulse motion-reduce:animate-none" />
        </div>
        <span className="sr-only">{t("COPY.VERIFYING_SUPER_ADMIN_ACCESS")}</span>
      </div>
    );
  }

  // Setup wizard is explicitly standalone
  if (pathname.startsWith(SUPERADMIN_NAVIGATION_ROUTES.libraries_onboarding_setup)) {
    return <div className="superadmin-theme">{children}</div>;
  }

  return (
    <div className="superadmin-theme" data-density={density}>
      <div className="sa-shell">
        <button
          type="button"
          className={`sa-sidebar-mobile-overlay ${sidebarOpen ? 'sa-sidebar-mobile-overlay--visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-label={t("COPY.CLOSE_NAVIGATION_MENU")}
          aria-hidden={!sidebarOpen}
          disabled={!sidebarOpen}
          tabIndex={sidebarOpen ? 0 : -1}
         data-testid="superadmin-navigation-main-close-navigation-menu-1"/>
        <SuperadminNavigationShellSidebar open={sidebarOpen} mobileViewport={isMobileViewport} />
        <div className="sa-shell-content">
          <SuperadminNavigationShellHeader menuExpanded={sidebarOpen} onMenuClick={() => setSidebarOpen(o => !o)} density={density} onDensityChange={setDensity} />
          <main className="sa-shell-main sa-page-animate">
            <SuperadminNavigationShellPreviewNotice />
            {children}
          </main>
        </div>
      </div>
      <SuperadminNavigationShellCommandPalette />
    </div>
  );
}
