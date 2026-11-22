/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_MEMBERS_ENQUIRIES_QUERY_KEYS = {
  all: ['admin_members_enquiries'] as const,
  lists: () => [...ADMIN_MEMBERS_ENQUIRIES_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_MEMBERS_ENQUIRIES_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_MEMBERS_ENQUIRIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_MEMBERS_ENQUIRIES_QUERY_KEYS.details(), resourceId] as const,
} as const;
