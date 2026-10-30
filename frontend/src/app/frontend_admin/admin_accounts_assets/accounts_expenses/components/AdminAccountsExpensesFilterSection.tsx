'use client';
// RESPONSIBILITY: AdminAccountsExpensesFilterSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type { AdminAccountsExpensesCategoryFilter, AdminAccountsExpensesFilterSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


const CATEGORY_TRANSLATION_KEY = {
  Electricity: 'CATEGORY_ELECTRICITY',
  Maintenance: 'CATEGORY_MAINTENANCE',
  Stationery: 'CATEGORY_STATIONERY',
  Internet: 'CATEGORY_INTERNET',
  Cleaning: 'CATEGORY_CLEANING',
  Miscellaneous: 'CATEGORY_MISCELLANEOUS',
  Rent: 'CATEGORY_RENT',
  Salary: 'CATEGORY_SALARY',
} as const;

/** Owns the category filter controls; the selected value is controlled by the parent page. */
export function AdminAccountsExpensesFilterSection({ value, onChange }: AdminAccountsExpensesFilterSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <section aria-label={t('FILTER_CATEGORY')} className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-category-filter">{t('FILTER_CATEGORY')}</label>
        <select id="expense-category-filter" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-48" value={value} onChange={(event) => onChange(event.target.value as AdminAccountsExpensesCategoryFilter)}>
          <option value="all">{t('ALL_CATEGORIES')}</option>
          {ADMIN_ACCOUNTING_EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{t(CATEGORY_TRANSLATION_KEY[category])}</option>)}
        </select>
      </div>
      <button type="button" className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary flex min-h-11 cursor-pointer gap-1" onClick={() => onChange('all')}>
        <TrendingUp size={18} strokeWidth={2} aria-hidden="true" /> {t('RESET')}
      </button>
    </section>
  );
}

export default AdminAccountsExpensesFilterSection;


export type { AdminAccountsExpensesCategoryFilter, AdminAccountsExpensesFilterSectionProps };
