// RESPONSIBILITY: Render the financial report income, expense and net-profit KPI cards.
'use client';
import { useTranslations } from 'next-intl';
import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/utils/SuperadminAccountingFinancialReportsFormatters';
type Props = { totalIncome: number; totalExpense: number; netProfit: number; locale: string };
export default function SuperadminAccountingFinancialReportsKpiCards({ totalIncome, totalExpense, netProfit, locale }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="acct-kpi-card"><div className="acct-kpi-card__header"><p className="acct-kpi-label acct-text-success">{tCopy('COPY.TOTAL_INCOME')}</p><TrendingUp size={18} className="acct-text-success" aria-hidden="true" /></div><p className="acct-kpi-value acct-text-success">{formatSuperadminAccountingMajorPreviewCurrency(totalIncome, 'INR', locale)}</p></div>
    <div className="acct-kpi-card acct-kpi-card--danger"><div className="acct-kpi-card__header"><p className="acct-kpi-label acct-kpi-label--danger">{tCopy('COPY.TOTAL_EXPENSES')}</p><TrendingDown size={18} className="acct-text-danger" aria-hidden="true" /></div><p className="acct-kpi-value acct-kpi-value--danger">{formatSuperadminAccountingMajorPreviewCurrency(totalExpense, 'INR', locale)}</p></div>
    <div className="acct-kpi-card"><div className="acct-kpi-card__header"><p className="acct-kpi-label">{tCopy('COPY.NET_PROFIT')}</p><BarChart2 size={18} className="acct-icon-muted" aria-hidden="true" /></div><p className={`acct-kpi-value ${netProfit >= 0 ? 'acct-text-success' : 'acct-text-danger'}`}>{formatSuperadminAccountingMajorPreviewCurrency(netProfit, 'INR', locale)}</p></div>
  </div>;
}
