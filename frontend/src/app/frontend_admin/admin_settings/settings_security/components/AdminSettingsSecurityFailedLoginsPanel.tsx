'use client';
// RESPONSIBILITY: AdminSecurityFailedLoginsPanel component owned by admin_security; responsibility folder: admin_security_failed_logins_panel.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ADMIN_SECURITY_FAILED_LOGIN_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

/** Renders demo-only failed-login samples as a semantic, horizontally scrollable table. */
export default function AdminSecurityFailedLoginsPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  type LoginSortField = 'timeKey' | 'account' | 'ip' | 'reasonKey';
  const [sortField, setSortField] = useState<LoginSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: LoginSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const sortedLogins = useMemo(() => {
    if (!sortField) return ADMIN_SECURITY_FAILED_LOGIN_FIXTURES;
    return [...ADMIN_SECURITY_FAILED_LOGIN_FIXTURES].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sortField, sortDirection]);

  const paginatedLogins = useMemo(
    () => sortedLogins.slice(page * pageSize, (page + 1) * pageSize),
    [sortedLogins, page, pageSize]
  );

  const renderSortableHeader = (field: LoginSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3 whitespace-nowrap">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
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
  };

  return (
    <section className="admin-card p-6" aria-labelledby="admin-security-failed-logins-title">
      <h2 id="admin-security-failed-logins-title" className="text-section-title font-semibold text-text-primary">{t('FAILED_LOGINS_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('DEMO_DATA_NOTICE')}</p>
      <div className="mt-4 space-y-3 md:hidden">
        {ADMIN_SECURITY_FAILED_LOGIN_FIXTURES.map((event) => (
          <article key={event.id} className="rounded-lg border border-border p-4">
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div><dt className="text-text-secondary">{t('COLUMN_TIME')}</dt><dd className="text-text-primary">{t(event.timeKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_ACCOUNT')}</dt><dd className="break-words text-text-primary">{event.account}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_IP')}</dt><dd className="break-all text-text-primary">{event.ip}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_REASON')}</dt><dd><span className="admin-badge admin-badge-danger">{t(event.reasonKey)}</span></dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-155 text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderSortableHeader('timeKey', t('COLUMN_TIME'))}
              {renderSortableHeader('account', t('COLUMN_ACCOUNT'))}
              {renderSortableHeader('ip', t('COLUMN_IP'))}
              {renderSortableHeader('reasonKey', t('COLUMN_REASON'))}
            </tr>
          </thead>
          <tbody>
            {paginatedLogins.map((event) => (
              <tr key={event.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                <td className="p-3 text-text-primary">{t(event.timeKey)}</td>
                <td className="p-3 text-text-primary">{event.account}</td>
                <td className="p-3 text-text-secondary">{event.ip}</td>
                <td className="p-3"><span className="admin-badge admin-badge-danger">{t(event.reasonKey)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {ADMIN_SECURITY_FAILED_LOGIN_FIXTURES.length > 0 && (
          <AdminTablePagination
            page={page}
            pageSize={pageSize}
            totalCount={ADMIN_SECURITY_FAILED_LOGIN_FIXTURES.length}
            onPageChange={setPage}
            onPageSizeChange={(newSize: number) => {
              setPageSize(newSize);
              setPage(0);
            }}
          />
        )}
      </div>
    </section>
  );
}
