export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_late_fees', 'payments'] as const,
  refunds: () => ['manager_late_fees', 'refunds'] as const,
} as const;
