/** Explicitly non-production records used only by the financial report demo preview. Amounts are stored in paise. */
export const ADMIN_ACCOUNTS_FINANCIAL_REPORTS_MONTHLY_FIXTURES = [
  { month: 'Oct', incomeMinor: 4_200_000, expenseMinor: 1_800_000 },
  { month: 'Nov', incomeMinor: 3_800_000, expenseMinor: 1_500_000 },
  { month: 'Dec', incomeMinor: 5_100_000, expenseMinor: 2_200_000 },
  { month: 'Jan', incomeMinor: 4_700_000, expenseMinor: 1_900_000 },
  { month: 'Feb', incomeMinor: 4_400_000, expenseMinor: 1_700_000 },
  { month: 'Mar', incomeMinor: 5_600_000, expenseMinor: 2_100_000 },
  { month: 'Apr', incomeMinor: 6_100_000, expenseMinor: 2_400_000 },
] as const;

export const ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES = [
  { category: 'Electricity', amountMinor: 420_000, pct: 17 },
  { category: 'Maintenance', amountMinor: 360_000, pct: 15 },
  { category: 'Internet', amountMinor: 220_000, pct: 9 },
  { category: 'Salary', amountMinor: 1_200_000, pct: 50 },
  { category: 'Miscellaneous', amountMinor: 220_000, pct: 9 },
] as const;
