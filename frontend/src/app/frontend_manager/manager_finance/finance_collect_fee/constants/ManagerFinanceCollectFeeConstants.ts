import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

/** Supported payment-mode options for the collect-fee feature. */
export const MANAGER_FINANCE_COLLECT_FEE_MODES: ManagerFinanceCollectFeeMode[] = ['cash', 'upi', 'card', 'bank'];

export const MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS = 300;
