'use client';
import { format, parseISO, isValid } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { ManagerSeatsHistoryNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { useLocale, useTranslations } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeManagerSeatHistoryCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryCsv';
import { useManagerSeatsHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/hooks/useManagerSeatsHistoryTables';
import type { ManagerSeatsHistoryRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import {MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES, MANAGER_SEATS_HISTORY_SEARCH_DEBOUNCE_MS} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/constants/ManagerSeatsHistoryConstants';
import type { ManagerSeatsHistoryNativeColumn as ColDef, ManagerSeatsHistoryNativeCellParams as ICellRendererParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { ManagerSeatsHistoryEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_empty_states/ManagerSeatsHistoryEmptyState';

// RESPONSIBILITY: Renders read-only seat history filters, pagination and table using module-owned Query server state.
export function ManagerSeatsHistoryClient() {
  const tManagerUi = useTranslations('manager.manager_seat_history.ui');
  const locale = useLocale();
  const [seatFilter, setSeatFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const historyQuery = useManagerSeatsHistory();
  const seatHistoryData: ManagerSeatsHistoryRow[] = historyQuery.data ?? [];
  const seatOptions: string[] = Array.from(new Set<string>(seatHistoryData.map((history: ManagerSeatsHistoryRow) => history.seatNo))).sort((a, b) => a.localeCompare(b));
  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const hasActiveFilters = seatFilter !== 'all' || normalizedSearch.length > 0 || Boolean(dateFrom) || Boolean(dateTo) || shiftFilter !== 'all' || reasonFilter !== 'all';

  const filtered = seatHistoryData.filter((h: ManagerSeatsHistoryRow) => {
    const matchSeat = seatFilter === 'all' || h.seatNo === seatFilter;
    const matchShift = shiftFilter === 'all' || h.shift.toLowerCase() === shiftFilter.toLowerCase();
    const matchReason = reasonFilter === 'all' || h.reason.toLowerCase() === reasonFilter.toLowerCase();
    const matchSearch = !normalizedSearch ||
      h.studentName.toLowerCase().includes(normalizedSearch) ||
      h.smartId.toLowerCase().includes(normalizedSearch);
    const matchFrom = !dateFrom || h.occupiedFrom >= dateFrom;
    const matchTo = !dateTo || h.occupiedTill <= dateTo;
    return matchSeat && matchShift && matchReason && matchSearch && matchFrom && matchTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const effectivePage = Math.min(page, totalPages - 1);
  const paginatedRows = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const colDefs: ColDef<ManagerSeatsHistoryRow>[] = useMemo(() => {
    const formatHistoryDate = (value: string) => {
      const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
      if (!match) return value;
      const date = parseISO(match[1]);
      if (!isValid(date)) return value;
      return format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enUS });
    };
    const formatShift = (value: string) => ({
      Morning: tManagerUi('morning'),
      Afternoon: tManagerUi('afternoon'),
      Evening: tManagerUi('evening'),
      Night: tManagerUi('night'),
      'Full Day': tManagerUi('full_day'),
    } as Record<string, string>)[value] ?? value;
    const formatReason = (value: string) => {
      if (value === 'Admission') return tManagerUi('history_reason_admission');
      if (value === 'Shift Change') return tManagerUi('history_reason_shift_change');
      if (value === 'Seat Change') return tManagerUi('history_reason_seat_change');
      return value;
    };
    return [
      { field: 'seatNo', headerName: tManagerUi('seat'), flex: 0.8, cellClass: 'ss-table__seat-no' },
      { field: 'studentName', headerName: tManagerUi('student_71ad6e'), flex: 1.5 },
      { field: 'smartId', headerName: tManagerUi('smart_id'), flex: 1, cellClass: 'ss-cell-secondary' },
      { field: 'shift', headerName: tManagerUi('shift_149b8d'), flex: 1, cellClass: 'ss-cell-secondary', valueFormatter: (params: { value?: unknown }) => formatShift(String(params.value ?? '')) },
      { field: 'occupiedFrom', headerName: tManagerUi('from_8e7f00'), flex: 1.3, cellClass: 'ss-cell-secondary', valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')) },
      { field: 'occupiedTill', headerName: tManagerUi('till'), flex: 1.3, cellClass: 'ss-cell-secondary', valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')) },
      { field: 'duration', headerName: tManagerUi('duration'), flex: 1, cellClass: 'ss-cell-secondary' },
      { field: 'reason', headerName: tManagerUi('reason'), flex: 1.3, cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => { const reason = String(params.value ?? ''); return <span className={MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES[reason] ?? 'ss-badge ss-badge--inactive'}>{formatReason(reason)}</span>; } },
      { field: 'status', headerName: 'Status', flex: 1, cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => { const status = String(params.value ?? 'Active'); const isActive = status.toLowerCase() === 'active'; return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-success-bg text-success' : 'bg-surface-highlight text-secondary'}`}>{status}</span>; } },
    ];
  }, [locale, tManagerUi]);

  const handleExportCsv = () => {
    const headers = ['Seat No', 'Student Name', 'Smart ID', 'Shift', 'Occupied From', 'Occupied Till', 'Duration', 'Reason', 'Status'];
    const rows = filtered.map((h) => [
      sanitizeManagerSeatHistoryCsvCell(h.seatNo),
      sanitizeManagerSeatHistoryCsvCell(h.studentName),
      sanitizeManagerSeatHistoryCsvCell(h.smartId),
      sanitizeManagerSeatHistoryCsvCell(h.shift),
      sanitizeManagerSeatHistoryCsvCell(h.occupiedFrom),
      sanitizeManagerSeatHistoryCsvCell(h.occupiedTill),
      sanitizeManagerSeatHistoryCsvCell(h.duration),
      sanitizeManagerSeatHistoryCsvCell(h.reason),
      sanitizeManagerSeatHistoryCsvCell(h.status ?? 'Active'),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `seat_history_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Seat history exported successfully');
  };

  return (
    <div className="ss-page space-y-4">
      <div className="ss-page-header">
        <div>
          <h1 className="ss-page-title">{tManagerUi('seat_history')}</h1>
          <p className="ss-page-subtitle">{tManagerUi('complete_occupancy_history_for_every_seat')}</p>
        </div>
        <button
          type="button"
          className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors"
          onClick={handleExportCsv}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="ss-filter-bar flex flex-wrap items-center gap-3">
        <div className="ss-filter-bar__select-wrap">
          <select
            aria-label={tManagerUi('filter_by_seat')}
            className="ss-select"
            value={seatFilter}
            onChange={(e) => { setSeatFilter(e.target.value); setPage(0); }}
          >
            <option value="all">{tManagerUi('all_seats')}</option>
            {seatOptions.map((seatNo) => <option key={seatNo} value={seatNo}>{seatNo}</option>)}
          </select>
          <ChevronDown size={14} className="ss-select-icon" />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <Search size={14} className="ss-input-icon" />
          <input
            aria-label={tManagerUi('search_by_student_name_or_id')}
            type="text"
            placeholder={tManagerUi('search_by_student_name_or_id')}
            className="ss-input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
        <div className="ss-filter-bar__select-wrap">
          <select
            aria-label="Filter by Shift"
            className="ss-select"
            value={shiftFilter}
            onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Full Day">Full Day</option>
          </select>
          <ChevronDown size={14} className="ss-select-icon" />
        </div>
        <div className="ss-filter-bar__select-wrap">
          <select
            aria-label="Filter by Reason"
            className="ss-select"
            value={reasonFilter}
            onChange={(e) => { setReasonFilter(e.target.value); setPage(0); }}
          >
            <option value="all">All Reasons</option>
            <option value="Admission">Admission</option>
            <option value="Shift Change">Shift Change</option>
            <option value="Seat Change">Seat Change</option>
          </select>
          <ChevronDown size={14} className="ss-select-icon" />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <input
            aria-label={tManagerUi('date_from')}
            type="date"
            className="ss-input ss-input--no-icon"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
          />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <input
            aria-label={tManagerUi('date_to')}
            type="date"
            className="ss-input ss-input--no-icon"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSeatFilter('all');
              setShiftFilter('all');
              setReasonFilter('all');
              setSearch('');
              setDateFrom('');
              setDateTo('');
              setPage(0);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            title="Reset all filters"
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      {historyQuery.isError ? (
        <div className="ss-empty-state">
          <p className="ss-empty-state__title">{tManagerUi('unable_to_load_seat_history')}</p>
          <button type="button" className="ss-btn-ghost" onClick={() => historyQuery.refetch()}>{tManagerUi('retry')}</button>
        </div>
      ) : historyQuery.isPending ? (
        <div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('loading_seat_history')}</p></div>
      ) : filtered.length === 0 ? (
        <ManagerSeatsHistoryEmptyState className="ss-empty-state">
          <p className="ss-empty-state__icon">📜</p>
          <p className="ss-empty-state__title">{hasActiveFilters ? tManagerUi('no_seat_history_matches_current_filters') : tManagerUi('no_seat_history_records_found')}</p>
        </ManagerSeatsHistoryEmptyState>
      ) : (
        <div className="space-y-3">
          <div className="ss-table-wrapper ss-grid-h-400">
            <ManagerSeatsHistoryNativeTable
              rows={paginatedRows}
              columns={colDefs}
              label={tManagerUi('seat_history')}
              getRowKey={(row) => [row.seatNo, row.smartId, row.occupiedFrom, row.occupiedTill, row.reason, row.duration].join('|')}
            />
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 text-xs text-secondary border-t border-border pt-2">
            <span>
              Showing {filtered.length === 0 ? 0 : effectivePage * pageSize + 1} to{' '}
              {Math.min((effectivePage + 1) * pageSize, filtered.length)} of {filtered.length} history records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={effectivePage === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <span className="font-semibold text-primary px-1">
                {effectivePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={effectivePage >= totalPages - 1}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
