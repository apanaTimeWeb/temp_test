'use client';
// RESPONSIBILITY: AdminAccountsExpensesKpiSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useTranslations, useLocale } from 'next-intl';
import { TrendingDown, Clock, Filter, Tag } from 'lucide-react';
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

  const kpis = [
    { label: t('TOTAL_EXPENSES'), value: formatAdminAccountingCurrency(totalApproved, locale), icon: TrendingDown, color: 'rose', sub: `${approvedExpenses.length} approved` },
    { label: t('KPI_PENDING_APPROVAL'), value: formatAdminAccountingCurrency(totalPending, locale), icon: Clock, color: 'amber', sub: `${pendingExpenses.length} awaiting` },
    { label: t('FILTERED_TOTAL'), value: formatAdminAccountingCurrency(filteredTotal, locale), icon: Filter, color: 'blue', sub: `${visibleExpenses.length} records` },
    { label: t('CATEGORIES'), value: String(categoriesCount), icon: Tag, color: 'purple', sub: 'Expense types' },
  ] as const;

  return (
    <section aria-label={t('SUMMARY_ARIA')} className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, color, sub }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              color === 'rose' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
              color === 'amber' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
              'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }`}>
              <Icon size={16} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{sub}</p>
        </div>
      ))}
    </section>
  );
}

export default AdminAccountsExpensesKpiSection;
export type { AdminAccountsExpensesKpiSectionProps };
