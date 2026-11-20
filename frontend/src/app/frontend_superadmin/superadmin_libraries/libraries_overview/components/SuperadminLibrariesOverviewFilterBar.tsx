'use client';
/** Responsibility: Superadmin Libraries Overview Filter Bar; handles search text, plan dropdown, status tabs, reset action, and export triggers. */
import { Search, X, RotateCcw, Download, FileSpreadsheet, Printer } from 'lucide-react';

interface SuperadminLibrariesOverviewFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  planFilter: string;
  setPlanFilter: (plan: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrintRoster: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SuperadminLibrariesOverviewFilterBar({
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  onExportExcel,
  onPrintRoster,
  filteredCount,
  totalCount,
}: SuperadminLibrariesOverviewFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 w-full max-w-full min-w-0 shadow-md">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px] w-full sm:w-auto">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
        <input
          type="search"
          placeholder="Search by library name, owner, city, code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer p-0.5"
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Plan Filter */}
      <select
        aria-label="Filter by plan"
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Membership Plans</option>
        <option value="Enterprise">Enterprise Plan</option>
        <option value="Pro">Pro Plan</option>
        <option value="Starter">Starter Plan</option>
      </select>

      {/* Status Filter */}
      <select
        aria-label="Filter by operating status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Operating Statuses</option>
        <option value="Active">Active Facilities</option>
        <option value="Maintenance">Under Maintenance</option>
      </select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 hover:text-rose-100 transition-all cursor-pointer shadow-sm shadow-rose-950/40"
          title="Clear all active filters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      )}

      {/* Export Action Tools & Count Pill */}
      <div className="ml-auto flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Export filtered libraries to CSV"
        >
          <Download size={13} className="text-teal-400" />
          <span>CSV</span>
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Export filtered libraries to Excel (.xls)"
        >
          <FileSpreadsheet size={13} className="text-indigo-400" />
          <span>Excel</span>
        </button>

        <button
          type="button"
          onClick={onPrintRoster}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Print facilities roster"
        >
          <Printer size={13} className="text-sky-400" />
          <span>Print</span>
        </button>

        <span className="text-xs text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg bg-surface border border-border">
          {filteredCount} of {totalCount} Libraries
        </span>
      </div>
    </div>
  );
}
