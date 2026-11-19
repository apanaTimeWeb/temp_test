'use client';

import { format, parseISO, isValid } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Search, Download, X, History, RotateCcw, Calendar, Armchair, ShieldAlert, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { LibraryLoader, ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';

import { ManagerSeatsHistoryNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { sanitizeManagerSeatHistoryCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryCsv';
import { useManagerSeatsHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/hooks/useManagerSeatsHistoryTables';
import type { ManagerSeatsHistoryRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import { MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/constants/ManagerSeatsHistoryConstants';
import type {
  ManagerSeatsHistoryNativeColumn as ColDef,
  ManagerSeatsHistoryNativeCellParams as ICellRendererParams,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { ManagerSeatsHistoryEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_empty_states/ManagerSeatsHistoryEmptyState';
import { ManagerSeatsHistoryAuditModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_dialogs/ManagerSeatsHistoryAuditModal';

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

  const colDefs: ColDef<ManagerSeatsHistoryRow>[] = useMemo(() => {
    const formatHistoryDate = (value: string) => {
      const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
      if (!match) return value;
      const date = parseISO(match[1]);
      if (!isValid(date)) return value;
      return format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enUS });
    };

    const formatShift = (value: string) =>
    ({
      Morning: tManagerUi('morning'),
      Afternoon: tManagerUi('afternoon'),
      Evening: tManagerUi('evening'),
      Night: tManagerUi('night'),
      'Full Day': tManagerUi('full_day'),
    }[value] ?? value);

    const formatReason = (value: string) => {
      if (value === 'Admission') return tManagerUi('history_reason_admission');
      if (value === 'Shift Change') return tManagerUi('history_reason_shift_change');
      if (value === 'Seat Change') return tManagerUi('history_reason_seat_change');
      return value;
    };

    return [
      {
        field: 'seatNo',
        headerName: tManagerUi('seat'),
        flex: 0.9,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
          <span className="font-mono font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded text-xs">
            {String(params.value ?? '')}
          </span>
        ),
      },
      {
        field: 'studentName',
        headerName: tManagerUi('student_71ad6e'),
        flex: 1.6,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
          <span className="font-semibold text-primary block leading-tight">{String(params.value ?? '')}</span>
        ),
      },
      {
        field: 'smartId',
        headerName: tManagerUi('smart_id'),
        flex: 1.1,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
          <span className="font-mono text-xs text-secondary">{String(params.value ?? '—')}</span>
        ),
      },
      {
        field: 'shift',
        headerName: tManagerUi('shift_149b8d'),
        flex: 1.1,
        valueFormatter: (params: { value?: unknown }) => formatShift(String(params.value ?? '')),
      },
      {
        field: 'occupiedFrom',
        headerName: tManagerUi('from_8e7f00'),
        flex: 1.3,
        valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')),
      },
      {
        field: 'occupiedTill',
        headerName: tManagerUi('till'),
        flex: 1.3,
        valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')),
      },
      {
        field: 'duration',
        headerName: tManagerUi('duration'),
        flex: 1,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
          <span className="text-secondary font-mono text-xs">{String(params.value ?? '—')}</span>
        ),
      },
      {
        field: 'reason',
        headerName: tManagerUi('reason'),
        flex: 1.2,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => {
          const reason = String(params.value ?? '');
          return (
            <span className={MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES[reason] ?? 'ss-badge ss-badge--inactive'}>
              {formatReason(reason)}
            </span>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => {
          const status = String(params.value ?? 'Active');
          const isActive = status.toLowerCase() === 'active';
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-surface text-secondary border border-border'
                }`}
            >
              {status}
            </span>
          );
        },
      },
    ];
  }, [locale, tManagerUi]);

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
    toast.success('Seat history exported successfully');
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
    toast.info(`Filtered to Seat ${seatNo} (${horizon === '30days' ? 'Past 1 Month' : 'All Time'})`);
  };

  return (
    <div className="ss-page !p-0 space-y-4 w-full min-w-0">
      {/* ── Top Unified Control Center (Clean 2-Tier Toolbar) ── */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
        {/* Tier 1: Title, Metrics & Export Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <History size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-primary">{tManagerUi('seat_history')}</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface text-primary border border-border">
                  {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
                </span>
                {timeHorizon === '30days' && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Past 1 Month Active
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary mt-0.5">
                {tManagerUi('complete_occupancy_history_for_every_seat')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="manager-seat-history-audit-modal-btn"
              className="inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors cursor-pointer"
              onClick={() => setIsAuditModalOpen(true)}
              title="Audit past 1 month occupants of a seat for damage or theft complaints"
            >
              <ShieldAlert size={14} /> Audit Seat Incident (Past 1 Month)
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
              onClick={handleExportCsv}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Tier 2: Search & Multi-Filter Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Universal Student / Smart ID / Seat Search */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 sm:min-w-[280px]">
            <select
              aria-label="Search Scope"
              data-testid="manager-seats-search-scope"
              className="bg-surface text-primary text-xs font-semibold px-2 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value as any)}
            >
              <option value="all">🔍 All Fields</option>
              <option value="studentName">👤 Student Name</option>
              <option value="seatNo">🪑 Seat No</option>
              <option value="smartId">💳 Smart ID</option>
            </select>

            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
              />
              <input
                aria-label={tManagerUi('search_by_student_name_or_id')}
                data-testid="manager-seats-history-search-input"
                type="search"
                placeholder={
                  searchScope === 'studentName'
                    ? 'Search by Student Name (e.g. Rahul, Priya)...'
                    : searchScope === 'seatNo'
                      ? 'Search by Seat No (e.g. S-001)...'
                      : searchScope === 'smartId'
                        ? 'Search by Smart ID (e.g. TEST-001)...'
                        : 'Search by Student Name, Seat No, Smart ID...'
                }
                className="mgr-input !pl-9 pr-8 text-xs w-full h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns & Date Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick 1 Month Button */}
            <button
              type="button"
              data-testid="manager-quick-past-1-month-btn"
              onClick={() => setTimeHorizon(timeHorizon === '30days' ? 'all' : '30days')}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 h-9 rounded-xl border transition-all cursor-pointer shrink-0 ${timeHorizon === '30days'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-xs ring-1 ring-amber-500/30'
                  : 'border-border bg-surface text-secondary hover:text-primary hover:border-amber-500/40'
                }`}
              title="Filter to Past 1 Month Occupants (Audit mode for damage or theft)"
            >
              <Calendar size={13} className={timeHorizon === '30days' ? 'text-amber-400' : 'text-secondary'} />
              <span>Past 1 Month</span>
            </button>

            {/* Time Horizon Selector */}
            <select
              aria-label="Filter by Time Horizon"
              data-testid="manager-seats-time-horizon"
              className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value as any)}
            >
              <option value="all">🗓️ All Recorded Time</option>
              <option value="30days">🗓️ Past 1 Month (30 Days)</option>
              <option value="7days">⚡ Past 7 Days</option>
              <option value="90days">📅 Past 3 Months</option>
            </select>

            {/* Seat Selector */}
            <select
              aria-label={tManagerUi('filter_by_seat')}
              data-testid="manager-seats-history-seat-filter"
              className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
              value={seatFilter}
              onChange={(e) => setSeatFilter(e.target.value)}
            >
              <option value="all">🪑 {tManagerUi('all_seats')}</option>
              {seatOptions.map((seatNo) => (
                <option key={seatNo} value={seatNo}>
                  {seatNo}
                </option>
              ))}
            </select>

            {/* Shift Selector */}
            <select
              aria-label="Filter by Shift"
              className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
            >
              <option value="all">⏱️ All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="Full Day">Full Day</option>
            </select>

            {/* Reason Selector */}
            <select
              aria-label="Filter by Reason"
              className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer shrink-0"
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
            >
              <option value="all">📋 All Reasons</option>
              <option value="Admission">Admission</option>
              <option value="Shift Change">Shift Change</option>
              <option value="Seat Change">Seat Change</option>
            </select>

            {/* Date From */}
            <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-border bg-surface text-xs shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">From:</span>
              <input
                aria-label={tManagerUi('date_from')}
                type="date"
                className="bg-transparent text-primary text-xs focus:outline-none cursor-pointer"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-border bg-surface text-xs shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">To:</span>
              <input
                aria-label={tManagerUi('date_to')}
                type="date"
                className="bg-transparent text-primary text-xs focus:outline-none cursor-pointer"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 h-9 rounded-xl border border-danger/30 bg-danger-bg text-danger hover:bg-danger/20 transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw size={13} className="shrink-0 text-danger" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Audit Filter Banner Notification */}
        {timeHorizon === '30days' && (
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-400 shrink-0" />
              <span>
                <strong>Incident Audit Filter Active:</strong> Showing occupants from the <strong>Past 1 Month (30 Days)</strong>
                {seatFilter !== 'all' ? (
                  <>
                    {' '}
                    specifically on <strong className="underline">Seat {seatFilter}</strong>
                  </>
                ) : (
                  ' across all seats'
                )}
                . Use this roster to investigate broken seats or theft reports.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTimeHorizon('all')}
              className="text-[11px] font-semibold underline text-amber-200 hover:text-white cursor-pointer shrink-0 ml-2"
            >
              Clear 1-Month Horizon
            </button>
          </div>
        )}
      </div>

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
