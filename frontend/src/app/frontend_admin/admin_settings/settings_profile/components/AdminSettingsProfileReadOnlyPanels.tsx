// RESPONSIBILITY: Owns the profile overview, login-history, and sessions read-only presentation states.
'use client';

import { Camera, LogOut, Mail, MonitorSmartphone, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_PROFILE_DEMO_ACCOUNT, ADMIN_PROFILE_DEMO_LOGIN_HISTORY, ADMIN_PROFILE_DEMO_SESSIONS } from '@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures';
import type { AdminSettingsProfileReadOnlyPanelsProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';

/**
 * These three source-backed tab views are read-only illustrative panels. Consolidating their
 * markup preserves the existing `view` URL state and display/test IDs while avoiding duplicate
 * panel wrappers. No profile, login-history, or session mutation API is implied.
 */
export default function AdminSettingsProfileReadOnlyPanels({ view }: AdminSettingsProfileReadOnlyPanelsProps) {
  const t = useTranslations('ADMIN_PROFILE');

  if (view === 'profile') {
    return (
      <section className="admin-card p-6" aria-labelledby="admin-profile-overview-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-2xl font-bold text-primary" aria-hidden="true">
            {ADMIN_PROFILE_DEMO_ACCOUNT.initials}
            <button type="button" data-testid="admin_profile-AdminSettingsProfileMain-control-002" className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title={t('PHOTO_UPLOAD_BLOCKED')} aria-label={t('UPDATE_PHOTO')} disabled>
              <Camera size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <div className="min-w-0">
            <h2 id="admin-profile-overview-title" className="text-section-title font-semibold text-text-primary">{t(ADMIN_PROFILE_DEMO_ACCOUNT.nameKey)}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t('DEMO_ONLY_LABEL')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3"><Mail size={18} strokeWidth={2} className="text-text-secondary" aria-hidden="true" /><div><p className="text-caption text-text-secondary">{t('EMAIL_LABEL')}</p><p className="text-text-primary">{ADMIN_PROFILE_DEMO_ACCOUNT.email}</p></div></div>
              <div className="flex items-center gap-3"><Phone size={18} strokeWidth={2} className="text-text-secondary" aria-hidden="true" /><div><p className="text-caption text-text-secondary">{t('PHONE_LABEL')}</p><p className="text-text-primary">{ADMIN_PROFILE_DEMO_ACCOUNT.phone}</p></div></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (view === 'history') {
    return (
      <section className="admin-card p-6" aria-labelledby="admin-profile-history-title">
        <h2 id="admin-profile-history-title" className="text-section-title font-semibold text-text-primary">{t('HISTORY_TITLE')}</h2>
        <p className="mt-1 text-sm text-text-secondary">{t('DEMO_ONLY_DESCRIPTION')}</p>
        <div className="mt-4 grid gap-3 md:hidden" aria-label={t('HISTORY_TITLE')}>
          {ADMIN_PROFILE_DEMO_LOGIN_HISTORY.map((entry) => <article key={`mobile-${entry.id}`} className="rounded-lg border border-border p-4 text-sm">
            <dl className="grid gap-2"><div><dt className="text-text-secondary">{t('HISTORY_DATE')}</dt><dd>{t(entry.dateKey)}</dd></div><div><dt className="text-text-secondary">{t('HISTORY_IP')}</dt><dd>{entry.ip}</dd></div><div><dt className="text-text-secondary">{t('HISTORY_DEVICE')}</dt><dd>{t(entry.deviceKey)}</dd></div><div><dt className="text-text-secondary">{t('HISTORY_STATUS')}</dt><dd><span className={`admin-badge ${entry.status === 'success' ? 'admin-badge-success' : 'admin-badge-danger'}`}>{t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}</span></dd></div></dl>
          </article>)}
        </div>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-surface-highlight text-left text-text-secondary"><tr><th scope="col" className="px-3 py-3">{t('HISTORY_DATE')}</th><th scope="col" className="px-3 py-3">{t('HISTORY_IP')}</th><th scope="col" className="px-3 py-3">{t('HISTORY_DEVICE')}</th><th scope="col" className="px-3 py-3">{t('HISTORY_STATUS')}</th></tr></thead>
            <tbody>{ADMIN_PROFILE_DEMO_LOGIN_HISTORY.map((entry) => <tr key={entry.id} className="border-b border-border last:border-b-0"><td className="px-3 py-3">{t(entry.dateKey)}</td><td className="px-3 py-3">{entry.ip}</td><td className="px-3 py-3">{t(entry.deviceKey)}</td><td className="px-3 py-3"><span data-testid={`admin_profile-AdminSettingsProfileMain-state-login-status-${entry.id}`} className={`admin-badge ${entry.status === 'success' ? 'admin-badge-success' : 'admin-badge-danger'}`}>{t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}</span></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-card p-6" aria-labelledby="admin-profile-sessions-title">
      <h2 id="admin-profile-sessions-title" className="text-section-title font-semibold text-text-primary">{t('SESSIONS_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('DEMO_ONLY_DESCRIPTION')}</p>
      <div className="mt-4 space-y-3">
        {ADMIN_PROFILE_DEMO_SESSIONS.map((session) => (
          <article key={session.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 ${session.current ? 'border-primary bg-primary-subtle' : 'border-border bg-card'}`}>
            <div className="flex min-w-0 items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${session.current ? 'bg-primary text-on-primary' : 'bg-input text-primary'}`} aria-hidden="true"><MonitorSmartphone size={18} strokeWidth={2} /></div>
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary">{t(session.deviceKey)} {session.current && <span className="admin-badge admin-badge-success">{t('CURRENT_SESSION')}</span>}</h3>
                <p className="mt-1 break-words text-sm text-text-secondary">{t(session.browserKey)} · {t('HISTORY_IP')}: {session.ip} · {t('LAST_ACTIVE')}: {t(session.lastActiveKey)}</p>
              </div>
            </div>
            {!session.current && <button type="button" data-testid={`admin_profile-AdminSettingsProfileMain-control-revoke-${session.id}`} className="admin-btn-ghost-danger min-h-11" disabled title={t('SESSION_REVOKE_BLOCKED')}><LogOut size={18} strokeWidth={2} aria-hidden="true" /> {t('LOGOUT')}</button>}
          </article>
        ))}
      </div>
    </section>
  );
}
