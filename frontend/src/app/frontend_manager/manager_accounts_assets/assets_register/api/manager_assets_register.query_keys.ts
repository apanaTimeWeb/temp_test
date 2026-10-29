/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ASSETS_REGISTER_QUERY_KEYS = {
  all: ['manager_accounts_assets', 'assets_register'] as const,
  lists: () => ['manager_accounts_assets', 'assets_register', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_accounts_assets', 'assets_register', 'list', filters] as const,
  details: () => ['manager_accounts_assets', 'assets_register', 'detail'] as const,
  detail: (id: string) => ['manager_accounts_assets', 'assets_register', 'detail', id] as const,
} as const;
