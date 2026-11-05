'use client';
// RESPONSIBILITY: AdminStaffDirectoryAuditSection component owned by admin_staff_directory; responsibility folder: admin_staff_directory_audit_section.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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

  type SessionSortField = 'managerName' | 'operatingSystem' | 'ipAddress' | 'timeKey';
  const [sessionSortField, setSessionSortField] = useState<SessionSortField | null>(null);
  const [sessionSortDirection, setSessionSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsPageSize, setSessionsPageSize] = useState(10);

  const toggleSessionSort = (field: SessionSortField) => {
    setSessionsPage(0);
    if (sessionSortField === field) setSessionSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSessionSortField(field); setSessionSortDirection('asc'); }
  };

  const sortedSessions = useMemo(() => {
    if (!sessionSortField) return ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES;
    return [...ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES].sort((a, b) => {
      const aVal = a[sessionSortField];
      const bVal = b[sessionSortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sessionSortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sessionSortField, sessionSortDirection]);

  const paginatedSessions = useMemo(
    () => sortedSessions.slice(sessionsPage * sessionsPageSize, (sessionsPage + 1) * sessionsPageSize),
    [sortedSessions, sessionsPage, sessionsPageSize]
  );

  type HistorySortField = 'managerName' | 'timeKey' | 'statusKey' | 'location';
  const [historySortField, setHistorySortField] = useState<HistorySortField | null>(null);
  const [historySortDirection, setHistorySortDirection] = useState<'asc' | 'desc'>('asc');
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const toggleHistorySort = (field: HistorySortField) => {
    setHistoryPage(0);
    if (historySortField === field) setHistorySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setHistorySortField(field); setHistorySortDirection('asc'); }
  };

  const sortedHistory = useMemo(() => {
    if (!historySortField) return ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES;
    return [...ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES].sort((a, b) => {
      const aVal = a[historySortField];
      const bVal = b[historySortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return historySortDirection === 'asc' ? cmp : -cmp;
    });
  }, [historySortField, historySortDirection]);

  const paginatedHistory = useMemo(
    () => sortedHistory.slice(historyPage * historyPageSize, (historyPage + 1) * historyPageSize),
    [sortedHistory, historyPage, historyPageSize]
  );

  const renderSortableHeader = (label: string, active: boolean, direction: 'asc' | 'desc', onToggle: () => void) => (
    <th scope="col" aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3 whitespace-nowrap">
      <button
        type="button"
        onClick={onToggle}
        className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
        aria-label={`${label}, sort ${active ? (direction === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
      >
        <span>{label}</span>
        {active ? (
          direction === 'asc' ? (
            <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
          ) : (
            <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="text-text-secondary/40 group-hover:text-text-secondary transition-colors shrink-0" size={14} aria-hidden="true" />
        )}
      </button>
    </th>
  );

  if (tab === 'sessions') return (
    <section className="admin-card">
      <h2 className="p-4 text-lg font-semibold text-text-primary">{t('SESSION_TITLE')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderSortableHeader(t('SESSION_COLUMN_MANAGER'), sessionSortField === 'managerName', sessionSortDirection, () => toggleSessionSort('managerName'))}
              {renderSortableHeader(t('SESSION_COLUMN_DEVICE'), sessionSortField === 'operatingSystem', sessionSortDirection, () => toggleSessionSort('operatingSystem'))}
              {renderSortableHeader(t('SESSION_COLUMN_IP'), sessionSortField === 'ipAddress', sessionSortDirection, () => toggleSessionSort('ipAddress'))}
              {renderSortableHeader(t('SESSION_COLUMN_LAST_ACTIVE'), sessionSortField === 'timeKey', sessionSortDirection, () => toggleSessionSort('timeKey'))}
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
          onPageSizeChange={(newSize: number) => {
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
              {renderSortableHeader(t('HISTORY_COLUMN_MANAGER'), historySortField === 'managerName', historySortDirection, () => toggleHistorySort('managerName'))}
              {renderSortableHeader(t('HISTORY_COLUMN_DATETIME'), historySortField === 'timeKey', historySortDirection, () => toggleHistorySort('timeKey'))}
              {renderSortableHeader(t('HISTORY_COLUMN_STATUS'), historySortField === 'statusKey', historySortDirection, () => toggleHistorySort('statusKey'))}
              {renderSortableHeader(t('HISTORY_COLUMN_LOCATION'), historySortField === 'location', historySortDirection, () => toggleHistorySort('location'))}
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
          onPageSizeChange={(newSize: number) => {
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
