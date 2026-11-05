'use client';

import React from 'react';
import { Search, X, Download } from 'lucide-react';

interface ManagerSettingsHelpSupportTicketsToolbarProps {
  totalTicketsCount: number;
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
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-secondary">Ticket Log</span>
        <span className="mgr-badge mgr-badge--info text-xs font-mono">{totalTicketsCount} Tickets</span>
      </div>

      {/* Multi-Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search ticket ID, subject..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
        >
          <option value="all">All Categories</option>
          <option value="Finance">Finance</option>
          <option value="General">General</option>
          <option value="Facility">Facility</option>
          <option value="Technical">Technical</option>
        </select>

        <select
          aria-label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          aria-label="Filter by Priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
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
          className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
          title="Export Tickets CSV"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
    </div>
  );
}

