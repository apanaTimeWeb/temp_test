// config/superadmin_usage_quota_requests.url_config.ts
export const SUPERADMIN_USAGE_QUOTA_REQUESTS_ROUTES = {
  root: '/superadmin/superadmin_usage/usage_quota_requests',
  overview: '/superadmin/superadmin_usage/usage_overview',
  plans: '/superadmin/superadmin_plans/plans_pricing_catalog',
} as const;

export const SUPERADMIN_USAGE_QUOTA_REQUESTS_API = {
  list: '/api/v1/superadmin/usage/quota-requests',
  kpis: '/api/v1/superadmin/usage/quota-requests/kpis',
  approve: (id: string) => `/api/v1/superadmin/usage/quota-requests/${id}/approve`,
  reject: (id: string) => `/api/v1/superadmin/usage/quota-requests/${id}/reject`,
} as const;
