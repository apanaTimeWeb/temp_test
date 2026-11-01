'use client';
import { ManagerSeatsAllocationsNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_table_parts/ManagerSeatsAllocationsNativeTable';
import { sanitizeManagerAllocationsCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/utils/ManagerSeatsAllocationsCsv';
import { useTranslations } from 'next-intl';

import { useMemo, useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { useManagerSeatsAllocations } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/hooks/useManagerSeatsAllocationsTables';
import type { ManagerSeatsAllocationsAllocationRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsTypes';
import { MANAGER_SEATS_ALLOCATIONS_ALLOCATION_STATUS_CLASSES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/constants/ManagerSeatsAllocationsConstants';
import type { ManagerSeatsAllocationsNativeColumn as ColDef, ManagerSeatsAllocationsNativeCellParams as ICellRendererParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_table_parts/ManagerSeatsAllocationsNativeTable';
import { ManagerSeatsAllocationsEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_empty_states/ManagerSeatsAllocationsEmptyState';


// RESPONSIBILITY: Renders allocation filters and the read-only allocations table; server data comes from the module Query hook. It does not own backend persistence or cross-feature business logic.
export function ManagerSeatsAllocationsClient() {
  const tManagerUi = useTranslations('manager.manager_allocations.ui');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const allocationsQuery = useManagerSeatsAllocations();
  const allocationsData: ManagerSeatsAllocationsAllocationRow[] = allocationsQuery.data ?? [];
  // Keep filter values independent of translated labels and discover real shift names from the response.
  const shiftOptions = Array.from(new Set(allocationsData.map((allocation) => allocation.shift))).filter(Boolean);
  const shiftLabel = (value: string) => ({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening'), Night: tManagerUi('night'), 'Full Day': tManagerUi('full_day') } as Record<string, string>)[value] ?? value;

  const hasActiveFilters = shiftFilter !== 'all' || statusFilter !== 'all' || Boolean(dateFrom) || Boolean(dateTo);
  const filtered = allocationsData.filter((a: ManagerSeatsAllocationsAllocationRow) => {
    const matchShift = shiftFilter === 'all' || a.shift === shiftFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchFrom = !dateFrom || a.validFrom >= dateFrom;
    const matchTo = !dateTo || a.validTill <= dateTo;
    return matchShift && matchStatus && matchFrom && matchTo;
  });

  const colDefs: ColDef<ManagerSeatsAllocationsAllocationRow>[] = useMemo(() => [
    { field: 'studentName', headerName: tManagerUi('student_71ad6e'), flex: 2 },
    { field: 'seatNo', headerName: tManagerUi('seat'), flex: 0.8, cellClass: 'ss-table__seat-no' },
    { field: 'shift', headerName: tManagerUi('shift_149b8d'), flex: 1, cellClass: 'ss-cell-secondary', cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsAllocationRow>) => shiftLabel(String(params.value ?? '')) },
    { field: 'customSlots', headerName: tManagerUi('custom_slots'), flex: 1.8, cellClass: 'ss-cell-secondary' },
    { field: 'lockerNo', headerName: tManagerUi('locker'), flex: 0.8, cellClass: 'ss-cell-secondary' },
    { field: 'validFrom', headerName: tManagerUi('from_8e7f00'), flex: 1.3, cellClass: 'ss-cell-secondary' },
    { field: 'validTill', headerName: tManagerUi('till'), flex: 1.3, cellClass: 'ss-cell-secondary' },
    { field: 'daysLeft', headerName: tManagerUi('days_left'), flex: 1 },
    { field: 'status', headerName: tManagerUi('status_716883'), flex: 1.2, cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsAllocationRow>) => {
      const value = String(params.value ?? 'unknown');
      const label = value === 'Active' ? tManagerUi('active') : value === 'Expired' ? tManagerUi('expired') : value === 'Suspended' ? tManagerUi('suspended') : tManagerUi('unknown_status');
      return <span className={MANAGER_SEATS_ALLOCATIONS_ALLOCATION_STATUS_CLASSES[value] ?? 'ss-badge ss-badge--inactive'}>{label}</span>;
    } },
  ], [tManagerUi, shiftLabel]);

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('allocations')}</h1>
            <p className="ss-page-subtitle">{tManagerUi('all_active_and_past_seat_allocations')}</p>
          </div>
          <button type="button" className="ss-btn-ghost ss-btn-start" onClick={() => {
            const headers = [tManagerUi('student_71ad6e'), tManagerUi('seat'), tManagerUi('shift_149b8d'), tManagerUi('custom_slots'), tManagerUi('locker'), tManagerUi('from_8e7f00'), tManagerUi('till'), tManagerUi('days_left'), tManagerUi('status_716883')];
            const rows = filtered.map((item) => [item.studentName,item.seatNo,item.shift,item.customSlots,item.lockerNo,item.validFrom,item.validTill,String(item.daysLeft),item.status]);
            const csv = [headers, ...rows].map((row) => row.map(sanitizeManagerAllocationsCsvCell).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'manager-seats-allocations.csv'; anchor.click(); URL.revokeObjectURL(url);
          }}>
            <Download size={15} />{tManagerUi('export')}
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__select-wrap">
            <select aria-label={tManagerUi('filter_by_shift')} className="ss-select" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="all">{tManagerUi('all_shifts')}</option>
              {shiftOptions.map((shift) => <option key={shift} value={shift}>{shiftLabel(shift)}</option>)}
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
          <div className="ss-filter-bar__select-wrap">
            <select aria-label={tManagerUi('filter_by_status')} className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{tManagerUi('all_statuses')}</option>
              <option value="Active">{tManagerUi('active')}</option>
              <option value="Expired">{tManagerUi('expired')}</option>
              <option value="Suspended">{tManagerUi('suspended')}</option>
              <option value="unknown">{tManagerUi('unknown_status')}</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
          <div className="ss-filter-bar__input-wrap">
            <input aria-label={tManagerUi('date_from')} type="date" className="ss-input ss-input--no-icon" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="ss-filter-bar__input-wrap">
            <input aria-label={tManagerUi('date_to')} type="date" className="ss-input ss-input--no-icon" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {allocationsQuery.isError ? (
          <div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('unable_to_load_allocations')}</p><button type="button" className="ss-btn-ghost" onClick={() => allocationsQuery.refetch()}>{tManagerUi('retry')}</button></div>
        ) : allocationsQuery.isPending ? (
          <div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('loading_allocations')}</p></div>
        ) : filtered.length === 0 ? (
          <ManagerSeatsAllocationsEmptyState className="ss-empty-state">
            <p className="ss-empty-state__icon">📋</p>
            <p className="ss-empty-state__title">{hasActiveFilters ? tManagerUi('no_allocations_match_current_filters') : tManagerUi('no_allocations_found')}</p>
            {hasActiveFilters && <p className="ss-empty-state__sub">{tManagerUi('adjust_or_clear_allocation_filters')}</p>}
          </ManagerSeatsAllocationsEmptyState>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <ManagerSeatsAllocationsNativeTable rows={filtered} columns={colDefs} label={tManagerUi('allocations')} getRowKey={(row) => row.id} />
          </div>
        )}
      </div>
    </>
  );
}
