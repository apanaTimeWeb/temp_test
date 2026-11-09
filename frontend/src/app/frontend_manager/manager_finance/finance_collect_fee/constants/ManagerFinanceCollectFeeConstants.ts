import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

/** Supported payment-mode options for the collect-fee feature (Cash and UPI only). */
export const MANAGER_FINANCE_COLLECT_FEE_MODES: ManagerFinanceCollectFeeMode[] = ['cash', 'upi'];

export const MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS = 300;
