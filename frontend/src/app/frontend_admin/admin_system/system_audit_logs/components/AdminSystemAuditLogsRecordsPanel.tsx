'use client';
// RESPONSIBILITY: AdminAuditLogsRecordsPanel component owned by admin_audit_logs; responsibility folder: admin_audit_logs_records_panel.

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatAdminAuditLogsTimestamp } from '@/app/frontend_admin/admin_system/system_audit_logs/utils/AdminSystemAuditLogsViewUtils';
import { AlertTriangle, CircleHelp, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import type { AdminAuditLogsRecord, AdminAuditLogsSeverity } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';
import type { AdminAuditLogsRecordsPanelProps } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';


const SEVERITY_ICON = { danger: ShieldAlert, warning: AlertTriangle, info: Info, success: ShieldCheck, unknown: CircleHelp } as const;
const SEVERITY_KEY = { danger: 'SEVERITY_DANGER', warning: 'SEVERITY_WARNING', info: 'SEVERITY_INFO', success: 'SEVERITY_SUCCESS', unknown: 'SEVERITY_UNKNOWN' } as const;

export default function AdminAuditLogsRecordsPanel({ records, isLoading, errorMessage, hasActiveFilter, onRetry, onRowClicked }: AdminAuditLogsRecordsPanelProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-audit-logs-admin-audit-logs-records-panel-1-page', 0);

  const t = useTranslations('ADMIN_AUDIT_LOGS');
  const locale = useLocale();
  const columns = useMemo<readonly DataGridColumn<AdminAuditLogsRecord>[]>(() => [
    { field: 'timestamp', headerName: t('TABLE_TIME'), flex: 1.2, minWidth: 150, cellRenderer: ({ value }) => formatAdminAuditLogsTimestamp(String(value ?? ''), locale) },
    { field: 'action', headerName: t('TABLE_ACTION'), flex: 2, minWidth: 180 },
    { field: 'module', headerName: t('TABLE_MODULE'), flex: 1, minWidth: 100 },
    { field: 'performedBy', headerName: t('TABLE_PERFORMED_BY'), flex: 1.5, minWidth: 150 },
    { field: 'details', headerName: t('TABLE_DETAILS'), flex: 2.5, minWidth: 250 },
    { field: 'severity', headerName: t('TABLE_SEVERITY'), flex: 1, minWidth: 120, cellRenderer: ({ data }) => {
      const severity = data.severity as AdminAuditLogsSeverity;
      const Icon = SEVERITY_ICON[severity];
      const badge = severity === 'danger' ? 'bg-danger-bg text-danger-text' : severity === 'warning' ? 'bg-warning-bg text-warning-text' : severity === 'success' ? 'bg-success-bg text-success-text' : severity === 'unknown' ? 'bg-surface-highlight text-text-secondary' : 'bg-info-bg text-info-text';
      return <span className={`admin-badge inline-flex items-center gap-1 ${badge}`}><Icon size={18} strokeWidth={2} aria-hidden="true" />{t(SEVERITY_KEY[severity])}</span>;
    } },
  ], [locale, t]);

  if (errorMessage) return <div role="alert" className="rounded-lg border border-border bg-card p-6 text-danger-text">{errorMessage}<button type="button" className="ml-3 min-h-11 rounded border border-border px-3 py-2 text-primary" onClick={onRetry}>{t('RETRY')}</button></div>;
  if (isLoading) return (
    <section role="status" aria-busy="true" aria-label={t('LOADING_ARIA')} className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6">
      <span className="sr-only">{t('LOADING')}</span>
      <div className="grid gap-3 sm:grid-cols-2"><div className="h-11 rounded bg-skeleton-base motion-safe:animate-pulse" /><div className="h-11 rounded bg-skeleton-highlight motion-safe:animate-pulse" /></div>
      <div className="space-y-2">{Array.from({ length: 5 }, (_, index) => <div key={`skeleton-${index + 1}`} className="h-12 rounded bg-skeleton-base motion-safe:animate-pulse" />)}</div>
    </section>
  );
  if (records.length === 0) return <AdminEmptyState title={t(hasActiveFilter ? 'NO_MATCHING_TITLE' : 'NO_RECORDS_TITLE')} description={t(hasActiveFilter ? 'NO_MATCHING_DESCRIPTION' : 'NO_RECORDS_DESCRIPTION')} />;
  return (
    <DataGrid
      rowData={records}
      columnDefs={columns}
      pagination
      pageSize={25}
      onRowClicked={onRowClicked}
      tableLabel={t('TABLE_LABEL')}
      mobileOpenLabel={t('OPEN_RECORD')}
     page={urlTablePage0} onPageChange={setUrlTablePage0}/>
  );
}


export type { AdminAuditLogsRecordsPanelProps };
