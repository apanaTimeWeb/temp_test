export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_trust_scores', 'payments'] as const,
  refunds: () => ['manager_trust_scores', 'refunds'] as const,
} as const;
