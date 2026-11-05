'use client';
import { Search, Download, X } from 'lucide-react';

interface ManagerAccountsDailySettlementToolbarProps {
  filteredCount: number;
  totalCount: number;
  dateScopeLabel: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
}

export function ManagerAccountsDailySettlementToolbar({
  filteredCount,
  totalCount,
  dateScopeLabel,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  shiftFilter,
  setShiftFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
}: ManagerAccountsDailySettlementToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-base font-bold text-primary">Shift Settlements Register</h2>
        <span className="mgr-badge mgr-badge--info text-xs font-mono">
          Showing {filteredCount} of {totalCount} Shifts ({dateScopeLabel})
        </span>
      </div>

      {/* Multi-Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search shift or settled by..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by Settlement Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-9 py-1 px-3 bg-muted border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="settled">Settled / Verified</option>
          <option value="pending">Pending</option>
        </select>

        <select
          aria-label="Filter by Shift"
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          className="min-h-9 py-1 px-3 bg-muted border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
        >
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
          <option value="Full Day">Full Day</option>
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

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
          title="Export Daily Settlement as CSV"
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

