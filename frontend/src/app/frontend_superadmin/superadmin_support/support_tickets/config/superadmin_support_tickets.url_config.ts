// RESPONSIBILITY: Define canonical route/configuration constants for support tickets; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_support/support_tickets/config/superadmin_support_tickets.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_support/support_tickets",
  SCREEN: "/superadmin/superadmin_support/support_tickets",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUPPORT_TICKETS_ROUTES = {
  SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_URLS: SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUPPORT_TICKETS_API = {} as const;
