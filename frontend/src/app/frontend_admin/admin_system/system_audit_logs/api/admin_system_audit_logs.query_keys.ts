/** Dedicated query-key registry for this autonomous submodule. */

export const ADMIN_AUDIT_LOGS_QUERY_KEYS = {
  all: ['admin_audit_logs'] as const,
  lists: () => [...ADMIN_AUDIT_LOGS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_AUDIT_LOGS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_AUDIT_LOGS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_AUDIT_LOGS_QUERY_KEYS.details(), resourceId] as const,
} as const;
