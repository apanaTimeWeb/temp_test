import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

/** Supported payment-mode options for the collect-fee feature. */
export const MANAGER_FINANCE_COLLECT_FEE_MODES: ManagerFinanceCollectFeeMode[] = ['cash', 'upi', 'card', 'bank'];

export const MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS = 300;

export interface ManagerFinanceFeeCategory {
  id: string;
  name: string;
  defaultAmount: number;
  description: string;
}

export const MANAGER_FINANCE_FEE_CATEGORIES: ManagerFinanceFeeCategory[] = [
  { id: 'seat_fee', name: 'Seat Monthly Fee', defaultAmount: 1200, description: 'Monthly study desk subscription' },
  { id: 'locker_fee', name: 'Locker Fee', defaultAmount: 400, description: 'Personal locker rent' },
  { id: 'admission', name: 'Admission Fee', defaultAmount: 500, description: 'One-time registration fee' },
  { id: 'deposit', name: 'Security Deposit', defaultAmount: 1000, description: 'Refundable security deposit' },
  { id: 'fine', name: 'Overdue / Late Fine', defaultAmount: 200, description: 'Penalty for overdue payment' },
  { id: 'other', name: 'Other / Misc', defaultAmount: 0, description: 'ID card re-issue or manual adjustment' },
];
