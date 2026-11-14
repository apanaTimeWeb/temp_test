'use client';
/** Responsibility: Superadmin Navigation Sidebar; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical role route registry plus current pathname and shell state -> active navigation items -> router navigation and sidebar callbacks; authorization remains enforced by the host server. */
import type { SuperadminNavigationSidebarProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { clearAuthState } from '@/lib/auth';
import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_NAV_ITEMS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { createPortal } from 'react-dom';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from "@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config";
import { useTranslations } from 'next-intl';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';




/**
 * Performs the superadmin navigation shell sidebar operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminNavigationSidebarProps.
 */
export default function SuperadminNavigationShellSidebar({ open = false, mobileViewport = false }: SuperadminNavigationSidebarProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const logoutTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavigationHidden = mobileViewport && !open;

  useEffect(() => {
    if (!showLogout) return;
    const dialog = document.querySelector<HTMLElement>('[data-testid="superadmin-superadmin-navigation-shell-sidebar-section-line-75"]');
    const focusable = () => Array.from<HTMLElement>(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []).filter((item) => item.offsetParent !== null);
    focusable()[0]?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setShowLogout(false); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0]; const last = items[items.length - 1];
      if (!first || !last) { event.preventDefault(); dialog?.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog?.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      dialog?.removeEventListener('keydown', handleDialogKeyDown);
      const logoutTrigger = logoutTriggerRef.current;
      if (logoutTrigger?.isConnected) logoutTrigger.focus();
      logoutTriggerRef.current = null;
    };
  }, [showLogout]);

  return (
    <aside id="superadmin-navigation-sidebar" className={`sa-sidebar ${open ? 'sa-sidebar--open' : ''}`} aria-hidden={mobileNavigationHidden || undefined} inert={mobileNavigationHidden || undefined}>
      <div className="sa-sidebar-logo-area">
        <div className="sa-sidebar-logo-box">
          <span className="text-primary text-xs font-bold">{t("COPY.L")}</span>
        </div>
        <div>
          <p className="sa-sidebar-logo-name">{t("COPY.LIBRARY_OS")}</p>
        </div>
      </div>

      <div className="sa-sidebar-divider" />

      <nav id="superadmin-primary-navigation" className="sa-sidebar-nav" aria-label={t("COPY.SUPER_ADMIN_PRIMARY_NAVIGATION")}>
        {SUPERADMIN_NAVIGATION_NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={`sa-nav-link ${isActive ? 'sa-nav-link--active' : ''}`}
>
              <Icon size={18} aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sa-sidebar-footer">
        <Link href={SUPERADMIN_NAVIGATION_ROUTES.profile_overview} className="flex items-center gap-3 flex-1 overflow-hidden group" data-testid="superadmin-navigation-navigation_shell-link-2">
          <div className="sa-header-avatar-icon shrink-0 group-hover:ring-2 ring-primary motion-safe:transition-all motion-reduce:transition-none">{t("COPY.SA")}</div>
          <div className="sa-sidebar-footer-avatar">
            <p className="sa-sidebar-footer-name group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none">{t("COPY.SUPER_ADMIN")}</p>
            <p className="sa-sidebar-footer-role">{t("COPY.PLATFORM_OWNER")}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={(event) => { logoutTriggerRef.current = event.currentTarget; setShowLogout(true); }}
          className="sa-btn-icon sa-btn-icon--danger"
          title={t("COPY.LOG_OUT")}
          aria-label={t("COPY.LOG_OUT")}
         data-testid="superadmin-navigation-sidebar-log-out-1">
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>

      {showLogout && typeof document !== 'undefined' && createPortal(
        <div className="sa-wizard-modal-overlay sa-logout-overlay" onClick={() => setShowLogout(false)} data-testid="superadmin-superadmin-navigation-shell-sidebar-div-line-74">
          <section
            className="sa-wizard-modal sa-logout-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="superadmin-logout-title"
            aria-describedby="superadmin-logout-description"
            onClick={event => event.stopPropagation()}
            onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setShowLogout(false); } }}
           data-testid="superadmin-superadmin-navigation-shell-sidebar-section-line-75">
            <h2 id="superadmin-logout-title" className="sa-wizard-modal-title">{t("COPY.LOG_OUT_2")}</h2>
            <p id="superadmin-logout-description" className="sa-wizard-modal-desc">{t("COPY.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT_OF_THE_SUPER_ADMIN_PANEL")}</p>
            <div className="sa-logout-actions">
              <button type="button" className="sa-btn-ghost" autoFocus onClick={() => setShowLogout(false)} data-testid="superadmin-navigation-sidebar-cancel-2">{t("COPY.CANCEL")}</button>
              <button type="button" className="sa-btn-ghost sa-btn-ghost--danger" onClick={() => { clearAuthState(); router.push(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_URLS.AUTH_LOGIN); }} data-testid="superadmin-navigation-sidebar-log-out-3">{t("COPY.LOG_OUT")}</button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </aside>
  );
}
