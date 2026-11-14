// RESPONSIBILITY: Define canonical route/configuration constants for communication whatsapp integration; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_communication/communication_whatsapp_integration/config/superadmin_communication_whatsapp_integration.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_URLS = {
  PAGE: "/superadmin/superadmin_communication/communication_whatsapp_integration",
  SCREEN: "/superadmin/superadmin_communication/communication_whatsapp_integration",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_ROUTES = {
  SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_URLS: SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_API = {} as const;
