import type { ManagerFinanceRenewalsRenewalFilter } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsTypes';

/** URL-backed filter options for renewal records. */
export const MANAGER_FINANCE_RENEWAL_FILTERS: { labelKey: string; value: ManagerFinanceRenewalsRenewalFilter; emoji: string }[] = [
  { labelKey: 'expired', value: 'expired', emoji: '🔴' },
  { labelKey: 'expiring_in_7_days', value: 'expiring_7', emoji: '🟠' },
  { labelKey: 'expiring_in_15_days', value: 'expiring_15', emoji: '🟡' },
];
