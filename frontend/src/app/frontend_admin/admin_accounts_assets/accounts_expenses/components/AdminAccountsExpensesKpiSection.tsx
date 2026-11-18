'use client';
// RESPONSIBILITY: AdminAccountsExpensesKpiSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useTranslations, useLocale } from 'next-intl';
import { TrendingDown, Clock, Filter, Tag } from 'lucide-react';
import type { AdminAccountsExpensesKpiSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

/** Renders totals from the same source records and current filtered rows shown by the expense table. */
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
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      strokeColor: '#f87171',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      sub: `${approvedExpenses.length} approved`,
      badge: timeRangeLabel && timeRangeLabel !== 'All Time' ? timeRangeLabel : null,
    },
    {
      label: t('KPI_PENDING_APPROVAL'),
      value: formatAdminAccountingCurrency(totalPending, locale),
      icon: Clock,
      cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
      iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      strokeColor: '#fbbf24',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      sub: `${pendingExpenses.length} awaiting review`,
      badge: null,
    },
    {
      label: t('FILTERED_TOTAL'),
      value: formatAdminAccountingCurrency(filteredTotal, locale),
      icon: Filter,
      cardBorderBg: 'border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 shadow-sky-950/30',
      iconBox: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      strokeColor: '#38bdf8',
      badgeBg: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      sub: timeRangeLabel ? `${visibleExpenses.length} records in ${timeRangeLabel}` : `${visibleExpenses.length} records`,
      badge: timeRangeLabel && timeRangeLabel !== 'All Time' ? timeRangeLabel : null,
    },
    {
      label: t('CATEGORIES'),
      value: String(categoriesCount),
      icon: Tag,
      cardBorderBg: 'border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30',
      iconBox: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      strokeColor: '#c084fc',
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      sub: 'Categorized types',
      badge: null,
    },
  ];

  return (
    <section aria-label={t('SUMMARY_ARIA')} className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, cardBorderBg, iconBox, strokeColor, badgeBg, sub, badge }) => {
        const sparklinePath = generateSparkline(label);

        return (
          <div
            key={label}
            className={`group relative overflow-hidden rounded-2xl border p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${cardBorderBg}`}
          >
            {/* Decorative sparkline using theme accent color matching Superadmin UI */}
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={sparklinePath} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
                  {label}
                </span>
                {badge && (
                  <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${badgeBg}`}>
                    {badge}
                  </span>
                )}
              </div>
              <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${iconBox}`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
            </div>

            <div className="relative z-10 mt-3 sm:mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">{value}</p>
              <p className="mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">{sub}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default AdminAccountsExpensesKpiSection;
export type { AdminAccountsExpensesKpiSectionProps };
