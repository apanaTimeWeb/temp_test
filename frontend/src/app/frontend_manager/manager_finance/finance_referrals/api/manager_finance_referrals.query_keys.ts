export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_referrals', 'payments'] as const,
  refunds: () => ['manager_referrals', 'refunds'] as const,
} as const;
