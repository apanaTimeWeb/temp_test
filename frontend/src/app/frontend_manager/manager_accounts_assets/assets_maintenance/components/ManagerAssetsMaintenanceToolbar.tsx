'use client';

import { Search, X, RotateCcw, ListFilter, Clock, Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { MaintenancePriority, MaintenanceType } from './ManagerAssetsMaintenanceTable';

interface ManagerAssetsMaintenanceToolbarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  counts: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  onResetFilters: () => void;
}

export function ManagerAssetsMaintenanceToolbar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  typeFilter,
  onTypeChange,
  counts,
  onResetFilters,
}: ManagerAssetsMaintenanceToolbarProps) {
  const isFiltered =
    statusFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    priorityFilter !== 'all' ||
    typeFilter !== 'all';

  const statusTabs = [
    {
      id: 'all',
      label: 'All Tickets',
      count: counts.all,
      icon: ListFilter,
      activeStyle: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
        color: '#ffffff',
      },
    },
    {
      id: 'pending',
      label: 'Pending',
      count: counts.pending,
      icon: Clock,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: counts.inProgress,
      icon: Wrench,
      activeStyle: {
        boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
        backgroundColor: '#0ea5e9',
        borderColor: '#38bdf8',
        color: '#ffffff',
      },
    },
    {
      id: 'completed',
      label: 'Completed',
      count: counts.completed,
      icon: CheckCircle2,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Status Pills with Glowing Color Halo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                style={isActive ? tab.activeStyle : undefined}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
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
              </button>
            );
          })}
        </div>

        {isFiltered && (
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

      {/* Bottom Row: Search and Secondary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input with non-overlapping padding and clear button */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by asset name, issue, or vendor..."
            style={{ paddingLeft: '2.6rem', paddingRight: '2.25rem' }}
            className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority & Type Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
            aria-label="Filter by maintenance type"
          >
            <option value="all">All Service Types</option>
            <option value="preventive">Preventive</option>
            <option value="breakdown">Breakdown</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ManagerAssetsMaintenanceToolbar;
