'use client';
// Responsibility: AdminStaffDirectoryAuditSessionsView component owned by admin_staff_directory.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

type SessionSortField = 'managerName' | 'operatingSystem' | 'ipAddress' | 'timeKey';

export function AdminStaffDirectoryAuditSessionsView() {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const [sessionSortField, setSessionSortField] = useState<SessionSortField | null>(null);
  const [sessionSortDirection, setSessionSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsPageSize, setSessionsPageSize] = useState(10);

  const toggleSessionSort = (field: SessionSortField) => {
    setSessionsPage(0);
    if (sessionSortField === field) {
      setSessionSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSessionSortField(field);
      setSessionSortDirection('asc');
    }
  };

  const filteredSessions = useMemo(() => {
    if (!sessionSearchQuery.trim()) return ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES;
    const q = sessionSearchQuery.toLowerCase().trim();
    return ADMIN_STAFF_DIRECTORY_SESSION_FIXTURES.filter(
      (s) =>
        s.managerName.toLowerCase().includes(q) ||
        s.operatingSystem.toLowerCase().includes(q) ||
        s.ipAddress.toLowerCase().includes(q)
    );
  }, [sessionSearchQuery]);

  const sortedSessions = useMemo(() => {
    if (!sessionSortField) return filteredSessions;
    return [...filteredSessions].sort((a, b) => {
      const aVal = a[sessionSortField];
      const bVal = b[sessionSortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sessionSortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredSessions, sessionSortField, sessionSortDirection]);

  const paginatedSessions = useMemo(
    () => sortedSessions.slice(sessionsPage * sessionsPageSize, (sessionsPage + 1) * sessionsPageSize),
    [sortedSessions, sessionsPage, sessionsPageSize]
  );

  const renderSortableHeader = (
    label: string,
    active: boolean,
    direction: 'asc' | 'desc',
    onToggle: () => void
  ) => (
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
          <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
        )}
      </button>
    </th>
  );

  return (
    <section className="admin-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">{t('SESSION_TITLE')}</h2>
        <div className="relative min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={sessionSearchQuery}
            onChange={(e) => {
              setSessionSearchQuery(e.target.value);
              setSessionsPage(0);
            }}
            placeholder="Search sessions..."
            className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
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
            {paginatedSessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-text-secondary">
                  No active sessions found.
                </td>
              </tr>
            ) : (
              paginatedSessions.map((session) => (
                <tr key={session.managerName} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                  <th scope="row" className="p-3 font-medium text-text-primary">{session.managerName}</th>
                  <td className="p-3">{session.operatingSystem}</td>
                  <td className="p-3">{session.ipAddress}</td>
                  <td className="p-3">{t(session.timeKey)}</td>
                  <td className="p-3 text-right">
                    <button type="button" disabled title={t('ROW_ACTIONS_BLOCKED')} className="min-h-11 cursor-not-allowed rounded-md px-3 text-text-disabled">{t('SESSION_REVOKE')}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {sortedSessions.length > 0 && (
        <AdminTablePagination
          page={sessionsPage}
          pageSize={sessionsPageSize}
          totalCount={sortedSessions.length}
          onPageChange={setSessionsPage}
          onPageSizeChange={(newSize: number) => {
            setSessionsPageSize(newSize);
            setSessionsPage(0);
          }}
        />
      )}
    </section>
  );
}

export default AdminStaffDirectoryAuditSessionsView;

