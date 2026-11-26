'use client';
// RESPONSIBILITY: Provide search, multi-tenant library filter, and status filter for branches.
import { Search, X, RotateCcw } from 'lucide-react';
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
  filteredCount,
  totalCount,
}: SuperadminBranchesOverviewFilterBarProps) {
  const hasFilters = search !== '' || selectedLibraryId !== 'all' || statusFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-card border border-border w-full shadow-card">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          maxLength={30}
          type="search"
          placeholder="Search by branch name, code, manager, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-input text-foreground placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Library Account Multi-Tenant Filter */}
      <select
        aria-label="Filter by Library Account"
        value={selectedLibraryId}
        onChange={(e) => setSelectedLibraryId(e.target.value)}
        className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
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
        className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
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
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-danger-bg text-danger border border-danger-border hover:bg-danger-bg motion-safe:transition-all cursor-pointer"
          title="Clear all filters"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      )}

      {/* Filter summary */}
      <div className="text-xs text-muted ml-auto font-medium">
        Showing {filteredCount} of {totalCount} branches
      </div>
    </div>
  );
}
