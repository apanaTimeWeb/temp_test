// RESPONSIBILITY: Define canonical route/configuration constants for analytics financials; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_analytics/analytics_financials/config/superadmin_analytics_financials.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Financials autonomous workflow; no API contract is inferred. */
const SUPERADMIN_REPORTS_FINANCIALS_URLS = {
  PAGE: '/superadmin/superadmin_analytics/analytics_financials',
  SCREEN: '/superadmin/superadmin_analytics/analytics_financials',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const SUPERADMIN_REPORTS_URLS = { LIBRARIES_PAGE: '/superadmin/superadmin_libraries', PAGE: '/superadmin/superadmin_analytics' } as const;
const MODULE_URLS = SUPERADMIN_REPORTS_URLS;



/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_ANALYTICS_FINANCIALS_ROUTES = {
  SUPERADMIN_REPORTS_FINANCIALS_URLS: SUPERADMIN_REPORTS_FINANCIALS_URLS,
  SUPERADMIN_REPORTS_URLS: SUPERADMIN_REPORTS_URLS,
  MODULE_URLS: MODULE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_ANALYTICS_FINANCIALS_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  analytics_financials: '/superadmin/superadmin_analytics/analytics_financials',
  analytics_library_growth: '/superadmin/superadmin_analytics/analytics_library_growth',
  analytics_subscription_mix: '/superadmin/superadmin_analytics/analytics_subscription_mix',
} as const;
