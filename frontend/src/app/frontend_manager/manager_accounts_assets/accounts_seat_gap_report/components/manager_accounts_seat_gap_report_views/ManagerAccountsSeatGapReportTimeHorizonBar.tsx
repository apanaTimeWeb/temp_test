'use client';

import { Calendar,Clock,X } from 'lucide-react';
import React from 'react';

export type ManagerSeatGapTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerAccountsSeatGapReportTimeHorizonBarProps {
  timeHorizon: ManagerSeatGapTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerSeatGapTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  activeCount: number;
}

const timeHorizonOptions: Array<{
  id: ManagerSeatGapTimeHorizon;
  label: string;
  activeStyle: React.CSSProperties;
}> = [
  {
    id: 'all',
    label: 'All Gap Seats',
    activeStyle: {
      boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
      backgroundColor: '#6366f1',
      borderColor: '#818cf8',
      color: '#ffffff',
    },
  },
  {
    id: 'today',
    label: 'Today',
    activeStyle: {
      boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
      backgroundColor: '#10b981',
      borderColor: '#34d399',
      color: '#ffffff',
    },
  },
  {
    id: 'this_week',
    label: 'This Week',
    activeStyle: {
      boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
      backgroundColor: '#0ea5e9',
      borderColor: '#38bdf8',
      color: '#ffffff',
    },
  },
  {
    id: 'this_month',
    label: 'This Month',
    activeStyle: {
      boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
      backgroundColor: '#a855f7',
      borderColor: '#c084fc',
      color: '#ffffff',
    },
  },
  {
    id: 'custom',
    label: 'Custom Range',
    activeStyle: {
      boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
      backgroundColor: '#f59e0b',
      borderColor: '#fbbf24',
      color: '#000000',
    },
  },
];

export function ManagerAccountsSeatGapReportTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: ManagerAccountsSeatGapReportTimeHorizonBarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Clock size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
            Seat Gap Analysis Horizon
          </span>
          <span className="text-[11px] font-semibold text-primary">
            Filtering <strong className="text-indigo-400">{activeCount}</strong> matching seats
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Segmented Time Horizon Buttons with Glowing Halos */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-highlight/70 border border-border/80 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {timeHorizonOptions.map((opt) => {
            const isActive = timeHorizon === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeTimeHorizon(opt.id)}
                style={isActive ? opt.activeStyle : undefined}
                className={`min-h-8 px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm font-bold'
                    : 'text-secondary hover:text-primary hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Custom Date Range Picker */}
        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-surface-highlight/80 p-2 rounded-xl border border-border w-full sm:w-auto">
            <label className="flex items-center gap-1.5 text-secondary">
              <Calendar size={13} className="text-primary" />
              <span>From:</span>
              <input maxLength={100}
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-1.5 text-secondary">
              <span>To:</span>
              <input maxLength={100}
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  onCustomStartDateChange('');
                  onCustomEndDateChange('');
                }}
                className="p-1 rounded-md text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                title="Clear custom dates"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerAccountsSeatGapReportTimeHorizonBar;
