'use client';
// RESPONSIBILITY: Render modern Cyber-Luxury search and status filters for Platform Notices.
// FLOW: SuperadminCommunicationNoticesPageClient -> SuperadminCommunicationNoticesFilters.

import React from 'react';
import { RotateCcw, Search } from 'lucide-react';

interface NoticesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'All' | 'Active' | 'Expired';
  onStatusChange: (status: 'All' | 'Active' | 'Expired') => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function SuperadminCommunicationNoticesFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  hasActiveFilters,
  onReset,
}: NoticesFiltersProps) {
  return (
    <div className="rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, message, or author..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/25 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all shadow-inner"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 justify-end flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as 'All' | 'Active' | 'Expired')}
              className="py-2 px-3 rounded-xl bg-slate-950/80 border border-indigo-500/25 text-slate-200 text-xs focus:ring-2 focus:ring-sky-400/50 focus:outline-none transition-all cursor-pointer shadow-inner [color-scheme:dark]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Expired">Expired Only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
