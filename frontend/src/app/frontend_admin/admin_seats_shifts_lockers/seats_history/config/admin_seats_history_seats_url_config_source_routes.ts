import { ADMIN_SEATS_ROOT } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/applicationInfrastructureAdminRouteConstants';
export { ADMIN_SEATS_ROOT };
/** Canonical route contract for seat management and its related views. */
const adminSeatsRoute = (view: string): string => { const routes: Record<string, string> = {
    "history": "/admin/admin_seats_shifts_lockers/seats_history",
    "maintenance": "/admin/admin_seats_shifts_lockers/seats_maintenance",
    "seat_management": "/admin/admin_seats_shifts_lockers/seats_management"
  }; return routes[view] ?? "/admin/admin_seats_shifts_lockers/seats_matrix"; };
export const ADMIN_SEATS_ROUTE_HISTORY = adminSeatsRoute('history');
export const ADMIN_SEATS_ROUTE_MAINTENANCE = adminSeatsRoute('maintenance');
/** Preserves the independently refreshable seat-management capability URL. */
export const ADMIN_SEATS_ROUTE_SEAT_MANAGEMENT = adminSeatsRoute('seat_management');
export const ADMIN_SEATS_URLS = { ROOT: ADMIN_SEATS_ROOT, HISTORY: ADMIN_SEATS_ROUTE_HISTORY, MAINTENANCE: ADMIN_SEATS_ROUTE_MAINTENANCE, SEAT_MANAGEMENT: ADMIN_SEATS_ROUTE_SEAT_MANAGEMENT } as const;
export const MODULE_URLS = ADMIN_SEATS_URLS;
