// RESPONSIBILITY: Define canonical route/configuration constants for libraries overview.
const SUPERADMIN_LIBRARIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  LIST: '/superadmin/superadmin_libraries',
  ADD_LIBRARY: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
} as const;

const SUPERADMIN_LIBRARIES_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

export const SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES = {
  SUPERADMIN_LIBRARIES_URLS: SUPERADMIN_LIBRARIES_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_URLS,
} as const;

export const SUPERADMIN_LIBRARIES_OVERVIEW_API = {} as const;
