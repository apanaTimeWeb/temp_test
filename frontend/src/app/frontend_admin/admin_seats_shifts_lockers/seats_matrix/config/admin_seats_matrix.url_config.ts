import { ADMIN_SEAT_MATRIX_ROOT as HOST_ADMIN_SEAT_MATRIX_ROOT } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/applicationInfrastructureAdminRouteConstants';

/** Canonical route and API contract for admin_seats_matrix; API entries are source-observed only. */
export const ADMIN_SEATS_MATRIX_ROUTES = {
  ROOT: "/admin/admin_seats_shifts_lockers/seats_matrix",
} as const;

export const ADMIN_SEATS_MATRIX_API = {
  // No verified API endpoint was supplied; do not infer one.
  CONTRACT_MISSING: null as string | null,
} as const;

/** Backward-compatible route constant for existing consumers. */
export const ADMIN_SEATS_MATRIX_CANONICAL_ROUTE = '/admin/admin_seats_shifts_lockers/seats_matrix' as const;


export const ADMIN_SEAT_MATRIX_ROOT = HOST_ADMIN_SEAT_MATRIX_ROOT;
export const ADMIN_SEAT_MATRIX_API_SEAT_MATRIX = '/seats_shifts_lockers/seat-matrix' as const;
export const ADMIN_SEAT_MATRIX_URLS = { ROOT: ADMIN_SEAT_MATRIX_ROOT, SEAT_MATRIX: ADMIN_SEAT_MATRIX_API_SEAT_MATRIX } as const;

export const ADMIN_SEAT_MATRIX_STATUS = {
  FREE: "free",
  OCCUPIED: "occupied",
  EXPIRING: "expiring",
  MAINTENANCE: "maintenance",
} as const;

export const ADMIN_SEAT_MATRIX_SHIFTS = ["All", "Morning", "Afternoon", "Evening", "Night", "Full Day"] as const;
export const ADMIN_SEAT_MATRIX_SEAT_STATUS_BADGE_CLASS = {
  Working: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  Broken: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export type AdminSeatMatrixSeatStatus =
  keyof typeof ADMIN_SEAT_MATRIX_SEAT_STATUS_BADGE_CLASS;
