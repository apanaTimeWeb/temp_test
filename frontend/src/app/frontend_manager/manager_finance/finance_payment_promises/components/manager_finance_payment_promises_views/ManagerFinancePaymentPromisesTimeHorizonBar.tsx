'use client';

import React from 'react';
import { Clock, X, AlertCircle } from 'lucide-react';

export type ManagerPromisesTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerFinancePaymentPromisesTimeHorizonBarProps {
  timeHorizon: ManagerPromisesTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerPromisesTimeHorizon) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  activeCount: number;
}

const timeHorizonOptions: Array<{ id: ManagerPromisesTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Range' },
];

export default function ManagerFinancePaymentPromisesTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  activeCount,
}: ManagerFinancePaymentPromisesTimeHorizonBarProps) {
  const isInvalidRange = Boolean(
    customStartDate && customEndDate && customStartDate > customEndDate
  );

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Promises Time Horizon:
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
          {activeCount} Commitments
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
        {/* Segmented Time Horizon Pills */}
        <div className="inline-flex bg-muted p-1 rounded-xl border border-border flex-wrap">
          {timeHorizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeTimeHorizon(opt.id)}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none ${
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap text-xs bg-muted p-1.5 rounded-lg border border-border">
              <label htmlFor="promises-custom-from" className="flex items-center gap-1 text-secondary">
                <span>From:</span>
                <input
                  id="promises-custom-from"
                  name="customStartDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => onCustomStartDateChange(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <label htmlFor="promises-custom-to" className="flex items-center gap-1 text-secondary">
                <span>To:</span>
                <input
                  id="promises-custom-to"
                  name="customEndDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => onCustomEndDateChange(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    onCustomStartDateChange('');
                    onCustomEndDateChange('');
                  }}
                  className="p-1 text-secondary hover:text-danger rounded focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  title="Clear custom dates"
                  aria-label="Clear custom date filter"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {isInvalidRange && (
              <p role="alert" className="text-[11px] text-danger flex items-center gap-1">
                <AlertCircle size={11} /> Start date cannot be after end date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
