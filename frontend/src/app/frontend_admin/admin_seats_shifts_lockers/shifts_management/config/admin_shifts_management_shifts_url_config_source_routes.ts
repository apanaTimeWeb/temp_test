import { ADMIN_SHIFTS_ROOT } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/applicationInfrastructureAdminRouteConstants';
export { ADMIN_SHIFTS_ROOT };
/** Canonical route contract for shift management and its related views. */
const adminShiftsRoute = (view: string): string => { const routes: Record<string, string> = {
    "gap": "/admin/admin_seats_shifts_lockers/shifts_gap",
    "migration": "/admin/admin_seats_shifts_lockers/shifts_migration",
    "shift_management": "/admin/admin_seats_shifts_lockers/shifts_management"
  }; return routes[view] ?? "/admin/admin_seats_shifts_lockers/seats_matrix"; };
export const ADMIN_SHIFTS_ROUTE_GAP = adminShiftsRoute('gap');
export const ADMIN_SHIFTS_ROUTE_MIGRATION = adminShiftsRoute('migration');
/** Preserves the independently refreshable shift-management capability URL. */
export const ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT = adminShiftsRoute('shift_management');
export const ADMIN_SHIFTS_URLS = { ROOT: ADMIN_SHIFTS_ROOT, GAP: ADMIN_SHIFTS_ROUTE_GAP, MIGRATION: ADMIN_SHIFTS_ROUTE_MIGRATION, SHIFT_MANAGEMENT: ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT } as const;
export const MODULE_URLS = ADMIN_SHIFTS_URLS;
