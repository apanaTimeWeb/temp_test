export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_renewals', 'payments'] as const,
  refunds: () => ['manager_renewals', 'refunds'] as const,
} as const;
