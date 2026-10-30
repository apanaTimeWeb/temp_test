/**
 * Canonical UI/API contract for admin_system_maintenance.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SYSTEM_MAINTENANCE_ROUTES = {
  ROOT: '/admin/admin_system/system_maintenance',
} as const;

export const ADMIN_SYSTEM_MAINTENANCE_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/system',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SYSTEM_MAINTENANCE_CANONICAL_ROUTE = ADMIN_SYSTEM_MAINTENANCE_ROUTES.ROOT;
