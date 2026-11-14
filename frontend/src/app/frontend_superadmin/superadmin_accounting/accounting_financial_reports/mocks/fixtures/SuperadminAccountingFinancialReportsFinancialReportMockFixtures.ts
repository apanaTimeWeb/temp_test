// RESPONSIBILITY: Define local sample fixtures for accounting financial reports; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_accounting/accounting_financial_reports/mocks/fixtures/SuperadminAccountingFinancialReportsFinancialReportMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingCategoryEntry, SuperadminAccountingMonthlyEntry, SuperadminAccountingPeriod } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/types/superadmin_accounting_financial_reports.types';

/** Illustrative accounting report values; not live financial data. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_MONTHLY_REPORT: readonly SuperadminAccountingMonthlyEntry[] = [
  { month: 'Oct', income: 42000, expense: 18000 }, { month: 'Nov', income: 38000, expense: 15000 },
  { month: 'Dec', income: 51000, expense: 22000 }, { month: 'Jan', income: 47000, expense: 19000 },
  { month: 'Feb', income: 44000, expense: 17000 }, { month: 'Mar', income: 56000, expense: 21000 },
  { month: 'Apr', income: 61000, expense: 24000 },
];
export const SUPERADMIN_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN: readonly SuperadminAccountingCategoryEntry[] = [
  { category: 'Electricity', amount: 4200, pct: 17 }, { category: 'Maintenance', amount: 3600, pct: 15 },
  { category: 'Internet', amount: 2200, pct: 9 }, { category: 'Salary', amount: 12000, pct: 50 },
  { category: 'Miscellaneous', amount: 2200, pct: 9 },
];
export const SUPERADMIN_ACCOUNTING_REPORT_PERIODS: readonly SuperadminAccountingPeriod[] = ['monthly', 'quarterly', 'yearly'];
