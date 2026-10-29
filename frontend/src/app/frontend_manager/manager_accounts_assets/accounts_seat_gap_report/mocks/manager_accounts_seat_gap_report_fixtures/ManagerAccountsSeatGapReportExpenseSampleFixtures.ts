/**
 * Explicit sample-only expense ledger rows. These are illustrative fixtures, not live accounting data
 * and not a persistence/API contract.
 */
import type { ManagerAccountsSeatGapReportPaymentMode } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/constants/ManagerAccountsSeatGapReportConstants';

export type ManagerAccountsSeatGapReportExpenseSample = {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  mode: ManagerAccountsSeatGapReportPaymentMode;
};

export const MANAGER_ACCOUNTING_SAMPLE_EXPENSES: ManagerAccountsSeatGapReportExpenseSample[] = [
  { id: 1, date: '2026-04-01', category: 'Electricity',   description: 'Monthly electricity bill', amount: 420000, paidBy: 'Manager', mode: 'bank' },
  { id: 2, date: '2026-04-03', category: 'Maintenance',  description: 'AC servicing — Hall A', amount: 180000, paidBy: 'Staff', mode: 'cash' },
  { id: 3, date: '2026-04-05', category: 'Stationery',   description: 'Registers & pens', amount: 65000, paidBy: 'Manager', mode: 'cash' },
  { id: 4, date: '2026-04-08', category: 'Internet',     description: 'Broadband monthly plan', amount: 220000, paidBy: 'Admin', mode: 'upi' },
  { id: 5, date: '2026-04-10', category: 'Cleaning',     description: 'Housekeeping supplies', amount: 90000, paidBy: 'Staff', mode: 'cash' },
  { id: 6, date: '2026-04-12', category: 'Miscellaneous',description: 'Courier charges', amount: 32000, paidBy: 'Manager', mode: 'upi' },
];
