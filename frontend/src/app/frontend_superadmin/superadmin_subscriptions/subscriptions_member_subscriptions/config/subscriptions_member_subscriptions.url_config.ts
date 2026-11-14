// RESPONSIBILITY: Define canonical route/configuration constants for subscriptions member subscriptions; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_subscriptions/subscriptions_member_subscriptions/config/subscriptions_member_subscriptions.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_subscriptions workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_MEMBER_SUBSCRIPTIONS_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions/subscriptions_member_subscriptions',
  SCREEN: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_SUBSCRIPTIONS_FINANCE_SUBSCRIPTIONS_URLS = {
  PAGE: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions",
  SCREEN: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_ROUTES = {
  SUPERADMIN_LIBRARIES_MEMBER_SUBSCRIPTIONS_URLS: SUPERADMIN_LIBRARIES_MEMBER_SUBSCRIPTIONS_URLS,
  SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_SUBSCRIPTIONS_FINANCE_SUBSCRIPTIONS_URLS: SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_SUBSCRIPTIONS_FINANCE_SUBSCRIPTIONS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_SUBSCRIPTIONS_API = {} as const;
