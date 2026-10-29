export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_auto_suspend', 'payments'] as const,
  refunds: () => ['manager_auto_suspend', 'refunds'] as const,
} as const;
