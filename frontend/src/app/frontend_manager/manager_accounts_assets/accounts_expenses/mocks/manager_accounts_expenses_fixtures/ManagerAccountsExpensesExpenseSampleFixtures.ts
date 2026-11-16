/**
 * Explicit sample-only expense ledger rows. These are illustrative fixtures, not live accounting data
 * and not a persistence/API contract.
 */
import type { ManagerAccountsExpensesPaymentMode } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';

export type ManagerAccountsExpensesExpenseSample = {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  mode: ManagerAccountsExpensesPaymentMode;
  source?: 'petty_cash' | 'bank_direct';
};

export const MANAGER_ACCOUNTING_SAMPLE_EXPENSES: ManagerAccountsExpensesExpenseSample[] = [
  { id: 1, date: '2026-04-01', category: 'Electricity',   description: 'Monthly electricity bill', amount: 420000, paidBy: 'Manager', mode: 'bank', source: 'bank_direct' },
  { id: 2, date: '2026-04-03', category: 'Maintenance',  description: 'AC servicing — Hall A', amount: 180000, paidBy: 'Staff', mode: 'cash', source: 'petty_cash' },
  { id: 3, date: '2026-04-05', category: 'Stationery',   description: 'Registers & pens', amount: 65000, paidBy: 'Manager', mode: 'cash', source: 'petty_cash' },
  { id: 4, date: '2026-04-08', category: 'Internet',     description: 'Broadband monthly plan', amount: 220000, paidBy: 'Admin', mode: 'upi', source: 'bank_direct' },
  { id: 5, date: '2026-04-10', category: 'Cleaning',     description: 'Housekeeping supplies', amount: 90000, paidBy: 'Staff', mode: 'cash', source: 'petty_cash' },
  { id: 6, date: '2026-04-12', category: 'Miscellaneous',description: 'Courier charges', amount: 32000, paidBy: 'Manager', mode: 'upi', source: 'petty_cash' },
];
