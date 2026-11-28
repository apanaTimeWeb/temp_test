'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_styles/ManagerAccountsDailySettlementStyles.css';
import { Calendar } from 'lucide-react';

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
  activeClass: string;
}> = [
  { id: 'all', label: 'All Dates', activeClass: 'mds-pill-indigo-active' },
  { id: 'today', label: 'Today', activeClass: 'mds-pill-emerald-active' },
  { id: 'yesterday', label: 'Yesterday', activeClass: 'mds-pill-sky-active' },
  { id: 'this_week', label: 'This Week', activeClass: 'mds-pill-amber-active' },
  { id: 'this_month', label: 'This Month', activeClass: 'mds-pill-purple-active' },
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
                className={`min-h-8 px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Date Picker Input with Visual Glow when Custom is chosen */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
            isCustomActive
              ? 'bg-amber-500/10 mds-date-custom-glow'
              : 'bg-surface-highlight/80 border-border'
          }`}
        >
          <Calendar size={13} className={isCustomActive ? 'text-amber-400 ml-1' : 'text-secondary ml-1'} />
          <input maxLength={100}
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
