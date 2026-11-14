// RESPONSIBILITY: Define canonical route/configuration constants for users overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_users/users_overview/config/superadmin_users_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_USERS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview",
  SCREEN: "/superadmin/superadmin_users/users_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview?view=member_referrals",
  SCREEN: "/superadmin/superadmin_users/users_overview?view=member_referrals",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview?view=member_trust_score",
  SCREEN: "/superadmin/superadmin_users/users_overview?view=member_trust_score",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS = {
  MEMBER_REFERRALS: '/superadmin/superadmin_users/users_overview?view=member_referrals',
  MEMBER_TRUST_SCORE: '/superadmin/superadmin_users/users_overview?view=member_trust_score',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_USERS_OVERVIEW_ROUTES = {
  SUPERADMIN_USERS_OVERVIEW_URLS: SUPERADMIN_USERS_OVERVIEW_URLS,
  SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS: SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS,
  SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS: SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS,
  SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_USERS_OVERVIEW_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  security_user_sessions: '/superadmin/superadmin_security/security_user_sessions',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
} as const;
