export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_invoice', 'payments'] as const,
  refunds: () => ['manager_invoice', 'refunds'] as const,
} as const;
