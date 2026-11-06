'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export type ManagerDailySettlementTimeHorizon = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

export interface ManagerAccountsDailySettlementTimeHorizonBarProps {
  timeHorizon: ManagerDailySettlementTimeHorizon;
  onChangeTimeHorizon: (horizon: ManagerDailySettlementTimeHorizon) => void;
  settlementDate: string;
  onSettlementDateChange: (date: string) => void;
  sampleDateLabel: string;
}

const horizonOptions: Array<{ id: ManagerDailySettlementTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Dates' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
];

export function ManagerAccountsDailySettlementTimeHorizonBar({
  timeHorizon,
  onChangeTimeHorizon,
  settlementDate,
  onSettlementDateChange,
  sampleDateLabel,
}: ManagerAccountsDailySettlementTimeHorizonBarProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Settlement Audit Date:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Quick Date Selectors */}
        <div className="inline-flex bg-muted p-1 rounded-xl border border-border flex-wrap">
          {horizonOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeTimeHorizon(opt.id)}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                timeHorizon === opt.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date Picker Input */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
          <input
            type="date"
            className="px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-semibold text-primary outline-none focus:border-primary"
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

