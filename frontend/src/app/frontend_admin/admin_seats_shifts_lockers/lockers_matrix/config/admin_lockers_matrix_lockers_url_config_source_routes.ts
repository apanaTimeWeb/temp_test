import { ADMIN_LOCKERS_ROOT } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/applicationInfrastructureAdminRouteConstants';
export { ADMIN_LOCKERS_ROOT };
/** Canonical route and observed API URL contract for locker management. */
const adminLockersRoute = (view: string): string => { const routes: Record<string, string> = {
    "lockers": "/admin/admin_seats_shifts_lockers/lockers_management",
    "matrix": "/admin/admin_seats_shifts_lockers/lockers_matrix"
  }; return routes[view] ?? "/admin/admin_seats_shifts_lockers/seats_matrix"; };
export const ADMIN_LOCKERS_ROUTE_LOCKERS = adminLockersRoute('lockers');
export const ADMIN_LOCKERS_ROUTE_MATRIX = adminLockersRoute('matrix');
export const ADMIN_LOCKERS_API_LOCKERS = '/seats_shifts_lockers/lockers' as const;
export const ADMIN_LOCKERS_API_SEAT_MATRIX = '/seats_shifts_lockers/seat-matrix' as const;
export const ADMIN_LOCKERS_URLS = {
  ROOT: ADMIN_LOCKERS_ROOT,
  ROUTE_LOCKERS: ADMIN_LOCKERS_ROUTE_LOCKERS,
  ROUTE_MATRIX: ADMIN_LOCKERS_ROUTE_MATRIX,
  LOCKERS: ADMIN_LOCKERS_API_LOCKERS,
  SEAT_MATRIX: ADMIN_LOCKERS_API_SEAT_MATRIX,
} as const;
export const MODULE_URLS = ADMIN_LOCKERS_URLS;
