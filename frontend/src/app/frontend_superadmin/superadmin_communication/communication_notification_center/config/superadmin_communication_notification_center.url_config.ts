// RESPONSIBILITY: Define canonical route/configuration constants for communication notification center; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_communication/communication_notification_center/config/superadmin_communication_notification_center.url_config.ts -> typed constants -> owning route or API caller.

const SUPERADMIN_COMMUNICATION_URLS = {
  PAGE: '/superadmin/superadmin_communication',
  NOTICES_PAGE: '/superadmin/superadmin_communication/communication_notices',
  NOTIFICATION_CENTER_PAGE: '/superadmin/superadmin_communication/communication_notification_center',
} as const;

const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS = {
  PAGE: '/superadmin/superadmin_communication/communication_notification_center',
  SCREEN: '/superadmin/superadmin_communication/communication_notification_center',
  SCREENS: {
    communication_notification_center: '/superadmin/superadmin_communication/communication_notification_center',
  },
} as const;

/** Grouped public route contract for communication_notification_center */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES = {
  root: '/superadmin/superadmin_communication/communication_notification_center',
  overview: '/superadmin/superadmin_communication/communication_notification_center?tab=overview',
  templates: '/superadmin/superadmin_communication/communication_notification_center?tab=templates',
  logs: '/superadmin/superadmin_communication/communication_notification_center?tab=logs',
  usage: '/superadmin/superadmin_communication/communication_notification_center?tab=usage',
  // Sibling routes for navigation reference
  notices: '/superadmin/superadmin_communication/communication_notices',
  // Legacy compatibility exports
  SUPERADMIN_COMMUNICATION_URLS,
  MODULE_URLS: SUPERADMIN_COMMUNICATION_URLS,
  SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS,
} as const;

/** Canonical backend API endpoint paths consumed by communication_notification_center */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API = {
  list: '/api/v1/superadmin/communication/notifications',
  dispatch: '/api/v1/superadmin/communication/notifications/dispatch',
  retry: (id: string) => `/api/v1/superadmin/communication/notifications/${id}/retry` as const,
  templates: '/api/v1/superadmin/communication/templates',
  updateTemplate: (id: string) => `/api/v1/superadmin/communication/templates/${id}` as const,
  usage: '/api/v1/superadmin/communication/usage',
  accounts: '/api/v1/superadmin/communication/accounts',
} as const;
