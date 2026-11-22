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

const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_libraries/libraries_overview';

const SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS = {
  facility_asset_maintenance: `${CANONICAL_OWNER_ROUTE}?view=facility_asset_maintenance`,
  facility_asset_registry: `${CANONICAL_OWNER_ROUTE}?view=facility_asset_registry`,
  facility_maintenance_work_orders: `${CANONICAL_OWNER_ROUTE}?view=facility_maintenance_work_orders`,
  facility_power_management: `${CANONICAL_OWNER_ROUTE}?view=facility_power_management`,
  library_capacity_analysis: `${CANONICAL_OWNER_ROUTE}?view=library_capacity_analysis`,
  library_capacity_gap_filling: `${CANONICAL_OWNER_ROUTE}?view=library_capacity_gap_filling`,
  library_capacity_scaling_recommendations: `${CANONICAL_OWNER_ROUTE}?view=library_capacity_scaling_recommendations`,
  library_offline_operations: `${CANONICAL_OWNER_ROUTE}?view=library_offline_operations`,
  library_shift_gap_analysis: `${CANONICAL_OWNER_ROUTE}?view=library_shift_gap_analysis`,
  library_waitlist_automation: `${CANONICAL_OWNER_ROUTE}?view=library_waitlist_automation`,
} as const;

export const SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES = {
  SUPERADMIN_LIBRARIES_URLS: SUPERADMIN_LIBRARIES_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS,
} as const;

export const SUPERADMIN_LIBRARIES_OVERVIEW_API = {} as const;
