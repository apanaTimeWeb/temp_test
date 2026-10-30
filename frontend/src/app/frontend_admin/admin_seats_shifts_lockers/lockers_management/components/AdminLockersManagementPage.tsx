'use client';
// Responsibility: AdminLockersManagementPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Read-only locker inventory with canonical status filtering.
// DATA FLOW: demo fixtures (demo mode only) -> filtered rows -> shared data grid.

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatAdminLockersDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/utils/AdminLockersManagementFormatDate';
import { ChevronDown } from 'lucide-react';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  ADMIN_LOCKERS_LOCKER_STATUS_BADGE_CLASS,
  ADMIN_LOCKERS_LOCKER_STATUS_OPTIONS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/config/admin_lockers_management.url_config';
import { matchesAdminLockersFilter } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/utils/AdminLockersManagementFilterUtils';
import {
  ADMIN_LOCKERS_DEMO_LOCKERS,
  type AdminLockersDemoLocker,
  type AdminLockersDemoLockerStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/mocks/AdminLockersManagementMSWHandlers';
import type { LockerStatus, Locker } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/types/AdminLockersManagementComponentTypes';


function renderLockerIdCell({ value }: { value: string }) {
  return <span className="font-mono text-sm font-semibold text-primary">{value}</span>;
}

export function AdminLockersManagementPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-lockers-admin-lockers-lockers-page-1-page', 0);

  const t = useTranslations('ADMIN_LOCKERS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const lockers = isDemoMode ? ADMIN_LOCKERS_DEMO_LOCKERS : [];
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | LockerStatus>('statusFilter', 'all', { validValues: ['all', 'Free', 'Occupied', 'Maintenance'] });
  const filtered = lockers.filter((locker) => matchesAdminLockersFilter(locker.status, statusFilter));

  const colDefs = useMemo<readonly DataGridColumn<Locker>[]>(() => [
    { field: 'lockerId', headerName: t('lockerId'), flex: 1, cellRenderer: renderLockerIdCell },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1.2,
      cellRenderer: ({ value }: { value: string }) => {
        const option = ADMIN_LOCKERS_LOCKER_STATUS_OPTIONS.find((item) => item.value === value);
        return (
          <span data-testid="admin_lockers-page-state-001" className={ADMIN_LOCKERS_LOCKER_STATUS_BADGE_CLASS[value as LockerStatus] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>
            <span className="mr-1.5 inline-block size-1.5 shrink-0 rounded-full bg-current align-middle" />{option ? t(option.labelKey) : value}
          </span>
        );
      },
    },
    {
      field: 'assignedTo',
      headerName: t('assignedTo'),
      flex: 2,
      cellRenderer: ({ data }: { data: Locker }) => data.assignedTo === '—'
        ? <span className="text-text-secondary">{t('unassigned')}</span>
        : <div className="flex min-w-0 flex-col gap-1"><p className="flex min-w-0 items-center gap-2">{data.assignedTo}</p><p className="block text-xs text-text-secondary">{data.studentId}</p></div>,
    },
    { field: 'assignedSince', headerName: t('since'), flex: 1.3, cellClass: 'text-sm text-text-secondary', cellRenderer: ({ value }) => formatAdminLockersDate(String(value ?? ''), locale) },
  ], [locale, t]);

  return (
    <div className="min-w-0 space-y-6">
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('liveLockerNotice')}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('lockersTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('lockersSubtitle')}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 sm:w-56">
          <select
            aria-label={t('filterLockersByStatus')}
            data-testid="admin_lockers-page-control-002"
            className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | LockerStatus)}
          >
            <option value="all">{t('allStatuses')}</option>
            {ADMIN_LOCKERS_LOCKER_STATUS_OPTIONS.map(({ value, labelKey }) => (
              <option key={value} value={value}>{t(labelKey)}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="admin_lockers-page-state-003" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <p data-testid="admin_lockers-page-state-004" className="mb-1 text-3xl">🔒</p>
          <p data-testid="admin_lockers-page-state-005" className="text-sm font-semibold text-text-primary">{t('noLockersAdded')}</p>
          <p data-testid="admin_lockers-page-state-006" className="text-sm text-text-secondary">{t('noLockersMatch')}</p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-96">
          <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
        </div>
      )}
    </div>
  );
}
