/** Canonical route/API contract for manager help and support. */
export const MANAGER_SETTINGS_HELP_SUPPORT_ROUTES = { root: '/frontend_manager/manager_settings/settings_help_support' } as const;

export const MANAGER_SETTINGS_HELP_SUPPORT_API = {
  LIST_TICKETS: '/api/v1/manager/settings/help-support/tickets' as const,
  CREATE_TICKET: '/api/v1/manager/settings/help-support/tickets' as const,
  DETAIL_TICKET: (id: string) => `/api/v1/manager/settings/help-support/tickets/${encodeURIComponent(id)}` as const,
  ANNOUNCEMENTS: '/api/v1/manager/settings/help-support/announcements' as const,
  SYSTEM_STATUS: '/api/v1/manager/settings/help-support/system-status' as const,
} as const;
