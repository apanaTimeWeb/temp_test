'use client';

import { ADMIN_PROFILE_DEMO_LOGIN_HISTORY } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import { ArrowDown, ArrowUp, ArrowUpDown, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type HistorySortField = 'dateKey' | 'ip' | 'deviceKey' | 'status';

export function AdminSettingsProfileHistoryPanel() {
  const t = useTranslations('ADMIN_PROFILE');
  const [sortField, setSortField] = useState<HistorySortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: HistorySortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHistory = useMemo(() => {
    if (!sortField) return ADMIN_PROFILE_DEMO_LOGIN_HISTORY;
    return [...ADMIN_PROFILE_DEMO_LOGIN_HISTORY].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sortField, sortDirection]);

  const renderSortableHeader = (field: HistorySortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="p-3 whitespace-nowrap text-left"
      >
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
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8" aria-labelledby="admin-profile-history-title">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary shadow-card">
            <Clock size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="admin-profile-history-title" className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              {t('HISTORY_TITLE')}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {t('DEMO_ONLY_DESCRIPTION')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:hidden" aria-label={t('HISTORY_TITLE')}>
        {ADMIN_PROFILE_DEMO_LOGIN_HISTORY.map((entry) => (
          <article key={`mobile-${entry.id}`} className="rounded-xl border border-border bg-surface-highlight p-4 text-sm shadow-card space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <span className="font-semibold text-text-primary">{t(entry.dateKey)}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border ${entry.status === 'success' ? 'bg-success-bg text-success-text border-success' : 'bg-danger-bg text-danger-text border-danger'}`}>
                {t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-text-secondary">{t('HISTORY_IP')}</dt>
                <dd className="font-mono text-text-primary mt-0.5">{entry.ip}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">{t('HISTORY_DEVICE')}</dt>
                <dd className="text-text-primary mt-0.5">{t(entry.deviceKey)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-5 hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderSortableHeader('dateKey', t('HISTORY_DATE'))}
              {renderSortableHeader('ip', t('HISTORY_IP'))}
              {renderSortableHeader('deviceKey', t('HISTORY_DEVICE'))}
              {renderSortableHeader('status', t('HISTORY_STATUS'))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedHistory.map((entry) => (
              <tr key={entry.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                <td className="p-3 font-medium">{t(entry.dateKey)}</td>
                <td className="p-3 font-mono text-xs text-text-secondary">{entry.ip}</td>
                <td className="p-3">{t(entry.deviceKey)}</td>
                <td className="p-3">
                  <span data-testid={`admin_profile-AdminSettingsProfileMain-state-login-status-${entry.id}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${entry.status === 'success' ? 'bg-success-bg text-success-text border-success' : 'bg-danger-bg text-danger-text border-danger'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${entry.status === 'success' ? 'bg-success' : 'bg-danger'}`} />
                    {t(entry.status === 'success' ? 'STATUS_SUCCESS' : 'STATUS_FAILED')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
