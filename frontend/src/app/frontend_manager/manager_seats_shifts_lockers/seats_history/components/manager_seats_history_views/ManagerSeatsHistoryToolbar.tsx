'use client';

import { Calendar, Download, History, RotateCcw, Search, ShieldAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ManagerSeatsHistoryToolbarProps {
  filteredCount: number;
  timeHorizon: 'all' | '7days' | '30days' | '90days';
  setTimeHorizon: (value: 'all' | '7days' | '30days' | '90days') => void;
  searchScope: 'all' | 'studentName' | 'seatNo' | 'smartId';
  setSearchScope: (value: 'all' | 'studentName' | 'seatNo' | 'smartId') => void;
  search: string;
  setSearch: (value: string) => void;
  seatFilter: string;
  setSeatFilter: (value: string) => void;
  seatOptions: string[];
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
  reasonFilter: string;
  setReasonFilter: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onOpenAuditModal: () => void;
}

/** Unified 2-tier filter, search, export, and incident-audit toolbar for Seat History. */
export function ManagerSeatsHistoryToolbar({
  filteredCount,
  timeHorizon,
  setTimeHorizon,
  searchScope,
  setSearchScope,
  search,
  setSearch,
  seatFilter,
  setSeatFilter,
  seatOptions,
  shiftFilter,
  setShiftFilter,
  reasonFilter,
  setReasonFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  onOpenAuditModal,
}: ManagerSeatsHistoryToolbarProps) {
  const tManagerUi = useTranslations('manager.manager_seat_history.ui');

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
            <History size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-primary">{tManagerUi('seat_history')}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface text-primary border border-border">
                {filteredCount} {filteredCount === 1 ? 'record' : 'records'}
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
            className="inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 motion-safe:transition-colors cursor-pointer"
            onClick={onOpenAuditModal}
            title="Audit past 1 month occupants of a seat for damage or theft complaints"
          >
            <ShieldAlert size={14} /> Audit Seat Incident (Past 1 Month)
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            onClick={onExportCsv}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 sm:min-w-[280px]">
          <select
            aria-label="Search Scope"
            data-testid="manager-seats-search-scope"
            className="bg-surface text-primary text-xs font-semibold px-2 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
            value={searchScope}
            onChange={(e) => setSearchScope(e.target.value as 'all' | 'studentName' | 'seatNo' | 'smartId')}
          >
            <option value="all">🔍 All Fields</option>
            <option value="studentName">👤 Student Name</option>
            <option value="seatNo">🪑 Seat No</option>
            <option value="smartId">💳 Smart ID</option>
          </select>

          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            <input
              maxLength={30}
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full motion-safe:transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="manager-quick-past-1-month-btn"
            onClick={() => setTimeHorizon(timeHorizon === '30days' ? 'all' : '30days')}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 h-9 rounded-xl border motion-safe:transition-all cursor-pointer shrink-0 ${
              timeHorizon === '30days'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-xs ring-1 ring-amber-500/30'
                : 'border-border bg-surface text-secondary hover:text-primary hover:border-amber-500/40'
            }`}
            title="Filter to Past 1 Month Occupants (Audit mode for damage or theft)"
          >
            <Calendar size={13} className={timeHorizon === '30days' ? 'text-amber-400' : 'text-secondary'} />
            <span>Past 1 Month</span>
          </button>

          <select
            aria-label="Filter by Time Horizon"
            data-testid="manager-seats-time-horizon"
            className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value as 'all' | '7days' | '30days' | '90days')}
          >
            <option value="all">🗓️ All Recorded Time</option>
            <option value="30days">🗓️ Past 1 Month (30 Days)</option>
            <option value="7days">⚡ Past 7 Days</option>
            <option value="90days">📅 Past 3 Months</option>
          </select>

          <select
            aria-label={tManagerUi('filter_by_seat')}
            data-testid="manager-seats-history-seat-filter"
            className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
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

          <select
            aria-label="Filter by Shift"
            className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
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

          <select
            aria-label="Filter by Reason"
            className="bg-surface text-primary text-xs font-semibold px-2.5 h-9 rounded-xl border border-border hover:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors cursor-pointer shrink-0"
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
          >
            <option value="all">📋 All Reasons</option>
            <option value="Admission">Admission</option>
            <option value="Shift Change">Shift Change</option>
            <option value="Seat Change">Seat Change</option>
          </select>

          <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-border bg-surface text-xs shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">From:</span>
            <input
              maxLength={100}
              aria-label={tManagerUi('date_from')}
              type="date"
              className="bg-transparent text-primary text-xs focus:outline-none cursor-pointer"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-border bg-surface text-xs shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">To:</span>
            <input
              maxLength={100}
              aria-label={tManagerUi('date_to')}
              type="date"
              className="bg-transparent text-primary text-xs focus:outline-none cursor-pointer"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 h-9 rounded-xl border border-danger bg-danger-bg text-danger hover:opacity-90 motion-safe:transition-opacity cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw size={13} className="shrink-0 text-danger" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {timeHorizon === '30days' && (
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs motion-safe:animate-in fade-in">
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
  );
}
