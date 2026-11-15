'use client';

import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';

export type ManagerDailySettlementTimeHorizon = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

export interface ManagerAccountsDailySettlementTimeHorizonBarProps {
  timeHorizon: ManagerDailySettlementTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerDailySettlementTimeHorizon) => void;
  settlementDate: string;
  onSettlementDateChange: (date: string) => void;
  sampleDateLabel: string;
}

const horizonOptions: Array<{
  id: ManagerDailySettlementTimeHorizon;
  label: string;
  activeStyle: React.CSSProperties;
}> = [
  {
    id: 'all',
    label: 'All Dates',
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
    id: 'yesterday',
    label: 'Yesterday',
    activeStyle: {
      boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
      backgroundColor: '#0ea5e9',
      borderColor: '#38bdf8',
      color: '#ffffff',
    },
  },
  {
    id: 'this_week',
    label: 'This Week',
    activeStyle: {
      boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
      backgroundColor: '#f59e0b',
      borderColor: '#fbbf24',
      color: '#000000',
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
];

export function ManagerAccountsDailySettlementTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  settlementDate,
  onSettlementDateChange,
  sampleDateLabel,
}: ManagerAccountsDailySettlementTimeHorizonBarProps) {
  const isCustomActive = timeHorizon === 'custom';

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Calendar size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
            Settlement Audit Date
          </span>
          <span className="text-[11px] font-semibold text-primary">
            Filtering drawer logs for:{' '}
            <strong className="text-indigo-400">
              {timeHorizon === 'custom' ? settlementDate : horizonOptions.find((h) => h.id === timeHorizon)?.label || 'All Dates'}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Quick Date Selectors with Glowing Halos */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-highlight/70 border border-border/80 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {horizonOptions.map((opt) => {
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

        {/* Date Picker Input with Visual Glow when Custom is chosen */}
        <div
          style={
            isCustomActive
              ? {
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)',
                  borderColor: '#f59e0b',
                }
              : undefined
          }
          className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
            isCustomActive
              ? 'bg-amber-500/10'
              : 'bg-surface-highlight/80 border-border'
          }`}
        >
          <Calendar size={13} className={isCustomActive ? 'text-amber-400 ml-1' : 'text-secondary ml-1'} />
          <input
            type="date"
            className="px-2 py-1 bg-card border border-border rounded-lg text-xs font-semibold text-primary outline-none focus:border-primary cursor-pointer"
            value={settlementDate}
            onChange={(e) => {
              onSettlementDateChange(e.target.value);
              onChangeTimeHorizon('custom');
            }}
            aria-label={sampleDateLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsDailySettlementTimeHorizonBar;
