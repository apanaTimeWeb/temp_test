'use client';
// Responsibility: AdminStaffDirectoryAuditHistoryView component owned by admin_staff_directory.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

type HistorySortField = 'managerName' | 'timeKey' | 'statusKey' | 'location';

export function AdminStaffDirectoryAuditHistoryView() {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const [historySortField, setHistorySortField] = useState<HistorySortField | null>(null);
  const [historySortDirection, setHistorySortDirection] = useState<'asc' | 'desc'>('asc');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const toggleHistorySort = (field: HistorySortField) => {
    setHistoryPage(0);
    if (historySortField === field) setHistorySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setHistorySortField(field); setHistorySortDirection('asc'); }
  };

  const filteredHistory = useMemo(() => {
    if (!historySearchQuery.trim()) return ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES;
    const q = historySearchQuery.toLowerCase().trim();
    return ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_FIXTURES.filter(
      (h) => h.managerName.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
    );
  }, [historySearchQuery]);

  const sortedHistory = useMemo(() => {
    if (!historySortField) return filteredHistory;
    return [...filteredHistory].sort((a, b) => {
      const aVal = a[historySortField];
      const bVal = b[historySortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return historySortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredHistory, historySortField, historySortDirection]);

  const paginatedHistory = useMemo(
    () => sortedHistory.slice(historyPage * historyPageSize, (historyPage + 1) * historyPageSize),
    [sortedHistory, historyPage, historyPageSize]
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
        <h2 className="text-lg font-semibold text-text-primary">{t('HISTORY_TITLE')}</h2>
        <div className="relative min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={historySearchQuery}
            onChange={(e) => {
              setHistorySearchQuery(e.target.value);
              setHistoryPage(0);
            }}
            placeholder="Search login history..."
            className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
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
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-sm text-text-secondary">
                  No login history records found.
                </td>
              </tr>
            ) : (
              paginatedHistory.map((entry) => (
                <tr key={`${entry.managerName}-${entry.timeKey}`} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                  <th scope="row" className="p-3 font-medium text-text-primary">{entry.managerName}</th>
                  <td className="p-3">{t(entry.timeKey)}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.statusKey === 'STATUS_SUCCESS' ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>{t(entry.statusKey)}</span>
                  </td>
                  <td className="p-3">{entry.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {sortedHistory.length > 0 && (
        <AdminTablePagination
          page={historyPage}
          pageSize={historyPageSize}
          totalCount={sortedHistory.length}
          onPageChange={setHistoryPage}
          onPageSizeChange={(newSize: number) => {
            setHistoryPageSize(newSize);
            setHistoryPage(0);
          }}
        />
      )}
    </section>
  );
}

export default AdminStaffDirectoryAuditHistoryView;

