'use client';

import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';

export type ManagerRenewalsTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerFinanceRenewalsTimeHorizonBarProps {
  timeHorizon: ManagerRenewalsTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerRenewalsTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  activeCount: number;
}

const timeHorizonOptions: Array<{ id: ManagerRenewalsTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today (≤ 0 Days)' },
  { id: 'this_week', label: 'This Week (≤ 7 Days)' },
  { id: 'this_month', label: 'This Month (≤ 30 Days)' },
  { id: 'custom', label: 'Custom Range' },
];

export default function ManagerFinanceRenewalsTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: ManagerFinanceRenewalsTimeHorizonBarProps) {
  const isInvalidDateRange = Boolean(customStartDate && customEndDate && customStartDate > customEndDate);

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Renewals Time Horizon:
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
          {activeCount} Records
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Segmented Time Horizon Pills */}
        <div className="inline-flex bg-muted p-1 rounded-xl border border-border flex-wrap">
          {timeHorizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeTimeHorizon(opt.id)}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                timeHorizon === opt.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range Picker */}
        {timeHorizon === 'custom' && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-muted p-1.5 rounded-lg border border-border">
            <label className="flex items-center gap-1 text-secondary" htmlFor="manager-renewals-start-date">
              <span>From:</span>
              <input
                id="manager-renewals-start-date"
                type="date"
                value={customStartDate}
                aria-invalid={isInvalidDateRange}
                aria-describedby={isInvalidDateRange ? "manager-renewals-date-error" : undefined}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
                className={`px-2 py-1 bg-card border rounded text-xs text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary ${isInvalidDateRange ? 'border-danger' : 'border-border'}`}
              />
            </label>
            <label className="flex items-center gap-1 text-secondary" htmlFor="manager-renewals-end-date">
              <span>To:</span>
              <input
                id="manager-renewals-end-date"
                type="date"
                value={customEndDate}
                aria-invalid={isInvalidDateRange}
                aria-describedby={isInvalidDateRange ? "manager-renewals-date-error" : undefined}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
                className={`px-2 py-1 bg-card border rounded text-xs text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary ${isInvalidDateRange ? 'border-danger' : 'border-border'}`}
              />
            </label>
            {isInvalidDateRange && (
              <span id="manager-renewals-date-error" className="text-danger font-medium text-xs px-1" role="alert">
                Start date must be before or equal to end date
              </span>
            )}
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  onCustomStartDateChange('');
                  onCustomEndDateChange('');
                }}
                className="p-1 text-secondary hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                title="Clear custom dates"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
