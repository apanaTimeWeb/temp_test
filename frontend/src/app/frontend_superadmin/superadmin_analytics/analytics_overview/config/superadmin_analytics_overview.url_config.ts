// RESPONSIBILITY: Define canonical route/configuration constants for analytics overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_analytics/analytics_overview/config/superadmin_analytics_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public URL aliases. The host Next.js rewrites in INTEGRATION_GUIDE.md map these aliases to the canonical frontend_superadmin route tree. */
const SUPERADMIN_REPORTS_URLS = {
  LIBRARIES_PAGE: '/superadmin/superadmin_libraries',
  PAGE: '/superadmin/superadmin_analytics',
} as const;

/**
 * No API endpoint strings are declared for this feature because the supplied
 * audit inputs contain no verified API contract for it. Do not invent paths.
 */
const MODULE_URLS = SUPERADMIN_REPORTS_URLS;
/**
 * Defines the public ModuleUrls contract for analytics overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for analytics_overview; screens share this isolated feature module. */
const SUPERADMIN_REPORTS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_analytics/analytics_overview",
  SCREEN: "/superadmin/superadmin_analytics/analytics_overview",
  SCREENS: {
    "analytics_overview": "/superadmin/superadmin_analytics/analytics_overview",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_ANALYTICS_OVERVIEW_ROUTES = {
  SUPERADMIN_REPORTS_URLS: SUPERADMIN_REPORTS_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_REPORTS_OVERVIEW_URLS: SUPERADMIN_REPORTS_OVERVIEW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_ANALYTICS_OVERVIEW_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  analytics_financials: '/superadmin/superadmin_analytics/analytics_financials',
  analytics_library_growth: '/superadmin/superadmin_analytics/analytics_library_growth',
  analytics_subscription_mix: '/superadmin/superadmin_analytics/analytics_subscription_mix',
} as const;
