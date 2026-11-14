'use client';
/** Responsibility: Render the daily settlement sample totals as a focused KPI group. */
import { useTranslations } from 'next-intl';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/utils/SuperadminAccountingDailySettlementFormatters';
type Props = { cash: number; upi: number; expenses: number; locale: string };
export default function SuperadminAccountingDailySettlementSummaryCards({ cash, upi, expenses, locale }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="acct-kpi-card"><p className="acct-kpi-label acct-text-success">{tCopy('COPY.CASH_COLLECTED')}</p><p className="acct-kpi-value acct-text-success">{formatSuperadminAccountingMajorPreviewCurrency(cash, 'INR', locale)}</p></div>
    <div className="acct-kpi-card"><p className="acct-kpi-label acct-text-info">{tCopy('COPY.UPI_COLLECTED')}</p><p className="acct-kpi-value acct-text-info">{formatSuperadminAccountingMajorPreviewCurrency(upi, 'INR', locale)}</p></div>
    <div className="acct-kpi-card acct-kpi-card--danger"><p className="acct-kpi-label acct-kpi-label--danger">{tCopy('COPY.EXPENSES')}</p><p className="acct-kpi-value acct-kpi-value--danger">{formatSuperadminAccountingMajorPreviewCurrency(expenses, 'INR', locale)}</p></div>
    <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy('COPY.NET')}</p><p className="acct-kpi-value">{formatSuperadminAccountingMajorPreviewCurrency(cash + upi - expenses, 'INR', locale)}</p></div>
  </div>;
}
