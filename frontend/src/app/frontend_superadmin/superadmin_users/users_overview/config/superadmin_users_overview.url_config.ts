// RESPONSIBILITY: Define canonical route/configuration constants for users overview.
const SUPERADMIN_USERS_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_users/users_overview",
  SCREEN: "/superadmin/superadmin_users/users_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

export const SUPERADMIN_USERS_OVERVIEW_ROUTES = {
  SUPERADMIN_USERS_OVERVIEW_URLS: SUPERADMIN_USERS_OVERVIEW_URLS,
} as const;

export const SUPERADMIN_USERS_OVERVIEW_API = {} as const;

export const SUPERADMIN_NAVIGATION_ROUTES = {
  security_user_sessions: '/superadmin/superadmin_security/security_user_sessions',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
} as const;
