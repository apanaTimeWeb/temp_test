'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsKpiCards component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import type { AdminAccountsFinancialReportsKpiCardsProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';


/** Shows derived totals from the already scoped report-period rows. Values are stored in paise. */
export function AdminAccountsFinancialReportsKpiCards({ totalIncomeMinor, totalExpenseMinor, period }: AdminAccountsFinancialReportsKpiCardsProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const netProfitMinor = totalIncomeMinor - totalExpenseMinor;
  const periodLabel = period === 'quarterly' ? 'Quarterly' : period === 'yearly' ? 'Yearly' : 'Monthly';

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" aria-label={t('REPORT_TOTALS')}>
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('TOTAL_INCOME')}</span>
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
              {periodLabel}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <TrendingUp size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">{formatAdminAccountingCurrency(totalIncomeMinor, locale)}</p>
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/40">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('TOTAL_EXPENSES')}</span>
            <span className="rounded-md bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
              {periodLabel}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <TrendingDown size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-rose-400">{formatAdminAccountingCurrency(totalExpenseMinor, locale)}</p>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('NET_PROFIT')}</span>
            <span className="rounded-md bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400">
              {periodLabel}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <BarChart2 size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className={`mt-2 text-2xl font-bold tracking-tight ${netProfitMinor >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>{formatAdminAccountingCurrency(netProfitMinor, locale)}</p>
      </div>
    </section>
  );
}


export type { AdminAccountsFinancialReportsKpiCardsProps };
