// RESPONSIBILITY: Define canonical route/configuration constants for subscriptions overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_subscriptions/subscriptions_overview/config/superadmin_subscriptions_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_subscriptions/subscriptions_overview",
  SCREEN: "/superadmin/superadmin_subscriptions/subscriptions_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_subscriptions/subscriptions_overview';

const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS = {
  member_auto_suspend_policy: `${CANONICAL_OWNER_ROUTE}?view=member_auto_suspend_policy`,
  member_renewals: `${CANONICAL_OWNER_ROUTE}?view=member_renewals`,
  member_subscriptions: `${CANONICAL_OWNER_ROUTE}?view=member_subscriptions`,
} as const;

/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES = {
  SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_URLS: SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_URLS,
  SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS,
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  plans_pricing_catalog: '/superadmin/superadmin_plans/plans_pricing_catalog',
  subscriptions_active_subscribers: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
} as const;
