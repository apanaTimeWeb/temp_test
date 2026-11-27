export interface FinancialReportRowSpec {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
}

export interface FinancialReportCategorySpec {
  category: string;
  amountMinor: number;
  pct: number;
}

export interface FinancialReportExportSpec {
  period: string;
  rows: readonly FinancialReportRowSpec[];
  categories: readonly FinancialReportCategorySpec[];
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  customStartDate?: string;
  customEndDate?: string;
}
