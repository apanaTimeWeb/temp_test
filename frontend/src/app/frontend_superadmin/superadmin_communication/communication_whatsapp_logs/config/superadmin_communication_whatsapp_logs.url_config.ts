// RESPONSIBILITY: Define canonical route/configuration constants for communication whatsapp logs; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_communication/communication_whatsapp_logs/config/superadmin_communication_whatsapp_logs.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_URLS = {
  PAGE: "/superadmin/superadmin_communication/communication_whatsapp_logs",
  SCREEN: "/superadmin/superadmin_communication/communication_whatsapp_logs",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_ROUTES = {
  SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_URLS: SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_API = {} as const;
