/** Canonical route/API contract for manager communication complaints. */
const ROOT = '/frontend_manager/manager_communication/communication_complaints' as const;

export const MANAGER_COMMUNICATION_COMPLAINTS_ROUTES = {
  root: ROOT,
  LIST: ROOT,
} as const;

/** Existing source-backed relative endpoint; no write endpoint is declared here. */
export const MANAGER_COMMUNICATION_COMPLAINTS_API = {
  LIST: '/communication/complaints',
} as const;
