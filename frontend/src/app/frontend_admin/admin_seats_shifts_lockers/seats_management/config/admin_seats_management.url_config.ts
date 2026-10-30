/**
 * Canonical UI/API contract for admin_seats_management.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SEATS_MANAGEMENT_ROUTES = {
  ROOT: '/admin/admin_seats_shifts_lockers/seats_management',
} as const;

export const ADMIN_SEATS_MANAGEMENT_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SEATS_MANAGEMENT_CANONICAL_ROUTE = ADMIN_SEATS_MANAGEMENT_ROUTES.ROOT;
