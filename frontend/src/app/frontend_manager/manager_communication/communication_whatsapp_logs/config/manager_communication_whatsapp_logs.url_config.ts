/** Canonical route ownership for manager communication whatsapp logs. */
export const MANAGER_COMMUNICATION_WHATSAPP_LOGS_ROUTES = { root: '/frontend_manager/manager_communication/communication_whatsapp_logs' } as const;

export const MANAGER_COMMUNICATION_WHATSAPP_LOGS_API = {
  LIST: '/api/v1/manager/communication/whatsapp-logs' as const,
  RESEND: (id: string) => `/api/v1/manager/communication/whatsapp-logs/${encodeURIComponent(id)}/resend` as const,
  EXPORT_CSV: '/api/v1/manager/communication/whatsapp-logs/export-csv' as const,
} as const;
