'use client';

import React from 'react';
import { Search, X, Download, Filter, RotateCcw, Ticket } from 'lucide-react';

interface ManagerSettingsHelpSupportTicketsToolbarProps {
  totalTicketsCount: number;
  totalAllTicketsCount?: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
}

export function ManagerSettingsHelpSupportTicketsToolbar({
  totalTicketsCount,
  totalAllTicketsCount,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
}: ManagerSettingsHelpSupportTicketsToolbarProps) {
  const activeFiltersCount =
    (searchQuery.trim() ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0);

  return (
    <div className="p-4 border-b border-border bg-card/60 flex flex-col gap-3.5">
      {/* Top Header Row: Title, Counter & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">Ticket Log</span>
          </div>

          <span className="mgr-badge mgr-badge--info text-xs font-mono">
            {totalAllTicketsCount !== undefined && totalAllTicketsCount !== totalTicketsCount
              ? `${totalTicketsCount} of ${totalAllTicketsCount} Tickets`
              : `${totalTicketsCount} ${totalTicketsCount === 1 ? 'Ticket' : 'Tickets'}`}
          </span>

          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Filter size={10} />
              <span>{activeFiltersCount} Active</span>
            </span>
          )}
        </div>

        {/* Action Buttons: Reset & Export */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-danger hover:border-danger/30 hover:bg-danger-bg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
            title="Export Tickets CSV"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Controls Row: Search Input + Filter Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center gap-2.5">
        {/* Search Box with Non-Overlapping Icon & Clear Button */}
        <div className="relative flex-1 min-w-0 sm:min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Search ticket ID, subject..."
            className="mgr-input !pl-10 !py-2 text-xs w-full"
            style={{ paddingLeft: '2.5rem', paddingRight: searchQuery ? '2.25rem' : '1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`mgr-select text-xs !py-2 px-3 h-9 w-full md:min-w-[135px] rounded-lg transition-all cursor-pointer ${
                categoryFilter !== 'all'
                  ? '!border-primary !text-primary bg-primary/10 font-semibold ring-1 ring-primary/20'
                  : 'text-secondary bg-surface'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="General">General</option>
              <option value="Facility">Facility</option>
              <option value="Technical">Technical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`mgr-select text-xs !py-2 px-3 h-9 w-full md:min-w-[120px] rounded-lg transition-all cursor-pointer ${
                statusFilter !== 'all'
                  ? '!border-primary !text-primary bg-primary/10 font-semibold ring-1 ring-primary/20'
                  : 'text-secondary bg-surface'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={`mgr-select text-xs !py-2 px-3 h-9 w-full md:min-w-[125px] rounded-lg transition-all cursor-pointer ${
                priorityFilter !== 'all'
                  ? '!border-primary !text-primary bg-primary/10 font-semibold ring-1 ring-primary/20'
                  : 'text-secondary bg-surface'
              }`}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
