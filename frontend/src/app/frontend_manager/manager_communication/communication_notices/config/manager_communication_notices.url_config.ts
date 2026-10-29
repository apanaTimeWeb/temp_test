/** Canonical route/API contract for manager communication notices. */
const ROOT = '/frontend_manager/manager_communication/communication_notices' as const;

export const MANAGER_COMMUNICATION_NOTICES_ROUTES = {
  root: ROOT,
  LIST: ROOT,
} as const;

/** Existing source-backed relative endpoint; no write endpoint is declared here. */
export const MANAGER_COMMUNICATION_NOTICES_API = {
  LIST: '/communication/notices',
} as const;

export const MANAGER_COMMUNICATION_NOTICES_URL = MANAGER_COMMUNICATION_NOTICES_API.LIST;
