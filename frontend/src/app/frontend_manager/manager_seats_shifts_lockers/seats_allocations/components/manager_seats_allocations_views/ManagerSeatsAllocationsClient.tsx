'use client';
import { ManagerSeatsAllocationsNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_table_parts/ManagerSeatsAllocationsNativeTable';
import { sanitizeManagerAllocationsCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/utils/ManagerSeatsAllocationsCsv';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ChevronDown, Download, Search, History, Armchair } from 'lucide-react';
import { useManagerSeatsAllocations, useManagerAllocationsSeatHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/hooks/useManagerSeatsAllocationsTables';
import type {
  ManagerSeatsAllocationsAllocationRow,
  ManagerSeatsAllocationsSeatHistoryRow,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsTypes';
import {
  MANAGER_SEATS_ALLOCATIONS_ALLOCATION_STATUS_CLASSES,
  MANAGER_SEATS_ALLOCATIONS_HISTORY_REASON_CLASSES,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/constants/ManagerSeatsAllocationsConstants';
import type {
  ManagerSeatsAllocationsNativeColumn as ColDef,
  ManagerSeatsAllocationsNativeCellParams as ICellRendererParams,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_table_parts/ManagerSeatsAllocationsNativeTable';
import { ManagerSeatsAllocationsEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_empty_states/ManagerSeatsAllocationsEmptyState';

// RESPONSIBILITY: Unified Seat Allocations & Seat History Hub. Glues current allocations with historical logs.
export function ManagerSeatsAllocationsClient() {
  const tManagerUi = useTranslations('manager.manager_allocations.ui');
  const [viewTab, setViewTab] = useState<'allocations' | 'history'>('allocations');

  // Allocation Filters
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // History Filters
  const [historySeatFilter, setHistorySeatFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  const allocationsQuery = useManagerSeatsAllocations();
  const historyQuery = useManagerAllocationsSeatHistory();

  const allocationsData: ManagerSeatsAllocationsAllocationRow[] = allocationsQuery.data ?? [];
  const historyData: ManagerSeatsAllocationsSeatHistoryRow[] = historyQuery.data ?? [];

  const shiftOptions = Array.from(new Set(allocationsData.map((a) => a.shift))).filter(Boolean);
  const seatOptions = Array.from(new Set(historyData.map((h) => h.seatNo))).sort((a, b) => a.localeCompare(b));

  const shiftLabel = (value: string) =>
    ({
      Morning: tManagerUi('morning'),
      Afternoon: tManagerUi('afternoon'),
      Evening: tManagerUi('evening'),
      Night: tManagerUi('night'),
      'Full Day': tManagerUi('full_day'),
    }[value] ?? value);

  // Filtered Allocations
  const filteredAllocations = useMemo(() => {
    return allocationsData.filter((a: ManagerSeatsAllocationsAllocationRow) => {
      const matchShift = shiftFilter === 'all' || a.shift === shiftFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchFrom = !dateFrom || a.validFrom >= dateFrom;
      const matchTo = !dateTo || a.validTill <= dateTo;
      return matchShift && matchStatus && matchFrom && matchTo;
    });
  }, [allocationsData, shiftFilter, statusFilter, dateFrom, dateTo]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return historyData.filter((h: ManagerSeatsAllocationsSeatHistoryRow) => {
      const matchSeat = historySeatFilter === 'all' || h.seatNo === historySeatFilter;
      const matchSearch = !q || h.studentName.toLowerCase().includes(q) || h.smartId.toLowerCase().includes(q);
      const matchFrom = !dateFrom || h.occupiedFrom >= dateFrom;
      const matchTo = !dateTo || h.occupiedTill <= dateTo;
      return matchSeat && matchSearch && matchFrom && matchTo;
    });
  }, [historyData, historySeatFilter, historySearch, dateFrom, dateTo]);

  // Columns for Allocations
  const allocationColDefs: ColDef<ManagerSeatsAllocationsAllocationRow>[] = useMemo(
    () => [
      { field: 'studentName', headerName: tManagerUi('student_71ad6e'), flex: 2 },
      { field: 'seatNo', headerName: tManagerUi('seat'), flex: 0.8, cellClass: 'ss-table__seat-no' },
      {
        field: 'shift',
        headerName: tManagerUi('shift_149b8d'),
        flex: 1,
        cellClass: 'ss-cell-secondary',
        cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsAllocationRow>) =>
          shiftLabel(String(params.value ?? '')),
      },
      { field: 'customSlots', headerName: tManagerUi('custom_slots'), flex: 1.8, cellClass: 'ss-cell-secondary' },
      { field: 'lockerNo', headerName: tManagerUi('locker'), flex: 0.8, cellClass: 'ss-cell-secondary' },
      { field: 'validFrom', headerName: tManagerUi('from_8e7f00'), flex: 1.3, cellClass: 'ss-cell-secondary' },
      { field: 'validTill', headerName: tManagerUi('till'), flex: 1.3, cellClass: 'ss-cell-secondary' },
      { field: 'daysLeft', headerName: tManagerUi('days_left'), flex: 1 },
      {
        field: 'status',
        headerName: tManagerUi('status_716883'),
        flex: 1.2,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsAllocationRow>) => {
          const value = String(params.value ?? 'unknown');
          const label =
            value === 'Active'
              ? tManagerUi('active')
              : value === 'Expired'
              ? tManagerUi('expired')
              : value === 'Suspended'
              ? tManagerUi('suspended')
              : tManagerUi('unknown_status');
          return (
            <span className={MANAGER_SEATS_ALLOCATIONS_ALLOCATION_STATUS_CLASSES[value] ?? 'ss-badge ss-badge--inactive'}>
              {label}
            </span>
          );
        },
      },
    ],
    [tManagerUi]
  );

  // Columns for History
  const historyColDefs: ColDef<ManagerSeatsAllocationsSeatHistoryRow>[] = useMemo(
    () => [
      { field: 'seatNo', headerName: tManagerUi('seat'), flex: 0.8, cellClass: 'ss-table__seat-no' },
      { field: 'studentName', headerName: tManagerUi('student_71ad6e'), flex: 1.6 },
      { field: 'smartId', headerName: 'Smart ID', flex: 1.1, cellClass: 'ss-cell-secondary' },
      {
        field: 'shift',
        headerName: tManagerUi('shift_149b8d'),
        flex: 1,
        cellClass: 'ss-cell-secondary',
        cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsSeatHistoryRow>) =>
          shiftLabel(String(params.value ?? '')),
      },
      { field: 'occupiedFrom', headerName: tManagerUi('from_8e7f00'), flex: 1.2, cellClass: 'ss-cell-secondary' },
      { field: 'occupiedTill', headerName: tManagerUi('till'), flex: 1.2, cellClass: 'ss-cell-secondary' },
      { field: 'duration', headerName: 'Duration', flex: 1, cellClass: 'ss-cell-secondary' },
      {
        field: 'reason',
        headerName: 'Event Reason',
        flex: 1.3,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsAllocationsSeatHistoryRow>) => {
          const reason = String(params.value ?? 'Admission');
          return (
            <span className={MANAGER_SEATS_ALLOCATIONS_HISTORY_REASON_CLASSES[reason] ?? 'ss-badge ss-badge--info'}>
              {reason}
            </span>
          );
        },
      },
    ],
    [tManagerUi]
  );

  const exportCurrentCsv = () => {
    if (viewTab === 'allocations') {
      const headers = [
        tManagerUi('student_71ad6e'),
        tManagerUi('seat'),
        tManagerUi('shift_149b8d'),
        tManagerUi('custom_slots'),
        tManagerUi('locker'),
        tManagerUi('from_8e7f00'),
        tManagerUi('till'),
        tManagerUi('days_left'),
        tManagerUi('status_716883'),
      ];
      const rows = filteredAllocations.map((item) => [
        item.studentName,
        item.seatNo,
        item.shift,
        item.customSlots,
        item.lockerNo,
        item.validFrom,
        item.validTill,
        String(item.daysLeft),
        item.status,
      ]);
      const csv = [headers, ...rows].map((row) => row.map(sanitizeManagerAllocationsCsvCell).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'manager-seats-allocations.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Seat No', 'Student Name', 'Smart ID', 'Shift', 'Occupied From', 'Occupied Till', 'Duration', 'Reason'];
      const rows = filteredHistory.map((h) => [
        h.seatNo,
        h.studentName,
        h.smartId,
        h.shift,
        h.occupiedFrom,
        h.occupiedTill,
        h.duration,
        h.reason,
      ]);
      const csv = [headers, ...rows].map((row) => row.map(sanitizeManagerAllocationsCsvCell).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'manager-seats-occupancy-history.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="ss-page">
      <div className="ss-page-header">
        <div>
          <h1 className="ss-page-title">Unified Seat Allocation & History Hub</h1>
          <p className="ss-page-subtitle">Track active seat assignments and complete chronological occupancy turn history</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-floating p-1 rounded-lg border border-border text-xs">
            <button
              type="button"
              onClick={() => setViewTab('allocations')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                viewTab === 'allocations' ? 'bg-card text-primary shadow-xs' : 'text-secondary hover:text-primary'
              }`}
            >
              <Armchair size={14} /> Active Allocations ({filteredAllocations.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('history')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                viewTab === 'history' ? 'bg-card text-primary shadow-xs' : 'text-secondary hover:text-primary'
              }`}
            >
              <History size={14} /> Seat History Log ({filteredHistory.length})
            </button>
          </div>

          <button type="button" className="ss-btn-ghost ss-btn-start text-xs" onClick={exportCurrentCsv}>
            <Download size={14} />
            {tManagerUi('export')} CSV
          </button>
        </div>
      </div>

      {viewTab === 'allocations' ? (
        <>
          <div className="ss-filter-bar">
            <div className="ss-filter-bar__select-wrap">
              <select
                aria-label={tManagerUi('filter_by_shift')}
                className="ss-select"
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
              >
                <option value="all">{tManagerUi('all_shifts')}</option>
                {shiftOptions.map((shift) => (
                  <option key={shift} value={shift}>
                    {shiftLabel(shift)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="ss-select-icon" />
            </div>
            <div className="ss-filter-bar__select-wrap">
              <select
                aria-label={tManagerUi('filter_by_status')}
                className="ss-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{tManagerUi('all_statuses')}</option>
                <option value="Active">{tManagerUi('active')}</option>
                <option value="Expired">{tManagerUi('expired')}</option>
                <option value="Suspended">{tManagerUi('suspended')}</option>
                <option value="unknown">{tManagerUi('unknown_status')}</option>
              </select>
              <ChevronDown size={14} className="ss-select-icon" />
            </div>
            <div className="ss-filter-bar__input-wrap">
              <input
                aria-label={tManagerUi('date_from')}
                type="date"
                className="ss-input ss-input--no-icon"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="ss-filter-bar__input-wrap">
              <input
                aria-label={tManagerUi('date_to')}
                type="date"
                className="ss-input ss-input--no-icon"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {allocationsQuery.isError ? (
            <div className="ss-empty-state">
              <p className="ss-empty-state__title">{tManagerUi('unable_to_load_allocations')}</p>
              <button type="button" className="ss-btn-ghost" onClick={() => allocationsQuery.refetch()}>
                {tManagerUi('retry')}
              </button>
            </div>
          ) : allocationsQuery.isPending ? (
            <div className="ss-empty-state">
              <p className="ss-empty-state__title">{tManagerUi('loading_allocations')}</p>
            </div>
          ) : filteredAllocations.length === 0 ? (
            <ManagerSeatsAllocationsEmptyState className="ss-empty-state">
              <p className="ss-empty-state__icon">📋</p>
              <p className="ss-empty-state__title">{tManagerUi('no_allocations_found')}</p>
            </ManagerSeatsAllocationsEmptyState>
          ) : (
            <div className="ss-table-wrapper ss-grid-h-400">
              <ManagerSeatsAllocationsNativeTable
                rows={filteredAllocations}
                columns={allocationColDefs}
                label={tManagerUi('allocations')}
                getRowKey={(row) => row.id}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="ss-filter-bar">
            <div className="ss-filter-bar__select-wrap">
              <select
                aria-label="Filter by Seat"
                className="ss-select"
                value={historySeatFilter}
                onChange={(e) => setHistorySeatFilter(e.target.value)}
              >
                <option value="all">All Seats</option>
                {seatOptions.map((s) => (
                  <option key={s} value={s}>
                    Seat {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="ss-select-icon" />
            </div>
            <div className="ss-filter-bar__input-wrap">
              <Search size={14} className="ss-input-icon" />
              <input
                aria-label="Search student name or smart ID"
                type="text"
                placeholder="Search student or Smart ID..."
                className="ss-input"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
            </div>
            <div className="ss-filter-bar__input-wrap">
              <input
                aria-label="Date From"
                type="date"
                className="ss-input ss-input--no-icon"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="ss-filter-bar__input-wrap">
              <input
                aria-label="Date To"
                type="date"
                className="ss-input ss-input--no-icon"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {historyQuery.isError ? (
            <div className="ss-empty-state">
              <p className="ss-empty-state__title">Unable to load seat history records</p>
              <button type="button" className="ss-btn-ghost" onClick={() => historyQuery.refetch()}>
                Retry
              </button>
            </div>
          ) : historyQuery.isPending ? (
            <div className="ss-empty-state">
              <p className="ss-empty-state__title">Loading seat history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <ManagerSeatsAllocationsEmptyState className="ss-empty-state">
              <p className="ss-empty-state__icon">📜</p>
              <p className="ss-empty-state__title">No history records match current criteria</p>
            </ManagerSeatsAllocationsEmptyState>
          ) : (
            <div className="ss-table-wrapper ss-grid-h-400">
              <ManagerSeatsAllocationsNativeTable
                rows={filteredHistory}
                columns={historyColDefs}
                label="Seat History"
                getRowKey={(row) => `${row.seatNo}-${row.smartId}-${row.occupiedFrom}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
