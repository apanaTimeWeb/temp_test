/**
 * Canonical UI/API contract for admin_communication_notices.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_COMMUNICATION_ROOT = '/admin/admin_communication' as const;
export const ADMIN_COMMUNICATION_ROUTE_NOTICES = '/admin/admin_communication/communication_notices' as const;
export const ADMIN_COMMUNICATION_API_NOTICES = '/communication/notices' as const;

export const ADMIN_COMMUNICATION_URLS = {
  ROOT: ADMIN_COMMUNICATION_ROOT,
  NOTICES: ADMIN_COMMUNICATION_API_NOTICES,
  ROUTE_NOTICES: ADMIN_COMMUNICATION_ROUTE_NOTICES,
} as const;

export const ADMIN_COMMUNICATION_NOTICES_ROUTES = {
  ROOT: '/admin/admin_communication/communication_notices',
} as const;

export const ADMIN_COMMUNICATION_NOTICES_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_COMMUNICATION_NOTICES_CANONICAL_ROUTE = '/admin/admin_communication/communication_notices' as const;
