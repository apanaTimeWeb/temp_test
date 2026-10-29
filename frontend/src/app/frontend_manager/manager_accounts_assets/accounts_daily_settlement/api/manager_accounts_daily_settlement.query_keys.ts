/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS = {
  all: ['manager_accounts_assets', 'accounts_daily_settlement'] as const,
  lists: () => ['manager_accounts_assets', 'accounts_daily_settlement', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_accounts_assets', 'accounts_daily_settlement', 'list', filters] as const,
  details: () => ['manager_accounts_assets', 'accounts_daily_settlement', 'detail'] as const,
  detail: (id: string) => ['manager_accounts_assets', 'accounts_daily_settlement', 'detail', id] as const,
} as const;
