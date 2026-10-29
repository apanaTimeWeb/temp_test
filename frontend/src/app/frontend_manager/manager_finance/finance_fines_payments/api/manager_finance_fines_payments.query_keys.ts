export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_fines_payments', 'payments'] as const,
  refunds: () => ['manager_fines_payments', 'refunds'] as const,
} as const;
