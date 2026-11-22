/**
 * Canonical UI/API contract for admin_shifts_gap.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SHIFTS_GAP_ROUTES = {
  ROOT: '/admin/admin_seats_shifts_lockers/shifts_gap',
} as const;

export const ADMIN_SHIFTS_GAP_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SHIFTS_GAP_CANONICAL_ROUTE = ADMIN_SHIFTS_GAP_ROUTES.ROOT;
