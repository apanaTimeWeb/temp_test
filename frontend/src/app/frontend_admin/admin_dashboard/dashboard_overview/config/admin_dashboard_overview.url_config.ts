import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Canonical UI route contract for admin_dashboard/dashboard_overview. */
export const ADMIN_DASHBOARD_OVERVIEW_ROUTES = {
  ROOT: '/admin/admin_dashboard/dashboard_overview',
  MEMBERS_DIRECTORY: ADMIN_ROUTES.MEMBERS_DIRECTORY,
  SEATS_MATRIX: ADMIN_ROUTES.SEATS_MATRIX,
  FINANCE_DASHBOARD: ADMIN_ROUTES.FINANCE_DASHBOARD,
} as const;

/** No dashboard-overview-specific API operations are verified by supplied source contracts. */
export const ADMIN_DASHBOARD_OVERVIEW_API = {
  CONTRACT_MISSING: null as string | null,
} as const;

export const ADMIN_DASHBOARD_OVERVIEW_URL_CONFIG = {
  route: '/admin/admin_dashboard/dashboard_overview',
  routes: {
    ROOT: '/admin/admin_dashboard/dashboard_overview',
  },
  api: {},
} as const;

/** Direct canonical UI route; legacy source URL aliases are intentionally retired. */
export const ADMIN_DASHBOARD_OVERVIEW_CANONICAL_ROUTE = '/admin/admin_dashboard/dashboard_overview' as const;
