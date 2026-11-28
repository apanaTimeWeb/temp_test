'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_styles/ManagerAccountsExpensesStyles.css';
import type { ManagerAccountsExpensesExpenseCategoryFilterProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { Tag,TrendingUp } from 'lucide-react';

const CATEGORY_ACTIVE_CLASSES: Record<string, string> = {
  all: 'mex-pill-indigo-active',
  Utilities: 'mex-mode-bank-active',
  Maintenance: 'mex-mode-cash-active',
  Internet: 'mex-mode-upi-active',
  Salary: 'mex-mode-card-active',
  Electricity: 'mex-pill-yellow-active',
};

export default function ManagerAccountsExpensesExpenseCategoryFilter({
  categories,
  value,
  onChange,
  onViewCategories,
  labels,
}: ManagerAccountsExpensesExpenseCategoryFilterProps) {
  const topCategories = ['all', ...categories.slice(0, 5)];

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-card border border-border rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills with Glowing Active Halos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 shrink-0 mr-1">
            <Tag size={13} className="text-primary" />
            <span>{labels.filterByCategory}:</span>
          </span>

          {topCategories.map((cat) => {
            const isAll = cat === 'all';
            const isActive = value === cat;
            const activeClass = CATEGORY_ACTIVE_CLASSES[cat] || 'mex-pill-blue-active';

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                  isActive
                    ? `${activeClass} border shadow-sm font-bold`
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <span>{isAll ? labels.allCategories : cat}</span>
              </button>
            );
          })}
        </div>

        {/* View Categories Button */}
        <button
          type="button"
          onClick={onViewCategories}
          className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <TrendingUp size={13} />
          <span>{labels.viewCategories}</span>
        </button>
      </div>

      {/* Dropdown for All Categories (Secondary / Advanced Access) */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <label htmlFor="expense-category-dropdown-select" className="text-xs text-secondary whitespace-nowrap">
          More Categories:
        </label>
        <select
          id="expense-category-dropdown-select"
          className="px-3 py-1 bg-card border border-border rounded-lg text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full sm:w-auto"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="all">{labels.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
