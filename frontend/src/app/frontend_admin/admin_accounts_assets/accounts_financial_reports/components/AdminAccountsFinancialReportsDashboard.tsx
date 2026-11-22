'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsDashboard component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import { AdminAccountsFinancialReportsCategoryBreakdown } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsCategoryBreakdown';
import { AdminAccountsFinancialReportsKpiCards } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsKpiCards';
import { AdminAccountsFinancialReportsMonthlyChart } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsMonthlyChart';
import { ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import type { AdminAccountsFinancialReportsDashboardProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';


/** Composes the three report sections while keeping each visual responsibility isolated. */
export function AdminAccountsFinancialReportsDashboard({
  period,
  customStartDate,
  customEndDate,
}: AdminAccountsFinancialReportsDashboardProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const rows = useMemo(() => {
    if (period === 'monthly') return ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES;
    if (period === 'quarterly') {
      const groups = [
        { month: t('PERIOD_OCT_DEC'), source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(0, 3) },
        { month: t('PERIOD_JAN_MAR'), source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(3, 6) },
        { month: t('PERIOD_APR'), source: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.slice(6, 7) },
      ];
      return groups.map((group) => ({
        month: group.month,
        incomeMinor: group.source.reduce((sum, item) => sum + item.incomeMinor, 0),
        expenseMinor: group.source.reduce((sum, item) => sum + item.expenseMinor, 0),
      }));
    }
    if (period === 'custom') {
      const label = customStartDate && customEndDate
        ? `${customStartDate.slice(5)} ~ ${customEndDate.slice(5)}`
        : 'Custom Window';
      // Represents custom window proportional aggregation
      return [{
        month: label,
        incomeMinor: Math.round(ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.incomeMinor, 0) * 0.45),
        expenseMinor: Math.round(ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.expenseMinor, 0) * 0.45),
      }];
    }
    return [{
      month: t('PERIOD_TOTAL'),
      incomeMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.incomeMinor, 0),
      expenseMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.expenseMinor, 0),
    }];
  }, [period, customStartDate, customEndDate, t]);

  const totalIncomeMinor = rows.reduce((sum, row) => sum + row.incomeMinor, 0);
  const totalExpenseMinor = rows.reduce((sum, row) => sum + row.expenseMinor, 0);

  return (
    <div className="space-y-6">
      <AdminAccountsFinancialReportsKpiCards totalIncomeMinor={totalIncomeMinor} totalExpenseMinor={totalExpenseMinor} period={period} />
      <AdminAccountsFinancialReportsMonthlyChart rows={rows} period={period} />
      <AdminAccountsFinancialReportsCategoryBreakdown />
    </div>
  );
}


export type { AdminAccountsFinancialReportsDashboardProps };
