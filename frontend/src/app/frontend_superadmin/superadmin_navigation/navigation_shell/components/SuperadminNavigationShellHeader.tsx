'use client';
/** Responsibility: Superadmin Shell Header; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: role shell navigation state and typed callbacks -> header controls and menu triggers -> sidebar/command-palette state updates owned by the shell; no business mutation occurs here. */
import type { SuperadminNavigationHeaderProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import { useSuperadminNavigationShellHeaderMenus } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellHeaderMenus';
import { SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, Plus, Server, Zap, ChevronDown, UserPlus, Building, Ticket, Globe, List } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SUPERADMIN_NAVIGATION_PREVIEW_ALERTS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/mocks/fixtures/SuperadminNavigationShellPreviewAlerts';
import { useTranslations } from 'next-intl';

/**
 * Renders the `superadmin_navigation` view owned by `SuperadminNavigationShellHeader`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminNavigationShellHeader({ onMenuClick, menuExpanded, density, onDensityChange }: SuperadminNavigationHeaderProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const { notifOpen, setNotifOpen, quickAddOpen, setQuickAddOpen, notifRef, quickAddRef, notificationButtonRef, quickAddButtonRef } = useSuperadminNavigationShellHeaderMenus();

  return (
    <header className="sa-header">

      {/* ─── Left Section: Hamburger + Search + Badges ─── */}
      <div className="flex items-center gap-4">
        <button type="button" className="sa-mobile-menu-btn" onClick={onMenuClick} title={t("COPY.TOGGLE_MENU")} aria-label={t("COPY.TOGGLE_NAVIGATION_MENU")} aria-expanded={menuExpanded} aria-controls="superadmin-primary-navigation" data-testid="superadmin-navigation-header-toggle-menu-1">
          <Menu size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="sa-header-search group relative text-left"
          onClick={() => window.dispatchEvent(new CustomEvent(SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT))}
          aria-haspopup="dialog"
          aria-label={t('COPY.OPEN_COMMAND_PALETTE')}
         data-testid="superadmin-navigation-header-open-command-palette-2">
          <Search size={16} aria-hidden="true" className="text-secondary group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none shrink-0" />
          <span className="sa-command-palette-trigger-label text-sm text-secondary w-full truncate">{t('COPY.SEARCH_OR_JUMP_TO')}</span>
          <span className="sa-command-palette-trigger-shortcut absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 bg-card border border-border rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-xs font-medium text-secondary">Ctrl K</span>
          </span>
        </button>

        {/* Environment Badges - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center gap-2 ml-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning-bg border border-border text-warning">
            <Server size={12} />
            <span className="text-xs font-bold uppercase tracking-wider">{t("COPY.ENVIRONMENT_UNKNOWN")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-subtle border border-border text-primary">
            <Globe size={12} />
            <span className="text-xs font-bold uppercase tracking-wider">{t("COPY.GLOBAL_SCOPE")}</span>
          </div>
        </div>
      </div>

      {/* ─── Right Section: Quick Action + Health Ping + Theme + Notifs ─── */}
      <div className="sa-header-right">

        {/* Quick Add Dropdown */}
        <div className="relative hidden md:block" ref={quickAddRef}>
          <button ref={quickAddButtonRef} type="button"
            className="sa-btn-primary flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            aria-label={t("COPY.CREATE_MENU")} aria-expanded={quickAddOpen} aria-controls="superadmin-quick-add-menu"
           data-testid="superadmin-navigation-header-create-menu-3">
            <Plus size={14} /> {t("COPY.CREATE")} <ChevronDown size={14} />
          </button>

          {quickAddOpen && (
            <div id="superadmin-quick-add-menu" role="region" aria-label={t("COPY.UNAVAILABLE_QUICK_CREATE_ACTIONS")} className="absolute top-full right-0 mt-3 w-48 bg-card border border-border rounded-xl shadow-2xl py-2 z-30 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none motion-safe:slide-in-from-top-2">
              <button type="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary opacity-60 cursor-not-allowed" disabled title={t("COPY.UNAVAILABLE_INTEGRATION_CONTRACT_IS_NOT_INCLUDED_IN_THIS_SOURCE_PACKAGE")} data-testid="superadmin-navigation-header-unavailable-integration-contract-is-not-included-in-this-source-package-4">
                <Building size={16} className="text-success" /> {t("COPY.ONBOARD_TENANT")}
              </button>
              <button type="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary opacity-60 cursor-not-allowed" disabled title={t("COPY.UNAVAILABLE_INTEGRATION_CONTRACT_IS_NOT_INCLUDED_IN_THIS_SOURCE_PACKAGE")} data-testid="superadmin-navigation-header-unavailable-integration-contract-is-not-included-in-this-source-package-5">
                <UserPlus size={16} className="text-info" /> {t("COPY.PROVISION_ADMIN")}
              </button>
              <button type="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary opacity-60 cursor-not-allowed" disabled title={t("COPY.UNAVAILABLE_INTEGRATION_CONTRACT_IS_NOT_INCLUDED_IN_THIS_SOURCE_PACKAGE")} data-testid="superadmin-navigation-header-unavailable-integration-contract-is-not-included-in-this-source-package-6">
                <Ticket size={16} className="text-warning" /> {t("COPY.ISSUE_PROMO_CODE")}
              </button>
            </div>
          )}
        </div>

        {/* System Health Mini-Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border-r border-border mr-1">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
          </span>
          <span className="text-xs font-bold text-secondary tracking-wider">{t("COPY.API_STATUS_UNAVAILABLE")}</span>
        </div>

        <button
          type="button"
          className="sa-btn-icon"
          onClick={() => onDensityChange(density === 'compact' ? 'comfortable' : 'compact')}
          title={t(density === 'compact' ? 'COPY.SWITCH_TO_COMFORTABLE_DENSITY' : 'COPY.SWITCH_TO_COMPACT_DENSITY')}
          aria-label={t(density === 'compact' ? 'COPY.SWITCH_TO_COMFORTABLE_DENSITY' : 'COPY.SWITCH_TO_COMPACT_DENSITY')}
          aria-pressed={density === 'compact'}
         data-testid="superadmin-navigation-header-on-density-change-7">
          <List size={17} aria-hidden="true" />
          <span className="sr-only">{t(density === 'compact' ? 'COPY.COMPACT_DENSITY' : 'COPY.COMFORTABLE_DENSITY')}</span>
        </button>
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button ref={notificationButtonRef} type="button"
            className="sa-header-notif-btn"
            title={t("COPY.NOTIFICATIONS")}
            aria-label={t("COPY.OPEN_SAMPLE_SYSTEM_ALERTS")} aria-expanded={notifOpen} aria-controls="superadmin-notifications-dropdown"
            onClick={() => setNotifOpen(!notifOpen)}
           data-testid="superadmin-navigation-header-notifications-8">
            <Bell size={17} aria-hidden="true" />
            <span className="sa-header-notif-badge" />
          </button>

          {notifOpen && (
            <div id="superadmin-notifications-dropdown" role="region" aria-label={t("COPY.SAMPLE_SYSTEM_ALERTS_2")} className="sa-notif-dropdown">
              <div className="sa-notif-dropdown-header">
                <div>
                  <h4 className="sa-notif-title">{t("COPY.SAMPLE_SYSTEM_ALERTS")}</h4>
                  <p className="sa-notif-subtitle">{SUPERADMIN_NAVIGATION_PREVIEW_ALERTS.length} {t("COPY.SAMPLE_ALERTS")}</p>
                </div>
                <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" disabled title={t("COPY.NOTIFICATIONS_ARE_SAMPLE_DATA_IN_THIS_SOURCE_PACKAGE")} data-testid="superadmin-navigation-header-notifications-are-sample-data-in-this-source-package-9">{t("COPY.MARK_READ")}</button>
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
                      {alert.unread && <div className="sa-notif-unread-dot" aria-label={t("COPY.UNREAD_SAMPLE_ALERT")} />}
                    </div>
                  );
                })}
              </div>
              <div className="sa-notif-dropdown-footer">
                <button type="button" className="sa-panel-view-all" disabled title={t("COPY.AUDIT_LOG_ROUTE_API_CONTRACT_IS_NOT_SUPPLIED")} data-testid="superadmin-navigation-header-audit-log-route-api-contract-is-not-supplied-10">{t("COPY.VIEW_ALL_LOGS")}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
