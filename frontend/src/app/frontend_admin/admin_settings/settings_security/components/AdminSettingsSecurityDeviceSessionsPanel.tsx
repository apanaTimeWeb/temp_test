'use client';
// RESPONSIBILITY: AdminSecurityDeviceSessionsPanel component owned by admin_security; responsibility folder: admin_security_device_sessions_panel.

import { useTranslations } from 'next-intl';
import { ADMIN_SECURITY_DEVICE_SESSION_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';

/** Renders synthetic device sessions; each revocation action explicitly reports the missing live contract. */
export default function AdminSecurityDeviceSessionsPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  return (
    <section className="admin-card p-6" aria-labelledby="admin-security-device-sessions-title">
      <h2 id="admin-security-device-sessions-title" className="text-section-title font-semibold text-text-primary">{t('DEVICE_SESSIONS_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('DEVICE_SESSIONS_DESCRIPTION')}</p>
      <div className="mt-4 space-y-3 md:hidden">
        {ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.map((device) => (
          <article key={device.id} className="rounded-lg border border-border p-4">
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div><dt className="text-text-secondary">{t('COLUMN_MANAGER')}</dt><dd className="text-text-primary">{t(device.managerKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_DEVICE')}</dt><dd className="text-text-primary">{t(device.deviceKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_LOCATION_IP')}</dt><dd className="break-words text-text-primary">{t(device.locationKey)} ({device.ip})</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_FIRST_SEEN')}</dt><dd className="text-text-primary">{t(device.dateKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_ACTION')}</dt><dd><button type="button" className="admin-btn-ghost-danger min-h-11" disabled aria-describedby={`admin-security-revoke-help-${device.id}`}>{t('REVOKE')}</button><p id={`admin-security-revoke-help-${device.id}`} className="mt-1 text-sm text-text-secondary">{t('SESSION_REVOKE_BLOCKED')}</p></dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-190 text-left text-sm"><thead className="bg-surface-highlight text-text-secondary"><tr><th scope="col" className="p-3">{t('COLUMN_MANAGER')}</th><th scope="col" className="p-3">{t('COLUMN_DEVICE')}</th><th scope="col" className="p-3">{t('COLUMN_LOCATION_IP')}</th><th scope="col" className="p-3">{t('COLUMN_FIRST_SEEN')}</th><th scope="col" className="p-3">{t('COLUMN_ACTION')}</th></tr></thead><tbody>
          {ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.map((device) => <tr key={device.id} className="border-b border-border last:border-b-0"><td className="p-3 text-text-primary">{t(device.managerKey)}</td><td className="p-3 text-text-primary">{t(device.deviceKey)}</td><td className="p-3 text-text-secondary">{t(device.locationKey)} ({device.ip})</td><td className="p-3 text-text-secondary">{t(device.dateKey)}</td><td className="p-3"><button type="button" data-testid={`admin_security-AdminSettingsSecurityMain-control-revoke-${device.id}`} className="admin-btn-ghost-danger min-h-11" disabled aria-describedby="admin-security-session-revoke-help" title={t('SESSION_REVOKE_BLOCKED')}>{t('REVOKE')}</button></td></tr>)}
        </tbody></table>
        <p id="admin-security-session-revoke-help" className="mt-3 text-sm text-text-secondary" role="note">{t('SESSION_REVOKE_BLOCKED')}</p>
      </div>
    </section>
  );
}
