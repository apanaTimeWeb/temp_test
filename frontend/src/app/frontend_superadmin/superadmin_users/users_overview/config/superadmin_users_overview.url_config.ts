// RESPONSIBILITY: Define canonical route/configuration constants for users overview.
const SUPERADMIN_USERS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview",
  SCREEN: "/superadmin/superadmin_users/users_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_users/users_overview';

const SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS = {
  member_referrals: `${CANONICAL_OWNER_ROUTE}?view=member_referrals`,
  member_trust_score: `${CANONICAL_OWNER_ROUTE}?view=member_trust_score`,
} as const;

export const SUPERADMIN_USERS_OVERVIEW_ROUTES = {
  SUPERADMIN_USERS_OVERVIEW_URLS: SUPERADMIN_USERS_OVERVIEW_URLS,
  SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS,
} as const;

export const SUPERADMIN_USERS_OVERVIEW_API = {} as const;

export const SUPERADMIN_NAVIGATION_ROUTES = {
  security_user_sessions: '/superadmin/superadmin_security/security_user_sessions',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
} as const;
