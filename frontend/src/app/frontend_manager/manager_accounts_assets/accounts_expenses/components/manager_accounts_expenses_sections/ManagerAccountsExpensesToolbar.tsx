'use client';
import { Search, X, Download } from 'lucide-react';

interface ManagerAccountsExpensesToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  modeFilter: string;
  setModeFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  searchedCount: number;
  totalCount: number;
  timeHorizonLabel: string;
  onExportCsv: () => void;
}

export function ManagerAccountsExpensesToolbar({
  searchQuery,
  setSearchQuery,
  modeFilter,
  setModeFilter,
  hasActiveFilters,
  onResetFilters,
  searchedCount,
  totalCount,
  timeHorizonLabel,
  onExportCsv,
}: ManagerAccountsExpensesToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search description, payee, or category..."
            className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by Payment Mode"
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="min-h-9 py-1.5 px-3 bg-muted border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
        >
          <option value="all">All Modes</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="bank">Bank Transfer</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            title="Reset all filters"
          >
            <X size={13} /> Reset
          </button>
        )}

        <span className="text-xs font-semibold text-secondary px-1 shrink-0">
          Showing {searchedCount} of {totalCount} expenses ({timeHorizonLabel})
        </span>
      </div>

      <button
        type="button"
        onClick={onExportCsv}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
        title="Export Expenses as CSV"
      >
        <Download size={13} />
        <span>Export CSV</span>
      </button>
    </div>
  );
}

