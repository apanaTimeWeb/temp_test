// RESPONSIBILITY: Define canonical route/configuration constants for subscriptions member renewals; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_subscriptions/subscriptions_member_renewals/config/subscriptions_member_renewals.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_renewals workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_MEMBER_RENEWALS_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions/subscriptions_member_renewals',
  SCREEN: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_RENEWALS_FINANCE_RENEWALS_URLS = {
  PAGE: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals",
  SCREEN: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_ROUTES = {
  SUPERADMIN_LIBRARIES_MEMBER_RENEWALS_URLS: SUPERADMIN_LIBRARIES_MEMBER_RENEWALS_URLS,
  SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_RENEWALS_FINANCE_RENEWALS_URLS: SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_RENEWALS_FINANCE_RENEWALS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_RENEWALS_API = {} as const;
