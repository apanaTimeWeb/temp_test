'use client';
// RESPONSIBILITY: Render the accounts expenses expense category filter component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the accounts expenses expense category filter component within the components feature. It does not own backend persistence or cross-feature business logic.
import { TrendingUp } from 'lucide-react';
import type { ManagerAccountsExpensesExpenseCategoryFilterProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';



export default function ManagerAccountsExpensesExpenseCategoryFilter({ categories, value, onChange, onViewCategories, labels }: ManagerAccountsExpensesExpenseCategoryFilterProps) {
  return (
    <div className="fin-filter-bar flex items-center justify-between p-4 bg-card border border-border rounded-lg">
      <div className="flex flex-col">
        <label className="fin-label text-xs mb-1" htmlFor="rbg4-manageraccountingexpensespage-145">{labels.filterByCategory}</label>
        <select id="rbg4-manageraccountingexpensespage-145" className="fin-select w-48" value={value} onChange={event => onChange(event.target.value)}>
          <option value="all">{labels.allCategories}</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <button type="button" className="fin-badge fin-badge--neutral cursor-pointer hover:border-primary flex items-center gap-1" onClick={onViewCategories}>
        <TrendingUp size={14} /> {labels.viewCategories}
      </button>
    </div>
  );
}
