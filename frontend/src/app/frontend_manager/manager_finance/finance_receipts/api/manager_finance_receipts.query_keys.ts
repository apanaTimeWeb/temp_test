export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_receipt', 'payments'] as const,
  refunds: () => ['manager_receipt', 'refunds'] as const,
} as const;
