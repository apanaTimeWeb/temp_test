'use client';
// RESPONSIBILITY: AdminStaffDirectoryAuditSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_audit_section.

import { useTranslations } from 'next-intl';
import type { AdminStaffDirectoryTab } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import {
  ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES,
  ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES,
  ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES,
} from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import type { AdminStaffDirectoryAuditSectionProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';


/** Renders explicitly synthetic audit/activity panels only in demo mode; no API-backed audit endpoint is inferred. */
export default function AdminStaffDirectoryAuditSection({ tab }: AdminStaffDirectoryAuditSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');

  if (tab === 'sessions') return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('SESSION_TITLE')}</h2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-highlight text-text-secondary"><tr>
        <th scope="col" className="p-3">{t('SESSION_COLUMN_MANAGER')}</th><th scope="col" className="p-3">{t('SESSION_COLUMN_DEVICE')}</th><th scope="col" className="p-3">{t('SESSION_COLUMN_IP')}</th><th scope="col" className="p-3">{t('SESSION_COLUMN_LAST_ACTIVE')}</th><th scope="col" className="p-3">{t('SESSION_COLUMN_ACTION')}</th>
      </tr></thead><tbody>{ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES.map((session) => <tr key={session.managerName} className="border-t border-border">
        <th scope="row" className="p-3 font-medium text-text-primary">{session.managerName}</th><td className="p-3">{session.operatingSystem}</td><td className="p-3">{session.ipAddress}</td><td className="p-3">{t(session.timeKey)}</td><td className="p-3"><button type="button" disabled title={t('ROW_ACTIONS_BLOCKED')} className="min-h-11 cursor-not-allowed rounded-md px-3 text-text-disabled">{t('SESSION_REVOKE')}</button></td>
      </tr>)}</tbody></table></div>
    </section>
  );

  if (tab === 'history') return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('HISTORY_TITLE')}</h2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-highlight text-text-secondary"><tr>
        <th scope="col" className="p-3">{t('HISTORY_COLUMN_MANAGER')}</th><th scope="col" className="p-3">{t('HISTORY_COLUMN_DATETIME')}</th><th scope="col" className="p-3">{t('HISTORY_COLUMN_STATUS')}</th><th scope="col" className="p-3">{t('HISTORY_COLUMN_LOCATION')}</th>
      </tr></thead><tbody>{ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES.map((entry) => <tr key={`${entry.managerName}-${entry.timeKey}`} className="border-t border-border">
        <th scope="row" className="p-3 font-medium text-text-primary">{entry.managerName}</th><td className="p-3">{t(entry.timeKey)}</td><td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.statusKey === 'STATUS_SUCCESS' ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>{t(entry.statusKey)}</span></td><td className="p-3">{entry.location}</td>
      </tr>)}</tbody></table></div>
    </section>
  );

  return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('ACTIVITY_TITLE')}</h2>
      <div className="divide-y divide-border">{ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES.map((entry) => <article key={`${entry.timeKey}-${entry.actionKey}`} className="p-4">
        <p className="text-text-primary">{t(entry.actionKey)}</p><p className="mt-1 text-sm text-text-secondary">{t('PERFORMED_BY', { name: entry.managerName })}</p><time className="mt-1 block text-xs text-text-secondary">{t(entry.timeKey)}</time>
      </article>)}</div>
    </section>
  );
}
