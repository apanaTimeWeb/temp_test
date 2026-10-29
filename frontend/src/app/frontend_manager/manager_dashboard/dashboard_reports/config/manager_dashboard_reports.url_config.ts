/** Canonical route and API contracts for manager dashboard reports. */
const ROOT = '/frontend_manager/manager_dashboard/dashboard_reports' as const;

export const MANAGER_DASHBOARD_REPORTS_ROUTES = {
  root: ROOT,
  REPORTS: ROOT,
} as const;

/** No authoritative reports API endpoint was supplied; callers must fail closed. */
export const MANAGER_DASHBOARD_REPORTS_API = {
  REPORTS: null,
} as const;
