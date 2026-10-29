/** Canonical URL contract for the manager role shell. Business destinations below are verified against their owning leaf route configs. */
const ROOT = '/frontend_manager' as const;

export const MANAGER_NAVIGATION_NAVIGATION_ROUTES = {
  ROOT,
  root: ROOT,
  DASHBOARD: '/frontend_manager/manager_dashboard/dashboard_overview',
  HELP_SUPPORT: '/frontend_manager/manager_settings/settings_help_support',
  NOTIFICATIONS: '/frontend_manager/manager_communication/communication_notification_center',
} as const;

/** The role shell has no backend API contract of its own. */
export const MANAGER_NAVIGATION_NAVIGATION_API = {} as const;
