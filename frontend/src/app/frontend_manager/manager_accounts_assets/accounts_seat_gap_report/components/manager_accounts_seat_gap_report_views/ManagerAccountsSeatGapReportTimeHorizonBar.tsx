'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_styles/ManagerAccountsSeatGapReportStyles.css';
import { Calendar,Clock,X } from 'lucide-react';

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
  activeClass: string;
}> = [
  { id: 'all', label: 'All Gap Seats', activeClass: 'sgr-pill-indigo-active' },
  { id: 'today', label: 'Today', activeClass: 'sgr-pill-emerald-active' },
  { id: 'this_week', label: 'This Week', activeClass: 'sgr-pill-sky-active' },
  { id: 'this_month', label: 'This Month', activeClass: 'sgr-pill-purple-active' },
  { id: 'custom', label: 'Custom Range', activeClass: 'sgr-pill-amber-active' },
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
                className={`min-h-8 px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${opt.activeClass} border shadow-sm font-bold`
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
                className="p-1 rounded-md text-secondary hover:text-danger hover:bg-danger-bg motion-safe:transition-colors"
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
