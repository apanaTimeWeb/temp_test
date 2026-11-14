// RESPONSIBILITY: Define canonical route/configuration constants for support complaints; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_support/support_complaints/config/superadmin_support_complaints.url_config.ts -> typed constants -> owning route or API caller.
/** Canonical public route and observed API endpoint for the support complaints leaf. */
const omitApiRouteProperties = <T extends object, K extends keyof T>(source: T, keys: readonly K[]): Omit<T, K> => {
  const result: Partial<T> = { ...source };
  for (const key of keys) delete result[key];
  return result as Omit<T, K>;
};

const SUPERADMIN_SUPPORT_COMPLAINTS_URLS = {
  PAGE: '/superadmin/superadmin_support/support_complaints',
  SCREEN: '/superadmin/superadmin_support/support_complaints',
  SCREENS: { support_complaints: '/superadmin/superadmin_support/support_complaints' },
  COMPLAINTS_LIST: '/communication/complaints',
  COMMUNICATION_NOTICES_PAGE: '/superadmin/superadmin_communication/communication_notices',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;
const MODULE_URLS = SUPERADMIN_SUPPORT_COMPLAINTS_URLS;
/**
 * Defines the public ModuleUrls contract for support complaints. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;



const MODULE_URLS_ROUTES_ONLY = omitApiRouteProperties(MODULE_URLS, ['COMPLAINTS_LIST'] as const);

const SUPERADMIN_SUPPORT_COMPLAINTS_URLS_ROUTES_ONLY = omitApiRouteProperties(SUPERADMIN_SUPPORT_COMPLAINTS_URLS, ['COMPLAINTS_LIST'] as const);
/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SUPPORT_COMPLAINTS_ROUTES = {
  SUPERADMIN_SUPPORT_COMPLAINTS_URLS: SUPERADMIN_SUPPORT_COMPLAINTS_URLS_ROUTES_ONLY,
  MODULE_URLS: MODULE_URLS_ROUTES_ONLY
} as const;

/** Verified API endpoint constants are kept separate from navigation routes. */
export const SUPERADMIN_SUPPORT_COMPLAINTS_API = {
  COMPLAINTS_LIST: MODULE_URLS.COMPLAINTS_LIST
} as const;
