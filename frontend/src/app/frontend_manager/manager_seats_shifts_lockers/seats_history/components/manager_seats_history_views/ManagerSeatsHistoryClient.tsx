'use client';
import { format, parseISO, isValid } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { ManagerSeatsHistoryNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { useLocale, useTranslations } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useManagerSeatsHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/hooks/useManagerSeatsHistoryTables';
import type { ManagerSeatsHistoryRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import {MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES, MANAGER_SEATS_HISTORY_SEARCH_DEBOUNCE_MS} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/constants/ManagerSeatsHistoryConstants';
import type { ManagerSeatsHistoryNativeColumn as ColDef, ManagerSeatsHistoryNativeCellParams as ICellRendererParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { ManagerSeatsHistoryEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_empty_states/ManagerSeatsHistoryEmptyState';


// RESPONSIBILITY: Renders read-only seat history filters and table using module-owned Query server state. It does not own backend persistence or cross-feature business logic.
export function ManagerSeatsHistoryClient() {
  const tManagerUi = useTranslations('manager.manager_seat_history.ui');
  const locale = useLocale();
  const [seatFilter, setSeatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // Dependency rationale: debounce seat-history search and clear stale timers when the query changes or the component unmounts.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), MANAGER_SEATS_HISTORY_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [search]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const historyQuery = useManagerSeatsHistory();
  const seatHistoryData: ManagerSeatsHistoryRow[] = historyQuery.data ?? [];
  const seatOptions: string[] = Array.from(new Set<string>(seatHistoryData.map((history: ManagerSeatsHistoryRow) => history.seatNo))).sort((a, b) => a.localeCompare(b));
  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const hasActiveFilters = seatFilter !== 'all' || normalizedSearch.length > 0 || Boolean(dateFrom) || Boolean(dateTo);

  const filtered = seatHistoryData.filter((h: ManagerSeatsHistoryRow) => {
    const matchSeat = seatFilter === 'all' || h.seatNo === seatFilter;
    const matchSearch = !normalizedSearch ||
      h.studentName.toLowerCase().includes(normalizedSearch) ||
      h.smartId.toLowerCase().includes(normalizedSearch);
    const matchFrom = !dateFrom || h.occupiedFrom >= dateFrom;
    const matchTo = !dateTo || h.occupiedTill <= dateTo;
    return matchSeat && matchSearch && matchFrom && matchTo;
  });

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
    ];
  }, [locale, tManagerUi]);

  return (
    <div className="ss-page">
      <div className="ss-page-header">
        <div>
          <h1 className="ss-page-title">{tManagerUi('seat_history')}</h1>
          <p className="ss-page-subtitle">{tManagerUi('complete_occupancy_history_for_every_seat')}</p>
        </div>
      </div>

      <div className="ss-filter-bar">
        <div className="ss-filter-bar__select-wrap">
          <select aria-label={tManagerUi('filter_by_seat')} className="ss-select" value={seatFilter} onChange={e => setSeatFilter(e.target.value)}>
            <option value="all">{tManagerUi('all_seats')}</option>
            {seatOptions.map((seatNo) => <option key={seatNo} value={seatNo}>{seatNo}</option>)}
          </select>
          <ChevronDown size={14} className="ss-select-icon" />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <Search size={14} className="ss-input-icon" />
          <input aria-label={tManagerUi('search_by_student_name_or_id')} type="text" placeholder={tManagerUi('search_by_student_name_or_id')} className="ss-input" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <input aria-label={tManagerUi('date_from')} type="date" className="ss-input ss-input--no-icon" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div className="ss-filter-bar__input-wrap">
          <input aria-label={tManagerUi('date_to')} type="date" className="ss-input ss-input--no-icon" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {historyQuery.isError ? (
        <div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('unable_to_load_seat_history')}</p><button type="button" className="ss-btn-ghost" onClick={() => historyQuery.refetch()}>{tManagerUi('retry')}</button></div>
      ) : historyQuery.isPending ? (
        <div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('loading_seat_history')}</p></div>
      ) : filtered.length === 0 ? (
        <ManagerSeatsHistoryEmptyState className="ss-empty-state">
          <p className="ss-empty-state__icon">📜</p>
          <p className="ss-empty-state__title">{hasActiveFilters ? tManagerUi('no_seat_history_matches_current_filters') : tManagerUi('no_seat_history_records_found')}</p>
        </ManagerSeatsHistoryEmptyState>
      ) : (
        <div className="ss-table-wrapper ss-grid-h-400">
          <ManagerSeatsHistoryNativeTable rows={filtered} columns={colDefs} label={tManagerUi('seat_history')} getRowKey={(row) => [row.seatNo, row.smartId, row.occupiedFrom, row.occupiedTill, row.reason, row.duration].join('|')} />
        </div>
      )}
    </div>
  );
}
