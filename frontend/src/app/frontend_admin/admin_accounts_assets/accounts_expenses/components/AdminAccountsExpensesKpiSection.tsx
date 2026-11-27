'use client';
// RESPONSIBILITY: AdminAccountsExpensesKpiSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import type { AdminAccountsExpensesKpiSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import { Clock, Filter, Tag, TrendingDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const generateSparkline = (title: string) =>
  `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;

export function AdminAccountsExpensesKpiSection({ expenses, visibleExpenses, timeRangeLabel }: AdminAccountsExpensesKpiSectionProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  const approvedExpenses = expenses.filter((e) => (e.status ?? 'APPROVED') === 'APPROVED');
  const pendingExpenses = expenses.filter((e) => e.status === 'PENDING_APPROVAL');

  const totalApproved = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPending = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const filteredTotal = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categoriesCount = new Set(expenses.map((e) => e.category)).size;

  const kpis = [
    {
      label: t('TOTAL_EXPENSES'),
      value: formatAdminAccountingCurrency(totalApproved, locale),
      icon: TrendingDown,
      iconBox: 'bg-danger-bg border-danger text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'bg-danger-bg border-danger text-danger-text',
      sub: `${approvedExpenses.length} approved`,
      badge: timeRangeLabel && timeRangeLabel !== 'All Time' ? timeRangeLabel : null,
    },
    {
      label: t('KPI_PENDING_APPROVAL'),
      value: formatAdminAccountingCurrency(totalPending, locale),
      icon: Clock,
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      strokeColor: 'var(--chart-warning)',
      badgeBg: 'bg-warning-bg border-warning text-warning-text',
      sub: `${pendingExpenses.length} awaiting review`,
      badge: null,
    },
    {
      label: t('FILTERED_TOTAL'),
      value: formatAdminAccountingCurrency(filteredTotal, locale),
      icon: Filter,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'bg-info-bg border-info text-info-text',
      sub: timeRangeLabel ? `${visibleExpenses.length} records in ${timeRangeLabel}` : `${visibleExpenses.length} records`,
      badge: timeRangeLabel && timeRangeLabel !== 'All Time' ? timeRangeLabel : null,
    },
    {
      label: t('CATEGORIES'),
      value: String(categoriesCount),
      icon: Tag,
      iconBox: 'bg-purple-bg border-purple-text text-purple-text',
      strokeColor: 'var(--chart-primary)',
      badgeBg: 'bg-purple-bg border-purple-text text-purple-text',
      sub: 'Categorized types',
      badge: null,
    },
  ];

  return (
    <section aria-label={t('SUMMARY_ARIA')} className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, iconBox, strokeColor, badgeBg, sub, badge }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d={generateSparkline(label)} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">
                {label}
              </span>
              {badge && (
                <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${badgeBg}`}>
                  {badge}
                </span>
              )}
            </div>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconBox}`}>
              <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>

          <div className="relative z-10 mt-3 sm:mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary tabular-nums">{value}</p>
            <p className="mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary truncate">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default AdminAccountsExpensesKpiSection;
export type { AdminAccountsExpensesKpiSectionProps };
