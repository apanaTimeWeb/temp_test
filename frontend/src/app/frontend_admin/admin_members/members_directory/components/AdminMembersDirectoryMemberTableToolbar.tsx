'use client';

import { Clock, DownloadCloud, FileSpreadsheet, Filter, IndianRupee, Printer, RotateCcw, Search, X } from 'lucide-react';

interface AdminMembersDirectoryMemberTableToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  planFilter: string;
  onPlanFilterChange: (plan: string) => void;
  availablePlans: readonly string[];
  shiftFilter: string;
  onShiftFilterChange: (shift: string) => void;
  availableShifts: readonly string[];
  feeFilter: 'all' | 'Paid' | 'Due';
  onFeeFilterChange: (fee: 'all' | 'Paid' | 'Due') => void;
  isFilterActive: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  matchedCount: number;
  totalCount: number;
}

export function AdminMembersDirectoryMemberTableToolbar({
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanFilterChange,
  availablePlans,
  shiftFilter,
  onShiftFilterChange,
  availableShifts,
  feeFilter,
  onFeeFilterChange,
  isFilterActive,
  onResetFilters,
  onExportCsv,
  onExportExcel,
  onPrint,
  matchedCount,
  totalCount,
}: AdminMembersDirectoryMemberTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 border-b border-border bg-surface-highlight">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-info-text pointer-events-none" aria-hidden="true" />
          <input
            maxLength={100}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search member by name, ID, phone, email, seat, plan..."
            className="w-full rounded-xl border border-border bg-input pl-10 pr-9 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary motion-safe:transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary motion-safe:transition-colors"
            >
              <X size={14} className="text-danger-text" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onExportCsv} title="Download filtered members as CSV" className="inline-flex items-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-2 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card">
            <DownloadCloud size={14} className="shrink-0" aria-hidden="true" /> <span>CSV</span>
          </button>
          <button type="button" onClick={onExportExcel} title="Download filtered members as Excel (.xls)" className="inline-flex items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card">
            <FileSpreadsheet size={14} className="shrink-0" aria-hidden="true" /> <span>Excel</span>
          </button>
          <button type="button" onClick={onPrint} title="Print member directory roster" className="inline-flex items-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-2 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity shadow-card">
            <Printer size={14} className="shrink-0" aria-hidden="true" /> <span>Print</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center">
            <Filter size={13} className="absolute left-2.5 text-purple pointer-events-none" aria-hidden="true" />
            <select value={planFilter} onChange={(e) => onPlanFilterChange(e.target.value)} aria-label="Filter by plan" className="rounded-xl border border-border bg-input pl-7 pr-3 py-1.5 text-xs text-text-primary focus:border-border-focus focus:outline-none motion-safe:transition-colors">
              <option value="all">All Plans</option>
              {availablePlans.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
            </select>
          </div>

          {availableShifts.length > 0 && (
            <div className="relative flex items-center">
              <Clock size={13} className="absolute left-2.5 text-info-text pointer-events-none" aria-hidden="true" />
              <select value={shiftFilter} onChange={(e) => onShiftFilterChange(e.target.value)} aria-label="Filter by shift" className="rounded-xl border border-border bg-input pl-7 pr-3 py-1.5 text-xs text-text-primary focus:border-border-focus focus:outline-none motion-safe:transition-colors">
                <option value="all">All Shifts</option>
                {availableShifts.map((shift) => <option key={shift} value={shift}>{shift}</option>)}
              </select>
            </div>
          )}

          <div className="relative flex items-center">
            <IndianRupee size={13} className="absolute left-2.5 text-success-text pointer-events-none" aria-hidden="true" />
            <select value={feeFilter} onChange={(e) => onFeeFilterChange(e.target.value as 'all' | 'Paid' | 'Due')} aria-label="Filter by fee status" className="rounded-xl border border-border bg-input pl-7 pr-3 py-1.5 text-xs text-text-primary focus:border-border-focus focus:outline-none motion-safe:transition-colors">
              <option value="all">All Fees</option>
              <option value="Paid">Paid</option>
              <option value="Due">Due Fee</option>
            </select>
          </div>

          {isFilterActive && (
            <button type="button" onClick={onResetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-danger bg-danger-bg px-2.5 py-1.5 text-xs font-semibold text-danger-text hover:opacity-90 motion-safe:transition-opacity">
              <RotateCcw size={12} aria-hidden="true" /> Reset
            </button>
          )}
        </div>

        <span className="text-[11px] font-medium text-text-secondary shrink-0">{matchedCount} of {totalCount} records</span>
      </div>
    </div>
  );
}
