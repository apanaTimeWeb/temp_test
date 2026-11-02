'use client';
// RESPONSIBILITY: AdminAccountsExpensesFilterSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useTranslations } from 'next-intl';
import { TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type {
  AdminAccountsExpensesCategoryFilter,
  AdminAccountsExpensesStatusFilter,
  AdminAccountsExpensesFilterSectionProps,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

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

/** Owns the category and approval status filter controls. */
export function AdminAccountsExpensesFilterSection({
  value,
  statusFilter = 'all',
  onChange,
  onStatusChange,
  pendingCount = 0,
}: AdminAccountsExpensesFilterSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <div className="space-y-3">
      {/* Status Filter Tabs */}
      {onStatusChange && (
        <div className="flex border-b border-border overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              statusFilter === 'all'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS_ALL')}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('PENDING_APPROVAL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-warning" />
              <span>{t('TABS_PENDING')}</span>
              {pendingCount > 0 && (
                <span className="ml-1 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-bold text-warning-text">
                  {pendingCount}
                </span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('APPROVED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              statusFilter === 'APPROVED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span>{t('TABS_APPROVED')}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('REJECTED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              statusFilter === 'REJECTED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-destructive" />
              <span>{t('TABS_REJECTED')}</span>
            </span>
          </button>
        </div>
      )}

      {/* Category Dropdown & Reset */}
      <section
        aria-label={t('FILTER_CATEGORY')}
        className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-category-filter">
            {t('FILTER_CATEGORY')}
          </label>
          <select
            id="expense-category-filter"
            className="min-h-11 rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-48"
            value={value}
            onChange={(event) => onChange(event.target.value as AdminAccountsExpensesCategoryFilter)}
          >
            <option value="all">{t('ALL_CATEGORIES')}</option>
            {ADMIN_ACCOUNTING_EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(CATEGORY_TRANSLATION_KEY[category])}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary min-h-11 cursor-pointer gap-1 hover:bg-card-hover"
          onClick={() => {
            onChange('all');
            if (onStatusChange) onStatusChange('all');
          }}
        >
          <TrendingUp size={18} strokeWidth={2} aria-hidden="true" /> {t('RESET')}
        </button>
      </section>
    </div>
  );
}

export default AdminAccountsExpensesFilterSection;
export type { AdminAccountsExpensesCategoryFilter, AdminAccountsExpensesFilterSectionProps };
