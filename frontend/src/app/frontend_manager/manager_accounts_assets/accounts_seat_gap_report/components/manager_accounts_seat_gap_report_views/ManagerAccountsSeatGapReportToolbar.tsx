'use client';

import { Clock,Moon,RotateCcw,Search,Sun,Sunrise,X } from 'lucide-react';

interface ManagerAccountsSeatGapReportToolbarProps {
  shiftFilter: string;
  onShiftChange: (shift: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  floorFilter: string;
  onFloorChange: (floor: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  floors: string[];
  counts: {
    all: number;
    morning: number;
    afternoon: number;
    night: number;
  };
  onResetFilters: () => void;
}

export function ManagerAccountsSeatGapReportToolbar({
  shiftFilter,
  onShiftChange,
  statusFilter,
  onStatusChange,
  floorFilter,
  onFloorChange,
  searchQuery,
  onSearchChange,
  floors,
  counts,
  onResetFilters,
}: ManagerAccountsSeatGapReportToolbarProps) {
  const isFiltered =
    shiftFilter !== 'all' ||
    statusFilter !== 'all' ||
    floorFilter !== 'all' ||
    searchQuery.trim() !== '';

  const shiftTabs = [
    {
      id: 'all',
      label: 'All Shifts',
      count: counts.all,
      icon: Clock,
      activeStyle: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
        color: '#ffffff',
      },
    },
    {
      id: 'Morning',
      label: 'Morning',
      count: counts.morning,
      icon: Sunrise,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
    {
      id: 'Afternoon',
      label: 'Afternoon',
      count: counts.afternoon,
      icon: Sun,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
    {
      id: 'Night',
      label: 'Night',
      count: counts.night,
      icon: Moon,
      activeStyle: {
        boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
        backgroundColor: '#a855f7',
        borderColor: '#c084fc',
        color: '#ffffff',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Shift Pills with Glowing Color Halo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {shiftTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = shiftFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onShiftChange(tab.id)}
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
                      ? tab.id === 'Afternoon'
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
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger-bg px-2.5 py-1.5 rounded-lg motion-safe:transition-colors cursor-pointer"
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
        <div className="relative flex-1 flex items-center">
          <input maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search seat number, floor, or shift..."
            style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
            className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary motion-safe:transition-all"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors z-10"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter & Floor Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
            aria-label="Filter by condition status"
          >
            <option value="all">All Statuses</option>
            <option value="vacant">Vacant Seats</option>
            <option value="maintenance">Under Maintenance</option>
          </select>

          <select
            value={floorFilter}
            onChange={(e) => onFloorChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
            aria-label="Filter by floor"
          >
            <option value="all">All Floors</option>
            {floors.map((f) => (
              <option key={f} value={f}>
                {f.toLowerCase().includes('floor') ? f : `${f} Floor`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsSeatGapReportToolbar;
