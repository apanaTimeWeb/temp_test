export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_payments', 'payments'] as const,
  refunds: () => ['manager_payments', 'refunds'] as const,
} as const;
