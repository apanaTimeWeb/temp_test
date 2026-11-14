// RESPONSIBILITY: Define canonical route/configuration constants for subscriptions active subscribers; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_subscriptions/subscriptions_active_subscribers/config/superadmin_subscriptions_active_subscribers.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Active Subscribers autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
  SCREEN: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_ROUTES = {
  SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_URLS: SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  plans_pricing_catalog: '/superadmin/superadmin_plans/plans_pricing_catalog',
  subscriptions_active_subscribers: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
} as const;
