// RESPONSIBILITY: AdminAccountsFinancialReportsKpiCards component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.
'use client';

import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import type { AdminAccountsFinancialReportsKpiCardsProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';


/** Shows derived totals from the already scoped report-period rows. Values are stored in paise. */
export function AdminAccountsFinancialReportsKpiCards({ totalIncomeMinor, totalExpenseMinor }: AdminAccountsFinancialReportsKpiCardsProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const netProfitMinor = totalIncomeMinor - totalExpenseMinor;
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label={t('REPORT_TOTALS')}>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3 text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_INCOME')}</p><TrendingUp size={18} className="text-success-text" strokeWidth={2} /></div>
        <p className="mt-2 text-kpi font-bold text-text-primary text-success-text">{formatAdminAccountingCurrency(totalIncomeMinor, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card border-danger-bg bg-danger-bg">
        <div className="mb-2 flex items-center justify-between gap-3 text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_EXPENSES')}</p><TrendingDown size={18} className="text-danger-text" strokeWidth={2} /></div>
        <p className="mt-2 text-kpi font-bold text-text-primary text-danger-text">{formatAdminAccountingCurrency(totalExpenseMinor, locale)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between gap-3 text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('NET_PROFIT')}</p><BarChart2 size={18} strokeWidth={2} className="text-text-secondary" /></div>
        <p className={`mt-2 text-kpi font-bold text-text-primary ${netProfitMinor >= 0 ? 'text-success-text' : 'text-danger-text'}`}>{formatAdminAccountingCurrency(netProfitMinor, locale)}</p>
      </div>
    </section>
  );
}


export type { AdminAccountsFinancialReportsKpiCardsProps };
