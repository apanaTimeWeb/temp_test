import type { ReactNode } from 'react';

export type AdminAccountsFinancialReportsScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

export interface AdminAccountingFinancialReportPeriodRow {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
}

export type AdminAccountingFinancialReportPeriod = 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface AdminAccountsFinancialReportsDashboardProps {
  period: AdminAccountingFinancialReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export interface AdminAccountsFinancialReportsKpiCardsProps {
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  period?: AdminAccountingFinancialReportPeriod;
}

export interface AdminAccountsFinancialReportsMonthlyChartProps {
  rows: readonly AdminAccountingFinancialReportPeriodRow[];
  period?: AdminAccountingFinancialReportPeriod;
}

export interface AdminAccountsFinancialReportsHarnessProps {
  children: ReactNode;
  scenario?: AdminAccountsFinancialReportsScenario;
}
