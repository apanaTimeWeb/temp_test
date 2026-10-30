'use client';
// RESPONSIBILITY: AdminStaffDirectoryAuditSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_audit_section.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminStaffDirectoryTab } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import {
  ADMIN_STAFF_DIRECTORY_ACTIVITY_FIXTURES,
  ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES,
  ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES,
} from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import type { AdminStaffDirectoryAuditSectionProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


/** Renders explicitly synthetic audit/activity panels only in demo mode; no API-backed audit endpoint is inferred. */
export default function AdminStaffDirectoryAuditSection({ tab }: AdminStaffDirectoryAuditSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsPageSize, setSessionsPageSize] = useState(10);
  const paginatedSessions = useMemo(
    () => ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES.slice(sessionsPage * sessionsPageSize, (sessionsPage + 1) * sessionsPageSize),
    [sessionsPage, sessionsPageSize]
  );

  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const paginatedHistory = useMemo(
    () => ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES.slice(historyPage * historyPageSize, (historyPage + 1) * historyPageSize),
    [historyPage, historyPageSize]
  );

  if (tab === 'sessions') return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('SESSION_TITLE')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              <th scope="col" className="p-3">{t('SESSION_COLUMN_MANAGER')}</th>
              <th scope="col" className="p-3">{t('SESSION_COLUMN_DEVICE')}</th>
              <th scope="col" className="p-3">{t('SESSION_COLUMN_IP')}</th>
              <th scope="col" className="p-3">{t('SESSION_COLUMN_LAST_ACTIVE')}</th>
              <th scope="col" className="p-3 text-right">{t('SESSION_COLUMN_ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSessions.map((session) => (
              <tr key={session.managerName} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                <th scope="row" className="p-3 font-medium text-text-primary">{session.managerName}</th>
                <td className="p-3">{session.operatingSystem}</td>
                <td className="p-3">{session.ipAddress}</td>
                <td className="p-3">{t(session.timeKey)}</td>
                <td className="p-3 text-right">
                  <button type="button" disabled title={t('ROW_ACTIONS_BLOCKED')} className="min-h-11 cursor-not-allowed rounded-md px-3 text-text-disabled">{t('SESSION_REVOKE')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES.length > 0 && (
        <AdminTablePagination
          page={sessionsPage}
          pageSize={sessionsPageSize}
          totalCount={ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES.length}
          onPageChange={setSessionsPage}
          onPageSizeChange={(newSize) => {
            setSessionsPageSize(newSize);
            setSessionsPage(0);
          }}
        />
      )}
    </section>
  );

  if (tab === 'history') return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('HISTORY_TITLE')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              <th scope="col" className="p-3">{t('HISTORY_COLUMN_MANAGER')}</th>
              <th scope="col" className="p-3">{t('HISTORY_COLUMN_DATETIME')}</th>
              <th scope="col" className="p-3">{t('HISTORY_COLUMN_STATUS')}</th>
              <th scope="col" className="p-3">{t('HISTORY_COLUMN_LOCATION')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((entry) => (
              <tr key={`${entry.managerName}-${entry.timeKey}`} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                <th scope="row" className="p-3 font-medium text-text-primary">{entry.managerName}</th>
                <td className="p-3">{t(entry.timeKey)}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.statusKey === 'STATUS_SUCCESS' ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>{t(entry.statusKey)}</span>
                </td>
                <td className="p-3">{entry.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES.length > 0 && (
        <AdminTablePagination
          page={historyPage}
          pageSize={historyPageSize}
          totalCount={ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES.length}
          onPageChange={setHistoryPage}
          onPageSizeChange={(newSize) => {
            setHistoryPageSize(newSize);
            setHistoryPage(0);
          }}
        />
      )}
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
