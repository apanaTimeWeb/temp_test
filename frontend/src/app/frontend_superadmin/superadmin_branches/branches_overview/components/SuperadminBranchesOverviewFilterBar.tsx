'use client';
// RESPONSIBILITY: Provide search, multi-tenant library filter, and status filter for branches.
import { Search, X, RotateCcw, Download, FileSpreadsheet, Printer } from 'lucide-react';
import type { SuperadminLibraryOption, BranchOperatingStatus } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  selectedLibraryId: string;
  setSelectedLibraryId: (v: string) => void;
  statusFilter: 'all' | BranchOperatingStatus;
  setStatusFilter: (v: 'all' | BranchOperatingStatus) => void;
  availableLibraries: SuperadminLibraryOption[];
  onReset: () => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SuperadminBranchesOverviewFilterBar({
  search,
  setSearch,
  selectedLibraryId,
  setSelectedLibraryId,
  statusFilter,
  setStatusFilter,
  availableLibraries,
  onReset,
  onExportCsv,
  onExportExcel,
  onPrint,
  filteredCount,
  totalCount,
}: SuperadminBranchesOverviewFilterBarProps) {
  const hasFilters = search !== '' || selectedLibraryId !== 'all' || statusFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 w-full shadow-md">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
        <input maxLength={30}
          type="search"
          placeholder="Search by branch name, code, manager, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Library Account Multi-Tenant Filter */}
      <select
        aria-label="Filter by Library Account"
        value={selectedLibraryId}
        onChange={(e) => setSelectedLibraryId(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer"
      >
        <option value="all">All Library Accounts</option>
        {availableLibraries.map((lib) => (
          <option key={lib.id} value={lib.id}>
            {lib.name} ({lib.currentBranchCount} branches)
          </option>
        ))}
      </select>

      {/* Operating Status Filter */}
      <select
        aria-label="Filter by Operating Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as 'all' | BranchOperatingStatus)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active Only</option>
        <option value="suspended">Suspended Only</option>
        <option value="closed">Closed / Archived Only</option>
      </select>

      {/* Reset */}
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 transition-all cursor-pointer"
          title="Clear all filters"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      )}

      {/* Export & Print Tools */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
            title="Export filtered branches to CSV"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
        )}
        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-all"
            title="Export filtered branches to Excel (XLSX)"
          >
            <FileSpreadsheet size={13} />
            <span>Excel</span>
          </button>
        )}
        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/60 bg-slate-800/60 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-all"
            title="Print-friendly branch directory"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
        )}
      </div>

      {/* Item count */}
      <span className="ml-auto text-xs text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg bg-surface border border-border">
        {filteredCount} of {totalCount} Branches
      </span>
    </div>
  );
}
