/** Canonical route and API URL registry for admin_communication_notices. */
export const ADMIN_COMMUNICATION_ROOT = "/admin/admin_communication" as const;
export const ADMIN_COMMUNICATION_ROUTE_NOTICES = "/admin/admin_communication/communication_notices" as const;
export const ADMIN_COMMUNICATION_API_NOTICES = "/communication/notices" as const;

export const ADMIN_COMMUNICATION_URLS = {
  ROOT: ADMIN_COMMUNICATION_ROOT,
  NOTICES: ADMIN_COMMUNICATION_API_NOTICES,
  ROUTE_NOTICES: ADMIN_COMMUNICATION_ROUTE_NOTICES,
} as const;

export const MODULE_URLS = ADMIN_COMMUNICATION_URLS;
