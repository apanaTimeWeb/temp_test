import { ADMIN_SHIFTS_ROOT } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/applicationInfrastructureAdminRouteConstants';
export { ADMIN_SHIFTS_ROOT };

/** Canonical route contract for shift management. */
export const ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT = '/admin/admin_seats_shifts_lockers/shifts_management' as const;
export const ADMIN_SHIFTS_URLS = { ROOT: ADMIN_SHIFTS_ROOT, SHIFT_MANAGEMENT: ADMIN_SHIFTS_ROUTE_SHIFT_MANAGEMENT } as const;
