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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label={t('REPORT_TOTALS')}>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_INCOME')}</span>
            <span className="rounded-md bg-success-bg px-1.5 py-0.5 text-[10px] font-bold text-success-text">
              {periodLabel}
            </span>
          </div>
          <TrendingUp size={18} className="text-success-text" strokeWidth={2} />
        </div>
        <p className="mt-2 text-kpi font-bold text-text-primary text-success-text">{formatAdminAccountingCurrency(totalIncomeMinor, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card border-danger-bg bg-danger-bg">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_EXPENSES')}</span>
            <span className="rounded-md bg-danger-bg px-1.5 py-0.5 text-[10px] font-bold text-danger-text">
              {periodLabel}
            </span>
          </div>
          <TrendingDown size={18} className="text-danger-text" strokeWidth={2} />
        </div>
        <p className="mt-2 text-kpi font-bold text-text-primary text-danger-text">{formatAdminAccountingCurrency(totalExpenseMinor, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('NET_PROFIT')}</span>
            <span className="rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {periodLabel}
            </span>
          </div>
          <BarChart2 size={18} strokeWidth={2} className="text-text-secondary" />
        </div>
        <p className={`mt-2 text-kpi font-bold text-text-primary ${netProfitMinor >= 0 ? 'text-success-text' : 'text-danger-text'}`}>{formatAdminAccountingCurrency(netProfitMinor, locale)}</p>
      </div>
    </section>
  );
}


export type { AdminAccountsFinancialReportsKpiCardsProps };
