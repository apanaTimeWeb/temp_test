/** Canonical route ownership for manager communication notification center. */
export const MANAGER_COMMUNICATION_NOTIFICATION_CENTER_ROUTES = { root: '/frontend_manager/manager_communication/communication_notification_center' } as const;

export const MANAGER_COMMUNICATION_NOTIFICATION_CENTER_API = {
  LIST: '/api/v1/manager/communication/notifications' as const,
  MARK_READ: (id: string) => `/api/v1/manager/communication/notifications/${encodeURIComponent(id)}/read` as const,
  CLEAR_ALL: '/api/v1/manager/communication/notifications/clear-all' as const,
} as const;
