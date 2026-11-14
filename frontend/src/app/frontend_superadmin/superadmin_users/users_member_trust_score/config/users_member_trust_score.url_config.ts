// RESPONSIBILITY: Define canonical route/configuration constants for users member trust score; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_users/users_member_trust_score/config/users_member_trust_score.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the member_trust_score workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_MEMBER_TRUST_SCORE_URLS = {
  PAGE: '/superadmin/superadmin_users/users_member_trust_score',
  SCREEN: '/superadmin/superadmin_users/users_overview?view=member_trust_score',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview?view=member_trust_score",
  SCREEN: "/superadmin/superadmin_users/users_overview?view=member_trust_score",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_USERS_MEMBER_TRUST_SCORE_ROUTES = {
  SUPERADMIN_LIBRARIES_MEMBER_TRUST_SCORE_URLS: SUPERADMIN_LIBRARIES_MEMBER_TRUST_SCORE_URLS,
  SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS: SUPERADMIN_USERS_OVERVIEW_MEMBER_TRUST_SCORE_FINANCE_TRUST_SCORE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_USERS_MEMBER_TRUST_SCORE_API = {} as const;
