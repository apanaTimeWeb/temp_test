'use client';

import { Clock } from 'lucide-react';
import type { AdminDepositsTimeHorizon } from '../types/AdminFinanceSecurityDepositsTypes';

export interface AdminFinanceSecurityDepositsTimeHorizonBarProps {
  timeHorizon: AdminDepositsTimeHorizon;
  onChangeTimeHorizon: (val: AdminDepositsTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (val: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (val: string) => void;
  activeCount: number;
}

export function AdminFinanceSecurityDepositsTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: AdminFinanceSecurityDepositsTimeHorizonBarProps) {
  const options: { id: AdminDepositsTimeHorizon; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border text-xs">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-secondary font-semibold flex items-center gap-1 mr-1">
          <Clock size={13} />
          <span>Horizon:</span>
        </span>
        <div className="inline-flex rounded-xl bg-surface-ground p-1 border border-border">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeTimeHorizon(opt.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeHorizon === opt.id
                  ? 'bg-card text-primary shadow-xs'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {timeHorizon === 'custom' && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-secondary text-[11px]">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-border bg-input-bg text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-secondary text-[11px]">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-border bg-input-bg text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      <div className="text-secondary">
        Showing <strong className="text-primary">{activeCount}</strong> deposit records
      </div>
    </div>
  );
}
