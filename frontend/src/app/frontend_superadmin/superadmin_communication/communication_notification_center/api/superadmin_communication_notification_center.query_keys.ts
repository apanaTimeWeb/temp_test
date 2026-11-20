// RESPONSIBILITY: Query key factory for Superadmin Notification & Communication Center.
// FLOW: Feature domain -> api/superadmin_communication_notification_center.query_keys.ts -> TanStack Query cache.

export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS = {
  all: ['superadmin', 'superadmin_communication', 'communication_notification_center'] as const,
  lists: () => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | null | undefined>>) =>
    [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.details(), id] as const,
  templates: () => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all, 'templates'] as const,
  template: (id: string) => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.templates(), id] as const,
  usage: () => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all, 'usage'] as const,
  accounts: () => [...SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all, 'accounts'] as const,
} as const;
