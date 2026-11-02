'use client';
// RESPONSIBILITY: AdminAccountsExpensesKpiSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useTranslations, useLocale } from 'next-intl';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import type { AdminAccountsExpensesKpiSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

/** Renders totals from the same source records and current filtered rows shown by the expense table. */
export function AdminAccountsExpensesKpiSection({ expenses, visibleExpenses }: AdminAccountsExpensesKpiSectionProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  const approvedExpenses = expenses.filter((e) => (e.status ?? 'APPROVED') === 'APPROVED');
  const pendingExpenses = expenses.filter((e) => e.status === 'PENDING_APPROVAL');

  const totalApproved = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPending = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const filteredTotal = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categoriesCount = new Set(expenses.map((e) => e.category)).size;

  return (
    <section aria-label={t('SUMMARY_ARIA')} className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('TOTAL_EXPENSES')}</p>
        <p className="mt-2 text-kpi font-bold text-danger-text">{formatAdminAccountingCurrency(totalApproved, locale)}</p>
      </div>
      <div className="rounded-xl border border-warning/30 bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-warning">{t('KPI_PENDING_APPROVAL')}</p>
        <p className="mt-2 text-kpi font-bold text-warning-text">{formatAdminAccountingCurrency(totalPending, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('FILTERED_TOTAL')}</p>
        <p className="mt-2 text-kpi font-bold text-text-primary">{formatAdminAccountingCurrency(filteredTotal, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('CATEGORIES')}</p>
        <p className="mt-2 text-kpi font-bold text-text-primary">{categoriesCount}</p>
      </div>
    </section>
  );
}

export default AdminAccountsExpensesKpiSection;
export type { AdminAccountsExpensesKpiSectionProps };
