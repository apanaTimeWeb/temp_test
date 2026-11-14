// RESPONSIBILITY: Define canonical route/configuration constants for users member referrals; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_users/users_member_referrals/config/users_member_referrals.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_referrals workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_MEMBER_REFERRALS_URLS = {
  PAGE: '/superadmin/superadmin_users/users_member_referrals',
  SCREEN: '/superadmin/superadmin_users/users_overview?view=member_referrals',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview?view=member_referrals",
  SCREEN: "/superadmin/superadmin_users/users_overview?view=member_referrals",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_USERS_MEMBER_REFERRALS_ROUTES = {
  SUPERADMIN_LIBRARIES_MEMBER_REFERRALS_URLS: SUPERADMIN_LIBRARIES_MEMBER_REFERRALS_URLS,
  SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS: SUPERADMIN_USERS_OVERVIEW_MEMBER_REFERRALS_FINANCE_REFERRALS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_USERS_MEMBER_REFERRALS_API = {} as const;
