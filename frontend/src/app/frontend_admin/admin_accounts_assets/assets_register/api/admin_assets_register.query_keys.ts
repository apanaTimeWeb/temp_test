/** Dedicated query-key registry for this autonomous submodule. */

export const ADMIN_ASSETS_REGISTER_QUERY_KEYS = {
  all: ['admin_assets_register'] as const,
  lists: () => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.details(), resourceId] as const,
} as const;
