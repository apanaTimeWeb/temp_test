// RESPONSIBILITY: Define local sample fixtures for accounting expenses; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_accounting/accounting_expenses/mocks/fixtures/SuperadminAccountingExpensesExpenseMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingExpense } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesExpenseTypes';

/** Synthetic expense ledger records for local preview only. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSES: readonly SuperadminAccountingExpense[] = [
  { id: 1, date: '2026-04-01', category: 'Electricity', description: 'Sample monthly electricity bill', amount: 4200, paidBy: 'Sample Operator A', mode: 'bank' },
  { id: 2, date: '2026-04-03', category: 'Maintenance', description: 'Sample AC servicing — Hall A', amount: 1800, paidBy: 'Sample Operator B', mode: 'cash' },
  { id: 3, date: '2026-04-05', category: 'Stationery', description: 'Sample registers and pens', amount: 650, paidBy: 'Sample Operator A', mode: 'cash' },
  { id: 4, date: '2026-04-08', category: 'Internet', description: 'Sample broadband plan', amount: 2200, paidBy: 'Sample Operator C', mode: 'upi' },
  { id: 5, date: '2026-04-10', category: 'Cleaning', description: 'Sample housekeeping supplies', amount: 900, paidBy: 'Sample Operator B', mode: 'cash' },
  { id: 6, date: '2026-04-12', category: 'Miscellaneous', description: 'Sample courier charges', amount: 320, paidBy: 'Sample Operator A', mode: 'upi' },
];
