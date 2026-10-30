/**
 * Canonical UI/API contract for admin_shifts_migration.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SHIFTS_MIGRATION_ROUTES = {
  ROOT: '/admin/admin_seats_shifts_lockers/shifts_migration',
} as const;

export const ADMIN_SHIFTS_MIGRATION_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SHIFTS_MIGRATION_CANONICAL_ROUTE = ADMIN_SHIFTS_MIGRATION_ROUTES.ROOT;
