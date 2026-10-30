// RESPONSIBILITY: AdminAccountsFinancialReportsDashboard component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.
'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import type { AdminAccountingFinancialReportPeriod } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';
import { AdminAccountsFinancialReportsKpiCards } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsKpiCards';
import { AdminAccountsFinancialReportsMonthlyChart } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsMonthlyChart';
import { AdminAccountsFinancialReportsCategoryBreakdown } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsCategoryBreakdown';
import type { AdminAccountsFinancialReportsDashboardProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';


/** Composes the three report sections while keeping each visual responsibility isolated. */
export function AdminAccountsFinancialReportsDashboard({ period }: AdminAccountsFinancialReportsDashboardProps) {
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
    return [{
      month: t('PERIOD_TOTAL'),
      incomeMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.incomeMinor, 0),
      expenseMinor: ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES.reduce((sum, item) => sum + item.expenseMinor, 0),
    }];
  }, [period, t]);

  const totalIncomeMinor = rows.reduce((sum, row) => sum + row.incomeMinor, 0);
  const totalExpenseMinor = rows.reduce((sum, row) => sum + row.expenseMinor, 0);

  return (
    <div className="space-y-6">
      <AdminAccountsFinancialReportsKpiCards totalIncomeMinor={totalIncomeMinor} totalExpenseMinor={totalExpenseMinor} />
      <AdminAccountsFinancialReportsMonthlyChart rows={rows} />
      <AdminAccountsFinancialReportsCategoryBreakdown />
    </div>
  );
}


export type { AdminAccountsFinancialReportsDashboardProps };
