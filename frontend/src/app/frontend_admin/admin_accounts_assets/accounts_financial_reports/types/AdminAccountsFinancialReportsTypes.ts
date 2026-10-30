import type { AdminAccountsFinancialReportsScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminAccountingFinancialReportPeriodRow {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
}

export type AdminAccountingFinancialReportPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface AdminAccountsFinancialReportsDashboardProps {
  period: AdminAccountingFinancialReportPeriod;
}

export interface AdminAccountsFinancialReportsKpiCardsProps {
  totalIncomeMinor: number;
  totalExpenseMinor: number;
}

export interface AdminAccountsFinancialReportsMonthlyChartProps {
  rows: readonly AdminAccountingFinancialReportPeriodRow[];
}

export interface AdminAccountsFinancialReportsHarnessProps {
  children: ReactNode;
  scenario?: AdminAccountsFinancialReportsScenario;
}
