'use client';
// Responsibility: AdminAccountsSeatGapReportTimeHorizonBar component owned by accounts_seat_gap_report.

import { Calendar } from 'lucide-react';

export type AdminAccountsSeatGapTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

interface AdminAccountsSeatGapReportTimeHorizonBarProps {
  timeRange: AdminAccountsSeatGapTimeHorizon;
  setTimeRange: (range: AdminAccountsSeatGapTimeHorizon) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  timeRangeLabel: string;
  count: number;
}

export function AdminAccountsSeatGapReportTimeHorizonBar({
  timeRange,
  setTimeRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  timeRangeLabel,
  count,
}: AdminAccountsSeatGapReportTimeHorizonBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          <Calendar size={14} className="text-primary shrink-0" aria-hidden="true" />
          Period:
        </span>
        <div className="flex items-center rounded-lg bg-surface-highlight p-1 border border-border">
          {(
            [
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'this_week', label: 'This Week' },
              { id: 'this_month', label: 'This Month' },
              { id: 'custom', label: 'Custom' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTimeRange(item.id)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold motion-safe:transition-colors ${
                timeRange === item.id
                  ? 'bg-primary text-on-primary shadow-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {timeRange === 'custom' && (
          <div className="flex items-center gap-1.5 text-xs">
            <input
              maxLength={100}
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              aria-label="Start date"
              className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-text-secondary">to</span>
            <input
              maxLength={100}
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              aria-label="End date"
              className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
          Scope: {timeRangeLabel}
        </span>
        <span className="text-xs text-text-secondary">({count} gap seats)</span>
      </div>
    </div>
  );
}

export default AdminAccountsSeatGapReportTimeHorizonBar;
