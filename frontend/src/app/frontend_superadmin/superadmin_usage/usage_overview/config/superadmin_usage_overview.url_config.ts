// config/superadmin_usage_overview.url_config.ts
// Owned by: superadmin/superadmin_usage/usage_overview autonomous sub-module

export const SUPERADMIN_USAGE_OVERVIEW_ROUTES = {
  /** Root usage overview page */
  root: '/superadmin/superadmin_usage/usage_overview' as const,
  /** Deep link with library pre-selected */
  libraryDetail: (libraryId: string) => `/superadmin/superadmin_usage/usage_overview?libraryId=${libraryId}` as const,
  /** Filtered by resource category */
  byCategory: (category: string) => `/superadmin/superadmin_usage/usage_overview?category=${category}` as const,
  /** Navigate to Quota Upgrade Requests */
  quotaRequests: '/superadmin/superadmin_usage/usage_quota_requests' as const,
} as const;

export const SUPERADMIN_USAGE_OVERVIEW_API = {
  /** GET /api/v1/superadmin/usage/overview — all libraries 12-resource usage list */
  list: '/api/v1/superadmin/usage/overview' as const,
  /** GET /api/v1/superadmin/usage/summary — system aggregate totals */
  summary: '/api/v1/superadmin/usage/summary' as const,
  /** GET /api/v1/superadmin/usage/libraries/:id — single library full 12-resource metrics */
  detail: (libraryId: string) => `/api/v1/superadmin/usage/libraries/${libraryId}` as const,
} as const;
