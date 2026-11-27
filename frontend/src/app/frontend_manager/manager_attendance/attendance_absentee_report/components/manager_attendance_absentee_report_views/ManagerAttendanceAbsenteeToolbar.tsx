'use client';

import { RotateCcw, Search, X } from 'lucide-react';

const SHIFT_OPTIONS = [
  { id: 'All', label: 'All Shifts' },
  { id: 'Morning', label: 'Morning' },
  { id: 'Afternoon', label: 'Afternoon' },
  { id: 'Evening', label: 'Evening' },
  { id: 'Night', label: 'Night' },
  { id: 'Full Day', label: 'Full Day' },
];

const THRESHOLD_OPTIONS = [
  { id: '3', label: '3+ Days' },
  { id: '5', label: '5+ Days' },
  { id: '7', label: '7+ Days Critical' },
  { id: 'all', label: 'Show All' },
];

const ALERT_STATUS_OPTIONS = [
  { id: 'all', label: 'All Statuses' },
  { id: 'pending', label: 'Pending Alert' },
  { id: 'notified', label: 'Notified' },
] as const;

interface ManagerAttendanceAbsenteeToolbarProps {
  shift: string;
  onShiftChange: (value: string) => void;
  alertStatusFilter: 'all' | 'pending' | 'notified';
  onAlertStatusChange: (value: 'all' | 'pending' | 'notified') => void;
  leaveStatusFilter: 'all' | 'unexcused_risk' | 'on_leave';
  onLeaveStatusChange: (value: 'all' | 'unexcused_risk' | 'on_leave') => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  threshold: string;
  onThresholdChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  criticalCount: number;
  moderateCount: number;
}

export function ManagerAttendanceAbsenteeToolbar({
  shift,
  onShiftChange,
  alertStatusFilter,
  onAlertStatusChange,
  leaveStatusFilter,
  onLeaveStatusChange,
  searchQuery,
  onSearchChange,
  threshold,
  onThresholdChange,
  hasActiveFilters,
  onResetFilters,
  criticalCount,
  moderateCount,
}: ManagerAttendanceAbsenteeToolbarProps) {
  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-secondary shrink-0 mr-1">Shift:</span>
          {SHIFT_OPTIONS.map((opt) => {
            const isActive = shift === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onShiftChange(opt.id)}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? 'mgr-absentee-pill--indigo border shadow-sm font-bold'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none shrink-0">
          <span className="text-xs font-semibold text-secondary shrink-0 mr-1">Alert:</span>
          {ALERT_STATUS_OPTIONS.map((opt) => {
            const isActive = alertStatusFilter === opt.id;
            const activePill =
              opt.id === 'pending'
                ? 'mgr-absentee-pill--amber'
                : opt.id === 'notified'
                ? 'mgr-absentee-pill--emerald'
                : 'mgr-absentee-pill--indigo';
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onAlertStatusChange(opt.id)}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${activePill} border shadow-sm font-bold`
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none shrink-0">
          <span className="text-xs font-semibold text-secondary shrink-0 mr-1">Status:</span>
          {(
            [
              { id: 'all', label: 'All Absentees', activeClass: 'mgr-absentee-pill--indigo' },
              { id: 'unexcused_risk', label: 'Dropout Risk (Unexcused)', activeClass: 'mgr-absentee-pill--rose' },
              { id: 'on_leave', label: 'On Leave / Excused', activeClass: 'mgr-absentee-pill--blue' },
            ] as const
          ).map((opt) => {
            const isActive = leaveStatusFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onLeaveStatusChange(opt.id)}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${opt.activeClass} border shadow-sm font-bold`
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                {opt.label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger-bg px-2.5 py-1.5 rounded-lg motion-safe:transition-colors cursor-pointer shrink-0 ml-1"
              title="Reset all active filters"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] flex items-center">
          <input
            maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student name, smart ID, phone, or email..."
            className="mgr-absentee-search-input w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary motion-safe:transition-all"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover motion-safe:transition-colors cursor-pointer z-10"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <label htmlFor="absentee-threshold-select" className="text-xs text-secondary whitespace-nowrap">
              Threshold:
            </label>
            <select
              id="absentee-threshold-select"
              value={threshold}
              onChange={(e) => onThresholdChange(e.target.value)}
              className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {THRESHOLD_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {criticalCount} Critical
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {moderateCount} Moderate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
