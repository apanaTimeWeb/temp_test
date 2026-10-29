export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_payment_promises', 'payments'] as const,
  refunds: () => ['manager_payment_promises', 'refunds'] as const,
} as const;
