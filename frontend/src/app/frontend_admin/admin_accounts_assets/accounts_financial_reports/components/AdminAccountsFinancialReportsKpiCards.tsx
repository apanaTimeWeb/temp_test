'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsKpiCards component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import type { AdminAccountsFinancialReportsKpiCardsProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

/** Shows derived totals from the already scoped report-period rows. Values are stored in paise. */
export function AdminAccountsFinancialReportsKpiCards({ totalIncomeMinor, totalExpenseMinor, period }: AdminAccountsFinancialReportsKpiCardsProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const netProfitMinor = totalIncomeMinor - totalExpenseMinor;
  const periodLabel = period === 'quarterly' ? 'Quarterly' : period === 'yearly' ? 'Yearly' : 'Monthly';

  const incomeSparkline = generateSparkline('total_income');
  const expenseSparkline = generateSparkline('total_expense');
  const profitSparkline = generateSparkline('net_profit');

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" aria-label={t('REPORT_TOTALS')}>
      {/* Total Income */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={incomeSparkline} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('TOTAL_INCOME')}</span>
            <span className="self-start rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shadow-xs">
              {periodLabel}
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <TrendingUp size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {formatAdminAccountingCurrency(totalIncomeMinor, locale)}
        </p>
      </div>

      {/* Total Expenses */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={expenseSparkline} fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('TOTAL_EXPENSES')}</span>
            <span className="self-start rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400 shadow-xs">
              {periodLabel}
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <TrendingDown size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {formatAdminAccountingCurrency(totalExpenseMinor, locale)}
        </p>
      </div>

      {/* Net Profit */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
          viewBox="0 0 150 45"
        >
          <path d={profitSparkline} fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('NET_PROFIT')}</span>
            <span className="self-start rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-400 shadow-xs">
              {periodLabel}
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <BarChart2 size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums ${netProfitMinor >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
          {formatAdminAccountingCurrency(netProfitMinor, locale)}
        </p>
      </div>
    </section>
  );
}

export type { AdminAccountsFinancialReportsKpiCardsProps };
