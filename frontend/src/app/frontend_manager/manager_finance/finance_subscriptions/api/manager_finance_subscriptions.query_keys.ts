export const MANAGER_FINANCE_QUERY_KEYS = {
  payments: () => ['manager_subscriptions', 'payments'] as const,
  refunds: () => ['manager_subscriptions', 'refunds'] as const,
} as const;
