// RESPONSIBILITY: Define canonical route/configuration constants for subscriptions member auto suspend policy; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/config/subscriptions_member_auto_suspend_policy.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_auto_suspend_policy workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_MEMBER_AUTO_SUSPEND_POLICY_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy',
  SCREEN: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_AUTO_SUSPEND_POLICY_FINANCE_AUTO_SUSPEND_URLS = {
  PAGE: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy",
  SCREEN: "/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_ROUTES = {
  SUPERADMIN_LIBRARIES_MEMBER_AUTO_SUSPEND_POLICY_URLS: SUPERADMIN_LIBRARIES_MEMBER_AUTO_SUSPEND_POLICY_URLS,
  SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_AUTO_SUSPEND_POLICY_FINANCE_AUTO_SUSPEND_URLS: SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MEMBER_AUTO_SUSPEND_POLICY_FINANCE_AUTO_SUSPEND_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SUBSCRIPTIONS_MEMBER_AUTO_SUSPEND_POLICY_API = {} as const;
