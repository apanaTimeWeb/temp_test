'use client';
// RESPONSIBILITY: AdminAccountsExpensesFilterSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type {
AdminAccountsExpensesCategoryFilter,
AdminAccountsExpensesFilterSectionProps
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import { CheckCircle2,Clock,FileSpreadsheet,Search,TrendingUp,XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

/** Owns the category, date range, search and approval status filter controls. */
export function AdminAccountsExpensesFilterSection({
  value,
  statusFilter = 'all',
  searchQuery = '',
  onSearchChange,
  onChange,
  onStatusChange,
  pendingCount = 0,
  timeRange = 'all',
  onTimeRangeChange,
  customStartDate = '',
  onCustomStartDateChange,
  customEndDate = '',
  onCustomEndDateChange,
  onExportCsv,
  onExportExcel,
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

      {/* Category Dropdown, Date Range Filter, Search, Export & Reset */}
      <section
        aria-label={t('FILTER_CATEGORY')}
        className="rounded-xl border border-border bg-card p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {onSearchChange && (
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <label htmlFor="admin-expense-search" className="sr-only">
                  Search Expenses
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input maxLength={250}
                  id="admin-expense-search"
                  type="text"
                  placeholder="Search expense description, payee..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-11"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="expense-category-filter">
                {t('FILTER_CATEGORY')}
              </label>
              <select
                id="expense-category-filter"
                className="min-h-11 rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40 text-sm"
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

            {onTimeRangeChange && (
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="expense-timerange-filter">
                  Date Range
                </label>
                <div className="flex items-center gap-1.5">
                  <select
                    id="expense-timerange-filter"
                    aria-label="Filter expenses by date range"
                    className="min-h-11 rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-36 text-sm"
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value as any)}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  {timeRange === 'custom' && (
                    <div className="flex items-center gap-1">
                      <input maxLength={100}
                        type="date"
                        aria-label="Start date filter"
                        value={customStartDate}
                        onChange={(e) => onCustomStartDateChange?.(e.target.value)}
                        className="min-h-11 rounded-md border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <input maxLength={100}
                        type="date"
                        aria-label="End date filter"
                        value={customEndDate}
                        onChange={(e) => onCustomEndDateChange?.(e.target.value)}
                        className="min-h-11 rounded-md border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onExportCsv && (
              <button
                type="button"
                onClick={onExportCsv}
                className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary min-h-11 cursor-pointer gap-1.5 hover:bg-card-hover hover:text-text-primary transition-colors"
                title="Export Expenses as CSV"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                <span>Export CSV</span>
              </button>
            )}
            {onExportExcel && (
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary min-h-11 cursor-pointer gap-1.5 hover:bg-card-hover hover:text-text-primary transition-colors"
                title="Export Expenses as Formatted Excel (.xls)"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                <span>Export Excel</span>
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary min-h-11 cursor-pointer gap-1 hover:bg-card-hover"
              onClick={() => {
                onChange('all');
                if (onSearchChange) onSearchChange('');
                if (onStatusChange) onStatusChange('all');
                if (onTimeRangeChange) onTimeRangeChange('all');
                if (onCustomStartDateChange) onCustomStartDateChange('');
                if (onCustomEndDateChange) onCustomEndDateChange('');
              }}
            >
              <TrendingUp size={18} strokeWidth={2} aria-hidden="true" /> {t('RESET')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminAccountsExpensesFilterSection;
export type { AdminAccountsExpensesCategoryFilter,AdminAccountsExpensesFilterSectionProps };
