import useAdminSecurityTabState from '@/app/frontend_admin/admin_settings/settings_security/hooks/useAdminSettingsSecurityTabState';
import { useTranslations } from 'next-intl';
import { LogOut, MonitorSmartphone, Lock, Unlock, UserRoundCheck, UserRoundX } from 'lucide-react';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { ADMIN_SECURITY_EVENT_FILTERS, ADMIN_SECURITY_NAV_ITEMS } from '@/app/frontend_admin/admin_settings/settings_security/config/admin_settings_security.url_config';
import { ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES, ADMIN_SECURITY_EVENT_FIXTURES, ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import { filterAdminSecurityEvents } from '@/app/frontend_admin/admin_settings/settings_security/utils/AdminSettingsSecurityEventUtils';
import type { AdminSecurityEventFilter } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminSecurityDashboardPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityDashboardPanel';
import AdminSecurityFailedLoginsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityFailedLoginsPanel';
import AdminSecurityDeviceSessionsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityDeviceSessionsPanel';

// Responsibility: AdminSecurityPage presentation component owned by admin_security; responsibility folder: admin_security_components_views.
"use client";

// RESPONSIBILITY: Owns security-tab selection and delegates each major screen to a feature-local panel.
// DATA FLOW: route -> local selected tab -> module-owned demo panel, or a single contract-blocked terminal state.

/** Renders exactly one tab panel and hides synthetic records unless explicit frontend demo mode is enabled. */
export default function AdminSecurityPage() {
  const t = useTranslations('ADMIN_SECURITY');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [activeTab, setActiveTab] = useAdminSecurityTabState();
  const [eventFilter, setEventFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminSecurityEventFilter>('eventFilter', 'all', { validValues: ['all', 'password', 'account', '2fa', 'session'] });
  const visibleSecurityEvents = filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, eventFilter);
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-6">
      {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE_NOTICE')}</p>}
      <header><h1 className="text-page-title font-bold text-text-primary">{t('PAGE_TITLE')}</h1><p className="mt-1 text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p></header>
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label={t('NAV_LABEL')} className="admin-card flex gap-2 overflow-x-auto lg:flex-col">
          {ADMIN_SECURITY_NAV_ITEMS.map(({ id, labelKey, icon: Icon }) => (
            <button key={id} type="button" data-testid={`admin_security-AdminSecurityNavigation-tab-${id}`} aria-current={activeTab === id ? 'page' : undefined} aria-pressed={activeTab === id} onClick={() => setActiveTab(id)} className={`admin-tab-button min-h-11 shrink-0 ${activeTab === id ? 'admin-tab-button-active' : ''}`}>
              <Icon size={18} strokeWidth={2} className={activeTab === id ? 'text-primary' : 'text-text-secondary'} aria-hidden="true" />
              {t(labelKey)}
            </button>
          ))}
        </nav>
        <div className="min-w-0">{!isDemoMode ? <section data-testid="admin_security-AdminSettingsSecurityMain-state-api-unavailable" className="admin-card p-6" role="status" aria-live="polite"><h2 className="text-section-title font-semibold text-text-primary">{t('LIVE_UNAVAILABLE_TITLE')}</h2><p className="mt-2 text-text-secondary">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p></section> : <>
          {activeTab === 'dashboard' && <AdminSecurityDashboardPanel />}
          {activeTab === 'login-security' && <section className="admin-card p-6" aria-labelledby="admin-security-policy-title">
            <h2 id="admin-security-policy-title" className="text-section-title font-semibold text-text-primary">{t('LOGIN_SECURITY_TITLE')}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t('LOGIN_SECURITY_DESCRIPTION')}</p>
            <div className="mt-5 space-y-3">
              <article className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"><div><h3 className="font-semibold text-text-primary">{t('POLICY_PASSWORD_TITLE')}</h3><p className="mt-1 text-sm text-text-secondary">{t('POLICY_PASSWORD_DESCRIPTION')}</p></div><button type="button" data-testid="admin_security-AdminSettingsSecurityMain-control-edit-password-policy" className="admin-btn-ghost min-h-11" disabled title={t('POLICY_CHANGE_BLOCKED')}>{t('EDIT_POLICY')}</button></article>
              <article className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"><div><h3 className="font-semibold text-text-primary">{t('POLICY_TWO_FACTOR_TITLE')}</h3><p className="mt-1 text-sm text-text-secondary">{t('POLICY_TWO_FACTOR_DESCRIPTION')}</p></div><span data-testid="admin_security-AdminSettingsSecurityMain-state-two-factor-policy" className="admin-badge">{t('POLICY_SAMPLE_ENFORCED')}</span></article>
              <article className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"><div><h3 className="font-semibold text-text-primary">{t('POLICY_SESSION_TIMEOUT_TITLE')}</h3><p className="mt-1 text-sm text-text-secondary">{t('POLICY_SESSION_TIMEOUT_DESCRIPTION')}</p></div><button type="button" data-testid="admin_security-AdminSettingsSecurityMain-control-edit-session-policy" className="admin-btn-ghost min-h-11" disabled title={t('POLICY_CHANGE_BLOCKED')}>{t('EDIT')}</button></article>
            </div>
          </section>}
          {activeTab === 'active-sessions' && <section className="admin-card p-6" aria-labelledby="admin-security-active-sessions-title">
            <h2 id="admin-security-active-sessions-title" className="text-section-title font-semibold text-text-primary">{t('ACTIVE_SESSIONS_TITLE')}</h2><p className="mt-1 text-sm text-text-secondary">{t('DEMO_DATA_NOTICE')}</p>
            <div className="mt-4 space-y-3">{ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES.map((session) => <article key={session.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex min-w-0 items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary" aria-hidden="true"><MonitorSmartphone size={18} strokeWidth={2} /></div><div className="min-w-0"><h3 className="font-semibold text-text-primary">{t(session.nameKey)} <span className="admin-badge">{t(session.roleKey)}</span></h3><p className="mt-1 break-words text-sm text-text-secondary">{t(session.deviceKey)} · {t('IP_LABEL')}: {session.ip}</p>{session.current && <span className="mt-2 inline-block admin-badge admin-badge-success">{t('CURRENT_SESSION')}</span>}</div></div>
              {!session.current && <button type="button" data-testid={`admin_security-AdminSettingsSecurityMain-control-revoke-${session.id}`} className="admin-btn-ghost-danger min-h-11" disabled title={t('SESSION_REVOKE_BLOCKED')}><LogOut size={18} strokeWidth={2} aria-hidden="true" /> {t('FORCE_LOGOUT')}</button>}
            </article>)}</div>
          </section>}
          {activeTab === 'failed-logins' && <AdminSecurityFailedLoginsPanel />}
          {activeTab === 'blocked-users' && <AdminSecurityBlockedUsersPanel />}
          {activeTab === 'device-sessions' && <AdminSecurityDeviceSessionsPanel />}
          {activeTab === 'events' && <section className="admin-card p-6" aria-labelledby="security-events-title">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="security-events-title" className="text-section-title font-semibold text-text-primary">{t('EVENTS_TITLE')}</h2><p className="mt-1 text-sm text-text-secondary">{t('DEMO_DATA_NOTICE')}</p></div>
              <div className="flex flex-wrap items-center gap-2"><label htmlFor="security-event-filter" className="text-sm text-text-secondary">{t('FILTER_EVENTS_LABEL')}</label><select id="security-event-filter" data-testid="admin_security-AdminSecurityEventsAuditPanel-control-001" className="admin-input min-h-11" value={eventFilter} onChange={(event) => setEventFilter(event.target.value as AdminSecurityEventFilter)}>{ADMIN_SECURITY_EVENT_FILTERS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}</select></div>
            </div><div className="mt-4 space-y-3">{visibleSecurityEvents.length === 0 ? <p role="status" className="p-4 text-text-secondary">{t('EVENTS_EMPTY')}</p> : visibleSecurityEvents.map((event) => <article key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"><div className="min-w-0"><p className={`font-semibold ${event.tone === 'info' ? 'text-info-text' : event.tone === 'danger' ? 'text-danger-text' : event.tone === 'success' ? 'text-success-text' : 'text-warning-text'}`}>{t(event.actionKey)}</p><p className="mt-1 text-sm text-text-primary">{t(event.userKey)}</p></div><p className="text-sm text-text-secondary">{t(event.timeKey)}</p></article>)}</div>
          </section>}
        </>}</div>
      </div>
    </div>
  );
}

// RESPONSIBILITY: AdminSecurityBlockedUsersPanel component owned by admin_security; responsibility folder: admin_security_blocked_users_panel.
"use client";

/** Shows sample account states; lock/unlock is blocked until an approved account-management contract exists. */
export function AdminSecurityBlockedUsersPanel() {
  const t = useTranslations('ADMIN_SECURITY');

  return (
    <section className="admin-card p-6" aria-labelledby="admin-security-blocked-users-title">
      <h2 id="admin-security-blocked-users-title" className="text-section-title font-semibold text-text-primary">
        {t('BLOCKED_USERS_TITLE')}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">{t('DEMO_DATA_NOTICE')}</p>
      <div className="mt-4 space-y-3">
        {ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES.map((user) => {
          const locked = user.status === 'locked';
          const StatusIcon = locked ? UserRoundX : UserRoundCheck;

          return (
            <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${locked ? 'bg-danger-bg text-danger-text' : 'bg-success-bg text-success-text'}`}
                  aria-hidden="true"
                >
                  <StatusIcon size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary">
                    {t(user.nameKey)}{' '}
                    <span className={`admin-badge ${locked ? 'admin-badge-danger' : 'admin-badge-success'}`}>
                      {t(locked ? 'STATUS_LOCKED' : 'STATUS_ACTIVE')}
                    </span>
                  </h3>
                  <p className="mt-1 break-words text-sm text-text-secondary">
                    {user.email}
                    {locked ? ` · ${t('REASON_LABEL')}: ${t(user.reasonKey)}` : ''}
                  </p>
                </div>
              </div>
              {locked ? (
                <div className="flex flex-col items-start gap-2">
                  <button type="button" data-testid={`admin_security-AdminSettingsSecurityMain-control-unlock-${user.id}`} className="admin-btn-primary min-h-11" disabled aria-describedby={`admin-security-unlock-help-${user.id}`} title={t('ACCOUNT_UNLOCK_BLOCKED')}>
                    <Unlock size={18} strokeWidth={2} aria-hidden="true" /> {t('UNLOCK_ACCOUNT')}
                  </button>
                  <p id={`admin-security-unlock-help-${user.id}`} className="text-sm text-text-secondary" role="note">{t('ACCOUNT_UNLOCK_BLOCKED')}</p>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <button type="button" data-testid={`admin_security-AdminSettingsSecurityMain-control-lock-${user.id}`} className="admin-btn-ghost-danger min-h-11" disabled aria-describedby={`admin-security-lock-help-${user.id}`} title={t('ACCOUNT_LOCK_BLOCKED')}>
                    <Lock size={18} strokeWidth={2} aria-hidden="true" /> {t('LOCK_ACCOUNT')}
                  </button>
                  <p id={`admin-security-lock-help-${user.id}`} className="text-sm text-text-secondary" role="note">{t('ACCOUNT_LOCK_BLOCKED')}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
