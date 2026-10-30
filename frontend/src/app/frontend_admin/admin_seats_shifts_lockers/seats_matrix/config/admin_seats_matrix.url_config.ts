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
export const ADMIN_SEAT_MATRIX_API_LOCKERS = '/seats_shifts_lockers/lockers' as const;
export const ADMIN_SEAT_MATRIX_API_SEAT_MATRIX = '/seats_shifts_lockers/seat-matrix' as const;
export const ADMIN_SEAT_MATRIX_URLS = { ROOT: ADMIN_SEAT_MATRIX_ROOT, LOCKERS: ADMIN_SEAT_MATRIX_API_LOCKERS, SEAT_MATRIX: ADMIN_SEAT_MATRIX_API_SEAT_MATRIX } as const;
export const MODULE_URLS = ADMIN_SEAT_MATRIX_URLS;

export const ADMIN_SEAT_MATRIX_STATUS = {
  FREE: "free",
  OCCUPIED: "occupied",
  EXPIRING: "expiring",
  MAINTENANCE: "maintenance",
} as const;

export const ADMIN_SEAT_MATRIX_SHIFTS = ["All", "Morning", "Evening", "Full Day"] as const;
export const ADMIN_SEAT_MATRIX_SEAT_STATUS_BADGE_CLASS = {
  Working: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  Broken: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export type AdminSeatMatrixSeatStatus =
  keyof typeof ADMIN_SEAT_MATRIX_SEAT_STATUS_BADGE_CLASS;

export const ADMIN_SEAT_MATRIX_LOCKER_STATUS_BADGE_CLASS = {
  Free: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Occupied: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  Maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEAT_MATRIX_ALLOCATION_STATUS_BADGE_CLASS = {
  Active: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Expired: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  Suspended: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEAT_MATRIX_ALLOCATION_FEE_STATUS_BADGE_CLASS = {
  Paid: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  Due: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
} as const;

export const ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS = {
  Morning: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-primary bg-primary-subtle text-primary',
  Evening: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  'Full Day': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-info-text bg-info-bg text-info-text',
} as const;

export const ADMIN_SEAT_MATRIX_SEAT_HISTORY_REASON_BADGE_CLASS = {
  Admission: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  'Shift Change': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-info-text bg-info-bg text-info-text',
  'Seat Change': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
} as const;

export const ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS = {
  free: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-success-text bg-success-bg text-success-text',
  occupied: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-danger-text bg-danger-bg text-danger-text',
  expiring: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  maintenance: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text',
  unknown: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary',
} as const;


/** Canonical status options used by form controls and filters; labels resolve through the feature locale catalog. */
export const ADMIN_SEAT_MATRIX_SEAT_MANAGEMENT_STATUS_OPTIONS = [
  { value: 'Working', labelKey: 'working' },
  { value: 'Maintenance', labelKey: 'statusMaintenance' },
  { value: 'Broken', labelKey: 'broken' },
] as const;

export const ADMIN_SEAT_MATRIX_LOCKER_STATUS_OPTIONS = [
  { value: 'Free', labelKey: 'statusFree' },
  { value: 'Occupied', labelKey: 'statusOccupied' },
  { value: 'Maintenance', labelKey: 'statusMaintenance' },
] as const;

export const ADMIN_SEAT_MATRIX_ALLOCATION_STATUS_OPTIONS = [
  { value: 'Active', labelKey: 'active' },
  { value: 'Expired', labelKey: 'expired' },
  { value: 'Suspended', labelKey: 'suspended' },
] as const;
