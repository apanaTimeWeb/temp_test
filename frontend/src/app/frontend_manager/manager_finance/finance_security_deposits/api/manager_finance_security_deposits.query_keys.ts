export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_security_deposits', 'payments'] as const,
  refunds: () => ['manager_security_deposits', 'refunds'] as const,
} as const;
