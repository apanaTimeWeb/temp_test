'use client';
/** Responsibility: Superadmin Shell Header; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationHeaderProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import { useSuperadminNavigationShellHeaderMenus } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellHeaderMenus';
import { SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, Zap, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SUPERADMIN_NAVIGATION_PREVIEW_ALERTS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/mocks/fixtures/SuperadminNavigationShellPreviewAlerts';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { clearAuthState } from '@/lib/auth';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config';
import Link from 'next/link';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { createPortal } from 'react-dom';

export default function SuperadminNavigationShellHeader({ onMenuClick, menuExpanded }: SuperadminNavigationHeaderProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const router = useRouter();
  const { notifOpen, setNotifOpen, notifRef, notificationButtonRef } = useSuperadminNavigationShellHeaderMenus();
  const [showLogout, setShowLogout] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const logoutTriggerRef = useRef<HTMLButtonElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  return (
    <header className="sa-header">

      {/* ─── Left: Hamburger + Search ─── */}
      <div className="flex items-center gap-4">
        <button type="button" className="sa-mobile-menu-btn" onClick={onMenuClick} aria-label={t('COPY.TOGGLE_NAVIGATION_MENU')} aria-expanded={menuExpanded} aria-controls="superadmin-primary-navigation" data-testid="superadmin-navigation-header-toggle-menu-1">
          <Menu size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="sa-header-search group relative text-left"
          onClick={() => window.dispatchEvent(new CustomEvent(SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT))}
          aria-haspopup="dialog"
          aria-label={t('COPY.OPEN_COMMAND_PALETTE')}
          data-testid="superadmin-navigation-header-open-command-palette-2">
          <Search size={16} aria-hidden="true" className="text-secondary group-hover:text-primary motion-safe:transition-colors shrink-0" />
          <span className="sa-command-palette-trigger-label text-sm text-secondary w-full truncate">{t('COPY.SEARCH_OR_JUMP_TO')}</span>
          <span className="sa-command-palette-trigger-shortcut absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 bg-card border border-border rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-xs font-medium text-secondary">Ctrl K</span>
          </span>
        </button>
      </div>

      {/* ─── Right: Theme + Notifs + Account + Logout ─── */}
      <div className="sa-header-right">

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button ref={notificationButtonRef} type="button"
            className="sa-header-notif-btn"
            aria-label={t('COPY.OPEN_SAMPLE_SYSTEM_ALERTS')} aria-expanded={notifOpen} aria-controls="superadmin-notifications-dropdown"
            onClick={() => setNotifOpen(!notifOpen)}
            data-testid="superadmin-navigation-header-notifications-8">
            <Bell size={17} aria-hidden="true" />
            <span className="sa-header-notif-badge" />
          </button>

          {notifOpen && (
            <div id="superadmin-notifications-dropdown" role="region" aria-label={t('COPY.SAMPLE_SYSTEM_ALERTS_2')} className="sa-notif-dropdown">
              <div className="sa-notif-dropdown-header">
                <div>
                  <h4 className="sa-notif-title">{t('COPY.SAMPLE_SYSTEM_ALERTS')}</h4>
                  <p className="sa-notif-subtitle">{SUPERADMIN_NAVIGATION_PREVIEW_ALERTS.length} {t('COPY.SAMPLE_ALERTS')}</p>
                </div>
                <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" disabled data-testid="superadmin-navigation-header-mark-read-9">{t('COPY.MARK_READ')}</button>
              </div>
              <div className="sa-notif-list">
                {SUPERADMIN_NAVIGATION_PREVIEW_ALERTS.map((alert) => {
                  const Icon = alert.tone === 'success' ? CheckCircle : alert.tone === 'danger' ? AlertTriangle : Zap;
                  return (
                    <div key={alert.id} className={`sa-notif-item${alert.unread ? ' sa-notif-item--unread' : ''}`}>
                      <div className={`sa-notif-item-icon sa-notif-item-icon--${alert.tone}`}>
                        <Icon size={14} aria-hidden="true" />
                      </div>
                      <div className="sa-notif-item-content">
                        <p className="sa-notif-item-title">{t(alert.titleKey)}</p>
                        <p className="sa-notif-item-time">{t(alert.timeKey)}</p>
                      </div>
                      {alert.unread && <div className="sa-notif-unread-dot" aria-label={t('COPY.UNREAD_SAMPLE_ALERT')} />}
                    </div>
                  );
                })}
              </div>
              <div className="sa-notif-dropdown-footer">
                <button type="button" className="sa-panel-view-all" disabled data-testid="superadmin-navigation-header-view-logs-10">{t('COPY.VIEW_ALL_LOGS')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Account Avatar */}
        <div className="relative" ref={accountRef}>
          <button
            type="button"
            className="sa-header-account-btn"
            onClick={() => setAccountOpen(o => !o)}
            aria-expanded={accountOpen}
            aria-label={t('COPY.SUPER_ADMIN')}
            data-testid="superadmin-navigation-header-account-11">
            <div className="sa-header-avatar-icon">{t('COPY.SA')}</div>
            <div className="sa-header-account-info hidden md:block">
              <p className="sa-header-avatar-name">{t('COPY.SUPER_ADMIN')}</p>
              <p className="sa-header-avatar-role">{t('COPY.PLATFORM_OWNER')}</p>
            </div>
          </button>

          {accountOpen && (
            <div className="sa-header-account-dropdown" role="menu">
              <Link href={SUPERADMIN_NAVIGATION_ROUTES.profile_overview} className="sa-header-account-item" onClick={() => setAccountOpen(false)} data-testid="superadmin-navigation-header-profile-12">
                <div className="sa-header-avatar-icon" style={{ width: 28, height: 28, fontSize: 10 }}>{t('COPY.SA')}</div>
                <div>
                  <p className="sa-header-avatar-name">{t('COPY.SUPER_ADMIN')}</p>
                  <p className="sa-header-avatar-role">{t('COPY.PLATFORM_OWNER')}</p>
                </div>
              </Link>
              <div className="sa-header-account-divider" />
              <button
                type="button"
                className="sa-header-account-item sa-header-account-item--danger"
                onClick={(e) => { logoutTriggerRef.current = e.currentTarget as HTMLButtonElement; setAccountOpen(false); setShowLogout(true); }}
                data-testid="superadmin-navigation-header-logout-13">
                <LogOut size={15} aria-hidden="true" />
                <span>{t('COPY.LOG_OUT')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirm modal */}
      {showLogout && typeof document !== 'undefined' && createPortal(
        <div className="sa-wizard-modal-overlay sa-logout-overlay" onClick={() => setShowLogout(false)}>
          <section
            className="sa-wizard-modal sa-logout-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="superadmin-logout-title"
            aria-describedby="superadmin-logout-description"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); setShowLogout(false); } }}
            data-testid="superadmin-superadmin-navigation-shell-sidebar-section-line-75">
            <h2 id="superadmin-logout-title" className="sa-wizard-modal-title">{t('COPY.LOG_OUT_2')}</h2>
            <p id="superadmin-logout-description" className="sa-wizard-modal-desc">{t('COPY.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT_OF_THE_SUPER_ADMIN_PANEL')}</p>
            <div className="sa-logout-actions">
              <button type="button" className="sa-btn-ghost" autoFocus onClick={() => setShowLogout(false)}>{t('COPY.CANCEL')}</button>
              <button type="button" className="sa-btn-ghost sa-btn-ghost--danger" onClick={() => { clearAuthState(); router.push(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_URLS.AUTH_LOGIN); }}>{t('COPY.LOG_OUT')}</button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </header>
  );
}
