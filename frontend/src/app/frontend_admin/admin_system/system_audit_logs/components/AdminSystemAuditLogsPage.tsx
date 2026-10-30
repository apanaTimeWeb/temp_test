// RESPONSIBILITY: AdminAuditLogsPage presentation component owned by admin_audit_logs; responsibility folder: admin_audit_logs_components_views.
'use client';

import useAdminSystemAuditLogsMain from '@/app/frontend_admin/admin_system/system_audit_logs/hooks/useAdminSystemAuditLogsMain';
import AdminAuditLogsFilters from '@/app/frontend_admin/admin_system/system_audit_logs/components/AdminSystemAuditLogsFilters';
import { Shield } from 'lucide-react';
import AdminAuditLogsRecordsPanel from '@/app/frontend_admin/admin_system/system_audit_logs/components/AdminSystemAuditLogsRecordsPanel';

/** Owns audit-log query and view filtering only; major page sections are feature-local presentation components. */
export default function AdminAuditLogsPage() {
  const {
    t, filter, setFilter, search, setSearch, logsQuery, filtered,
    selectedRecord, setSelectedRecord, selectedRecordDetails,
  } = useAdminSystemAuditLogsMain();

  return (
    <div className="space-y-6">
      <header className="admin-page-header">
        <div>
          <p className="admin-breadcrumb">{t('BREADCRUMB')}</p>
          <h1 className="admin-page-title">{t('TITLE')}</h1>
          <p className="admin-page-subtitle">{t('SUBTITLE')}</p>
        </div>
      </header>
      <AdminAuditLogsFilters filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch} />
      <AdminAuditLogsRecordsPanel
        records={filtered}
        isLoading={logsQuery.isPending}
        errorMessage={logsQuery.isError ? t('LOAD_ERROR') : null}
        hasActiveFilter={Boolean(search.trim()) || filter !== 'all'}
        onRetry={() => { void logsQuery.refetch(); }}
        onRowClicked={setSelectedRecord}
      />
      {selectedRecord && (
        <section className="rounded-lg border border-border bg-card p-4 sm:p-6" aria-labelledby="admin-audit-log-detail-title" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 id="admin-audit-log-detail-title" className="text-lg font-semibold text-text-primary">{t('DETAILS_TITLE')}</h2>
            <button type="button" className="min-h-11 rounded-md border border-border px-3 py-2 text-primary" onClick={() => setSelectedRecord(null)}>{t('DETAILS_CLOSE')}</button>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedRecordDetails.map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-md bg-surface-highlight p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</dt>
                <dd className="mt-1 break-words text-sm text-text-primary">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <aside className="rounded-lg border border-border bg-info-bg p-4 text-text-secondary">
        <Shield size={18} strokeWidth={2} aria-hidden="true" className="mr-2 inline text-info-text" />
        {t('RETENTION_NOTICE')}
      </aside>
    </div>
  );
}
