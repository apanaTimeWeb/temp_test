'use client';

import { ButtonLoader, LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { Armchair } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ManagerSeatsHistoryAuditModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_dialogs/ManagerSeatsHistoryAuditModal';
import { ManagerSeatsHistoryEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_empty_states/ManagerSeatsHistoryEmptyState';
import { buildManagerSeatsHistoryColumns } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryColumns';
import type { ManagerSeatsHistoryNativeColumn as ColDef } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { ManagerSeatsHistoryNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { ManagerSeatsHistoryToolbar } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_views/ManagerSeatsHistoryToolbar';
import { useManagerSeatsHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/hooks/useManagerSeatsHistoryTables';
import type { ManagerSeatsHistoryRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import { sanitizeManagerSeatHistoryCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryCsv';

// RESPONSIBILITY: Renders read-only seat history filters, pagination and table using module-owned Query server state.
export function ManagerSeatsHistoryClient() {
  const tManagerUi = useTranslations('manager.manager_seat_history.ui');
  const locale = useLocale();
  const [seatFilter, setSeatFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [searchScope, setSearchScope] = useState<'all' | 'studentName' | 'seatNo' | 'smartId'>('all');
  const [timeHorizon, setTimeHorizon] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // 300ms live-search debounce contract
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const historyQuery = useManagerSeatsHistory();
  const seatHistoryData: ManagerSeatsHistoryRow[] = historyQuery.data ?? [];
  const seatOptions: string[] = Array.from(
    new Set<string>(seatHistoryData.map((history: ManagerSeatsHistoryRow) => history.seatNo))
  ).sort((a, b) => a.localeCompare(b));

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const cutoffDateStr = useMemo(() => {
    if (timeHorizon === 'all') return null;
    const now = new Date();
    const days = timeHorizon === '7days' ? 7 : timeHorizon === '30days' ? 30 : 90;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }, [timeHorizon]);

  const hasActiveFilters =
    seatFilter !== 'all' ||
    normalizedSearch.length > 0 ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    shiftFilter !== 'all' ||
    reasonFilter !== 'all' ||
    timeHorizon !== 'all' ||
    searchScope !== 'all';

  const filtered = useMemo(() => {
    return seatHistoryData.filter((h: ManagerSeatsHistoryRow) => {
      const matchSeat = seatFilter === 'all' || h.seatNo === seatFilter;
      const matchShift = shiftFilter === 'all' || h.shift.toLowerCase() === shiftFilter.toLowerCase();
      const matchReason = reasonFilter === 'all' || h.reason.toLowerCase() === reasonFilter.toLowerCase();

      let matchSearch = true;
      if (normalizedSearch) {
        if (searchScope === 'studentName') {
          matchSearch = h.studentName.toLowerCase().includes(normalizedSearch);
        } else if (searchScope === 'seatNo') {
          matchSearch = h.seatNo.toLowerCase().includes(normalizedSearch);
        } else if (searchScope === 'smartId') {
          matchSearch = h.smartId.toLowerCase().includes(normalizedSearch);
        } else {
          matchSearch =
            h.studentName.toLowerCase().includes(normalizedSearch) ||
            h.smartId.toLowerCase().includes(normalizedSearch) ||
            h.seatNo.toLowerCase().includes(normalizedSearch);
        }
      }

      const matchHorizon =
        !cutoffDateStr || h.occupiedTill >= cutoffDateStr || h.occupiedFrom >= cutoffDateStr;

      const matchFrom = !dateFrom || h.occupiedFrom >= dateFrom;
      const matchTo = !dateTo || h.occupiedTill <= dateTo;
      return matchSeat && matchShift && matchReason && matchSearch && matchHorizon && matchFrom && matchTo;
    });
  }, [seatHistoryData, seatFilter, shiftFilter, reasonFilter, normalizedSearch, searchScope, cutoffDateStr, dateFrom, dateTo]);

  const colDefs: ColDef<ManagerSeatsHistoryRow>[] = useMemo(
    () => buildManagerSeatsHistoryColumns(locale, tManagerUi),
    [locale, tManagerUi]
  );

  const handleExportCsv = () => {
    const headers = [
      'Seat No',
      'Student Name',
      'Smart ID',
      'Shift',
      'Occupied From',
      'Occupied Till',
      'Duration',
      'Reason',
      'Status',
    ];
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
    toast.success('Seat history exported successfully', { id: 'manager-seat-history-export-success' });
  };

  const handleResetFilters = () => {
    setSeatFilter('all');
    setShiftFilter('all');
    setReasonFilter('all');
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setTimeHorizon('all');
    setSearchScope('all');
  };

  const handleApplyAuditFilter = (seatNo: string, horizon: '30days' | 'all') => {
    setSeatFilter(seatNo);
    setTimeHorizon(horizon);
    toast.info(`Filtered to Seat ${seatNo} (${horizon === '30days' ? 'Past 1 Month' : 'All Time'})`, {
      id: 'manager-seat-history-audit-filter',
    });
  };

  return (
    <div className="ss-page !p-0 space-y-4 w-full min-w-0">
      <ManagerSeatsHistoryToolbar
        filteredCount={filtered.length}
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        searchScope={searchScope}
        setSearchScope={setSearchScope}
        search={search}
        setSearch={setSearch}
        seatFilter={seatFilter}
        setSeatFilter={setSeatFilter}
        seatOptions={seatOptions}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        reasonFilter={reasonFilter}
        setReasonFilter={setReasonFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onExportCsv={handleExportCsv}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* ── Table Card Presentation ── */}
      {historyQuery.isError ? (
        <div className="ss-empty-state p-8 rounded-2xl bg-card border border-border text-center">
          <p className="ss-empty-state__title text-danger font-semibold">
            {tManagerUi('unable_to_load_seat_history')}
          </p>
          <button
            type="button"
            className="ss-btn-ghost mt-3 mgr-btn-primary mgr-btn-sm inline-flex items-center gap-1.5"
            onClick={() => historyQuery.refetch()}
            disabled={historyQuery.isFetching}
          >
            {historyQuery.isFetching ? <ButtonLoader icon="history" /> : null}
            <span>{tManagerUi('retry')}</span>
          </button>
        </div>
      ) : historyQuery.isPending ? (
        <div className="ss-empty-state p-12 rounded-2xl bg-card border border-border flex items-center justify-center" role="status">
          <LibraryLoader size="md" icon="history" variant="contra" />
        </div>
      ) : filtered.length === 0 ? (
        <ManagerSeatsHistoryEmptyState className="ss-empty-state p-12 rounded-2xl bg-card border border-border text-center space-y-2">
          <p className="text-2xl">📜</p>
          <p className="text-sm font-semibold text-primary">
            {hasActiveFilters
              ? tManagerUi('no_seat_history_matches_current_filters')
              : tManagerUi('no_seat_history_records_found')}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary underline hover:opacity-80 pt-1 cursor-pointer"
            >
              Clear all filters to view all records
            </button>
          )}
        </ManagerSeatsHistoryEmptyState>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
                <Armchair size={18} className="text-primary" /> Seat Occupancy & Allocation Log
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Detailed historical audit log of seat occupancy, past student assignments, and vacancy periods
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-border text-secondary shrink-0">
              {filtered.length} entries matching
            </span>
          </div>

          <ManagerSeatsHistoryNativeTable
            rows={filtered}
            columns={colDefs}
            label={tManagerUi('seat_history')}
            getRowKey={(row) =>
              [row.seatNo, row.smartId, row.occupiedFrom, row.occupiedTill, row.reason, row.duration].join('|')
            }
          />
        </div>
      )}

      {/* Seat Incident Audit Modal */}
      <ManagerSeatsHistoryAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        seatOptions={seatOptions}
        historyData={seatHistoryData}
        initialSeat={seatFilter !== 'all' ? seatFilter : seatOptions[0] ?? ''}
        onApplySeatFilter={handleApplyAuditFilter}
      />
    </div>
  );
}
