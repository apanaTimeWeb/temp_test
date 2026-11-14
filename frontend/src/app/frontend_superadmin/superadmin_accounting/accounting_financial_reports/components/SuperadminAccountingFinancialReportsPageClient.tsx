// RESPONSIBILITY: Orchestrate financial-report period selection and derived local sample totals.
'use client';
import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useSuperadminAccountingFinancialReportsUrlFilter } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/hooks/useSuperadminAccountingFinancialReportsUrlFilter';
import { SUPERADMIN_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN, SUPERADMIN_ACCOUNTING_SAMPLE_MONTHLY_REPORT } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/mocks/fixtures/SuperadminAccountingFinancialReportsFinancialReportMockFixtures';
import type { SuperadminAccountingPeriod } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/types/superadmin_accounting_financial_reports.types';
import { SuperadminAccountingFinancialReportsEmptyState } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsEmptyState';
import SuperadminAccountingFinancialReportsPageHeader from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsPageHeader';
import SuperadminAccountingFinancialReportsKpiCards from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsKpiCards';
import SuperadminAccountingFinancialReportsIncomeExpenseChart from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsIncomeExpenseChart';
import SuperadminAccountingFinancialReportsCategoryBreakdown from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsCategoryBreakdown';
export default function SuperadminAccountingFinancialReportsPageClient() {
  const locale = useLocale();
  const [period, setPeriod] = useSuperadminAccountingFinancialReportsUrlFilter<SuperadminAccountingPeriod>('period', 'monthly', ['monthly', 'quarterly', 'yearly']);
  const visibleMonths = useMemo(() => period === 'monthly' ? SUPERADMIN_ACCOUNTING_SAMPLE_MONTHLY_REPORT.slice(-1) : period === 'quarterly' ? SUPERADMIN_ACCOUNTING_SAMPLE_MONTHLY_REPORT.slice(-3) : SUPERADMIN_ACCOUNTING_SAMPLE_MONTHLY_REPORT, [period]);
  const totalIncome = visibleMonths.reduce((sum, entry) => sum + entry.income, 0);
  const totalExpense = visibleMonths.reduce((sum, entry) => sum + entry.expense, 0);
  return <div className="space-y-6">
    <SuperadminAccountingFinancialReportsPageHeader period={period} onPeriodChange={setPeriod} />
    {visibleMonths.length === 0 || SUPERADMIN_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN.length === 0 ? <SuperadminAccountingFinancialReportsEmptyState /> : <>
      <SuperadminAccountingFinancialReportsKpiCards totalIncome={totalIncome} totalExpense={totalExpense} netProfit={totalIncome - totalExpense} locale={locale} />
      <SuperadminAccountingFinancialReportsIncomeExpenseChart visibleMonths={visibleMonths} period={period} />
      <SuperadminAccountingFinancialReportsCategoryBreakdown categories={SUPERADMIN_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN} />
    </>}
  </div>;
}
