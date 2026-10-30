/**
 * Canonical UI/API contract for admin_lockers_matrix.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_LOCKERS_MATRIX_ROUTES = {
  ROOT: '/admin/admin_seats_shifts_lockers/lockers_matrix',
} as const;

export const ADMIN_LOCKERS_MATRIX_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_LOCKERS_MATRIX_CANONICAL_ROUTE = ADMIN_LOCKERS_MATRIX_ROUTES.ROOT;
