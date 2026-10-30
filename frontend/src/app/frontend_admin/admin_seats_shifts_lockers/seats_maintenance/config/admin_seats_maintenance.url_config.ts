/**
 * Canonical UI/API contract for admin_seats_maintenance.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SEATS_MAINTENANCE_ROUTES = {
  ROOT: '/admin/admin_seats_shifts_lockers/seats_maintenance',
} as const;

export const ADMIN_SEATS_MAINTENANCE_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SEATS_MAINTENANCE_CANONICAL_ROUTE = ADMIN_SEATS_MAINTENANCE_ROUTES.ROOT;
