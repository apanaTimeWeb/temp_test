/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ACCOUNTS_EXPENSES_QUERY_KEYS = {
  all: ['manager_accounts_assets', 'accounts_expenses'] as const,
  lists: () => ['manager_accounts_assets', 'accounts_expenses', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_accounts_assets', 'accounts_expenses', 'list', filters] as const,
  details: () => ['manager_accounts_assets', 'accounts_expenses', 'detail'] as const,
  detail: (id: string) => ['manager_accounts_assets', 'accounts_expenses', 'detail', id] as const,
} as const;
