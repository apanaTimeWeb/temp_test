'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_styles/ManagerAccountsExpensesStyles.css';
import type { ManagerExpensesTimeHorizon } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_views/ManagerAccountsExpensesPage';
import { Calendar,X } from 'lucide-react';

interface ManagerAccountsExpensesTimeHorizonBarProps {
  timeHorizon: ManagerExpensesTimeHorizon;
  setTimeHorizon: (val: ManagerExpensesTimeHorizon) => void;
  timeHorizonOptions: Array<{ id: ManagerExpensesTimeHorizon; label: string }>;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
}

const HORIZON_ACTIVE_CLASSES: Record<ManagerExpensesTimeHorizon, string> = {
  all: 'mex-pill-indigo-active',
  today: 'mex-mode-cash-active',
  this_week: 'mex-mode-upi-active',
  this_month: 'mex-mode-bank-active',
  custom: 'mex-mode-card-active',
};

export function ManagerAccountsExpensesTimeHorizonBar({
  timeHorizon,
  setTimeHorizon,
  timeHorizonOptions,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: ManagerAccountsExpensesTimeHorizonBarProps) {
  const isCustomActive = timeHorizon === 'custom';

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Calendar size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
            Expense Time Horizon
          </span>
          <span className="text-[11px] font-semibold text-primary">
            Filter vouchers by fiscal period
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Segmented Time Horizon Pills with Glowing Halos */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-highlight/70 border border-border/80 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {timeHorizonOptions.map((opt) => {
            const isActive = timeHorizon === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeHorizon(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs rounded-lg font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${HORIZON_ACTIVE_CLASSES[opt.id]} border shadow-sm font-bold`
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
          <div className="flex items-center gap-2 flex-wrap text-xs bg-surface-highlight/80 p-2 rounded-xl border border-amber-500/40 shadow-xs w-full sm:w-auto">
            <label className="flex items-center gap-1.5 text-secondary">
              <Calendar size={13} className="text-amber-400" />
              <span>From:</span>
              <input maxLength={100}
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-1.5 text-secondary">
              <span>To:</span>
              <input maxLength={100}
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
              />
            </label>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="p-1 rounded-md text-secondary hover:text-danger hover:bg-danger-bg motion-safe:transition-colors cursor-pointer"
                title="Clear custom dates"
              >
                <X size={14} />
              </button>
            )}
            {customStartDate && customEndDate && customEndDate < customStartDate && (
              <p className="text-[11px] text-danger font-medium w-full" role="alert">
                End date cannot be earlier than start date
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerAccountsExpensesTimeHorizonBar;
