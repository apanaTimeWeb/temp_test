'use client';
// RESPONSIBILITY: Render the accounts expenses expense category filter component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the accounts expenses expense category filter component within the components feature. It does not own backend persistence or cross-feature business logic.
import { TrendingUp } from 'lucide-react';
import type { ManagerAccountsExpensesExpenseCategoryFilterProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';



export default function ManagerAccountsExpensesExpenseCategoryFilter({ categories, value, onChange, onViewCategories, labels }: ManagerAccountsExpensesExpenseCategoryFilterProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs">
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-secondary mb-1" htmlFor="rbg4-manageraccountingexpensespage-145">{labels.filterByCategory}</label>
        <select id="rbg4-manageraccountingexpensespage-145" className="w-48 px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary" value={value} onChange={event => onChange(event.target.value)}>
          <option value="all">{labels.allCategories}</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer" onClick={onViewCategories}>
        <TrendingUp size={14} /> {labels.viewCategories}
      </button>
    </div>
  );
}
