import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

/** Supported payment-mode options for the collect-fee feature. */
export const MANAGER_FINANCE_COLLECT_FEE_MODES: ManagerFinanceCollectFeeMode[] = ['cash', 'upi', 'card', 'bank'];

export const MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS = 300;

export const STANDARD_CYCLE_AMOUNTS: Record<string, number> = {
  '1': 1200,
  '3': 3400,
  '6': 6500,
  '12': 12000,
};

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

export type ManagerFinanceCollectionType = 'monthly' | 'dues' | 'fine' | 'partial' | 'locker';

export interface ManagerFinanceCollectionTypeOption {
  id: ManagerFinanceCollectionType;
  label: string;
  badge: string;
  description: string;
}

export const MANAGER_FINANCE_COLLECTION_TYPES: ManagerFinanceCollectionTypeOption[] = [
  {
    id: 'monthly',
    label: 'Monthly Fee / Renewal',
    badge: 'Standard Cycle',
    description: 'Collect regular monthly seat / study desk renewal fee',
  },
  {
    id: 'dues',
    label: 'Clear Outstanding Dues',
    badge: 'Pending Balance',
    description: 'Settle outstanding unpaid balance for past periods',
  },
  {
    id: 'fine',
    label: 'Late Fine / Penalty Only',
    badge: 'Fine Only',
    description: 'Collect late payment penalty without extending cycle',
  },
  {
    id: 'partial',
    label: 'Partial Payment',
    badge: 'Partially Paid',
    description: 'Collect partial amount; remaining balance carries forward',
  },
  {
    id: 'locker',
    label: 'Locker Allocation Fee',
    badge: 'Add-on Rent',
    description: 'Collect personal locker rent / renewal',
  },
];
