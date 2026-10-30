// Responsibility: AdminSeatsManagementPage component owned by admin_seats; responsibility folder: admin_seats_components_views.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Read-only seat inventory with local search and canonical status filtering.
// DATA FLOW: demo fixtures (demo mode only) -> filtered rows -> shared data grid.

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search, Wrench } from 'lucide-react';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS,
  ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS,
  type AdminSeatsSeatStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management_constants';
import { matchesAdminSeatsFilter } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/utils/AdminSeatsManagementFilterUtils';
import {
  ADMIN_SEATS_DEMO_SEATS,
  type AdminSeatsDemoSeat,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/mocks/AdminSeatsManagementDemoFixtures';
import type { SeatStatus, Seat } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';


function renderSeatNoCell({ value }: { value: string }) {
  return <span className="font-mono text-sm font-semibold text-primary">{value}</span>;
}

function renderBranchCell({ data }: { data: Seat }) {
  return <span className="font-medium text-primary">{data.branch}</span>;
}

export function AdminSeatsManagementPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-seats-admin-seats-seat-management-page-1-page', 0);

  const t = useTranslations('ADMIN_SEATS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const seats = isDemoMode ? ADMIN_SEATS_DEMO_SEATS : [];
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | SeatStatus>('statusFilter', 'all', { validValues: ['all', 'Working', 'Maintenance', 'Broken'] });

  const filtered = seats.filter((seat) => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const matchesSearch = [seat.seatNo, seat.branch, seat.assignedTo]
      .some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
    return matchesSearch && matchesAdminSeatsFilter(seat.status, statusFilter);
  });

  const colDefs = useMemo<readonly DataGridColumn<Seat>[]>(() => [
    { field: 'seatNo', headerName: t('seatNumber'), flex: 1, cellRenderer: renderSeatNoCell },
    { field: 'branch', headerName: t('branch'), flex: 2, cellRenderer: renderBranchCell },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1.2,
      cellRenderer: ({ value }: { value: string }) => {
        const statusKey = ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS.find((option) => option.value === value)?.labelKey ?? 'statusUnknown';
        return (
          <span data-testid="admin_seats-page-state-001" className={ADMIN_SEATS_SEAT_STATUS_BADGE_CLASS[value as SeatStatus] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>
            <span className="mr-1.5 inline-block size-1.5 shrink-0 rounded-full bg-current align-middle" />{t(statusKey)}
          </span>
        );
      },
    },
    { field: 'assignedTo', headerName: t('assignedTo'), flex: 2, cellClass: 'text-sm text-text-secondary' },
    { field: 'lastMaintenance', headerName: t('lastMaintenance'), flex: 1.5, cellClass: 'text-sm text-text-secondary' },
    {
      headerName: t('actions'),
      flex: 1.5,
      sortable: false,
      cellRenderer: () => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            data-testid="admin_seats-page-control-002"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-secondary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            title={t('maintenanceLogUnavailable')}
            aria-label={t('viewMaintenanceLog')}
            disabled
          >
            <Wrench size={18} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ], [t]);

  return (
    <div className="min-w-0 space-y-6">
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('liveSeatNotice')}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('seatsTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('seatsSubtitle')}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
          <input
            type="text"
            aria-label={t('searchSeatsPlaceholder')}
            placeholder={t('searchSeatsPlaceholder')}
            className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="relative min-w-0 sm:w-56">
          <select
            aria-label={t('status')}
            data-testid="admin_seats-page-control-003"
            className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | SeatStatus)}
          >
            <option value="all">{t('allStatuses')}</option>
            {ADMIN_SEATS_MANAGEMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="admin_seats-page-state-004" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <p data-testid="admin_seats-page-state-005" className="mb-1 text-3xl">🪑</p>
          <p data-testid="admin_seats-page-state-006" className="text-sm font-semibold text-text-primary">{t('noSeatsFound')}</p>
          <p data-testid="admin_seats-page-state-007" className="text-sm text-text-secondary">{t('noSeatsMatch')}</p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card min-h-96">
          <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={52}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
        </div>
      )}
    </div>
  );
}
