// RESPONSIBILITY: Centralized URL and endpoint definitions for Superadmin Branch Management.
export const SUPERADMIN_BRANCHES_OVERVIEW_URLS = {
  BRANCHES_LIST: '/superadmin/superadmin_branches/branches_overview',
  BRANCH_CREATE: '/superadmin/superadmin_branches/branches_overview?action=create',
  BRANCH_LIFECYCLE: '/superadmin/superadmin_branches/branches_overview?tab=lifecycle',
  LIBRARIES_OVERVIEW: '/superadmin/superadmin_libraries/libraries_overview',
  DASHBOARD: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;
