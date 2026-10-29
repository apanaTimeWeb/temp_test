export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_refunds', 'payments'] as const,
  refunds: () => ['manager_refunds', 'refunds'] as const,
} as const;
