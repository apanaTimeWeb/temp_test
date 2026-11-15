'use client';

import { Search, Download, X, RotateCcw, CheckCircle2, Clock, Layers } from 'lucide-react';

export interface ManagerAccountsDailySettlementToolbarProps {
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
  counts?: {
    all: number;
    settled: number;
    pending: number;
  };
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
  counts,
}: ManagerAccountsDailySettlementToolbarProps) {
  const statusTabs = [
    {
      id: 'all',
      label: 'All Shifts',
      count: counts ? counts.all : totalCount,
      icon: Layers,
      activeStyle: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
        color: '#ffffff',
      },
    },
    {
      id: 'settled',
      label: 'Settled & Verified',
      count: counts ? counts.settled : 0,
      icon: CheckCircle2,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
    {
      id: 'pending',
      label: 'Pending Verification',
      count: counts ? counts.pending : 0,
      icon: Clock,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Status Pills with Glowing Color Halos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter.toLowerCase() === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={isActive ? tab.activeStyle : undefined}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? tab.id === 'pending'
                          ? 'bg-black/20 text-black'
                          : 'bg-white/25 text-white'
                        : 'bg-muted text-secondary'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Reset all active filters"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Non-Overlapping Search & Secondary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input with Guaranteed Non-Overlapping Icon & Clear Button */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shift name or settled by manager..."
            style={{ paddingLeft: '2.6rem', paddingRight: '2.25rem' }}
            className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Secondary Filter Controls: Shift Dropdown & Export Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <select
            aria-label="Filter by Shift"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Full Day">Full Day</option>
          </select>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer shrink-0"
            title="Export Daily Settlement as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsDailySettlementToolbar;
