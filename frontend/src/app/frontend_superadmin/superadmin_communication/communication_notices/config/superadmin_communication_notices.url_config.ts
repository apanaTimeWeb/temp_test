// RESPONSIBILITY: Define canonical route/configuration constants for communication notices; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_communication/communication_notices/config/superadmin_communication_notices.url_config.ts -> typed constants -> owning route or API caller.
const omitApiRouteProperties = <T extends object, K extends keyof T>(source: T, keys: readonly K[]): Omit<T, K> => {
  const result: Partial<T> = { ...source };
  for (const key of keys) delete result[key];
  return result as Omit<T, K>;
};

const SUPERADMIN_COMMUNICATION_NOTICES_URLS = {
  PAGE: '/superadmin/superadmin_communication/communication_notices',
  SCREEN: '/superadmin/superadmin_communication/communication_notices',
  SCREENS: { communication_notices: '/superadmin/superadmin_communication/communication_notices' },
  // API endpoints — preserve the existing backend contract.
  NOTICES_LIST: '/communication/notices',

  // Existing public page routes.
  COMPLAINTS_PAGE: '/superadmin/superadmin_support/support_complaints',
  NOTICES_PAGE: '/superadmin/superadmin_communication/communication_notices',
  NOTIFICATION_CENTER_PAGE: '/superadmin/superadmin_communication/communication_notification_center',
  WHATSAPP_LOGS_PAGE: '/superadmin/superadmin_communication/communication_whatsapp_logs',
  WHATSAPP_TEMPLATES_PAGE: '/superadmin/superadmin_communication/communication_whatsapp_templates',

  // Existing cross-module public page routes.
  FINANCE_RENEWALS_PAGE: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals',
  PAYMENT_PROMISES_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
  ASSET_MAINTENANCE_PAGE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
  LATE_FEES_PAGE: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const MODULE_URLS = SUPERADMIN_COMMUNICATION_NOTICES_URLS;
/**
 * Defines the public ModuleUrls contract for communication notices. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;



const MODULE_URLS_ROUTES_ONLY = omitApiRouteProperties(MODULE_URLS, ['NOTICES_LIST'] as const);

const SUPERADMIN_COMMUNICATION_NOTICES_URLS_ROUTES_ONLY = omitApiRouteProperties(SUPERADMIN_COMMUNICATION_NOTICES_URLS, ['NOTICES_LIST'] as const);
/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_COMMUNICATION_NOTICES_ROUTES = {
  SUPERADMIN_COMMUNICATION_NOTICES_URLS: SUPERADMIN_COMMUNICATION_NOTICES_URLS_ROUTES_ONLY,
  MODULE_URLS: MODULE_URLS_ROUTES_ONLY
} as const;

/** Verified API endpoint constants are kept separate from navigation routes. */
export const SUPERADMIN_COMMUNICATION_NOTICES_API = {
  NOTICES_LIST: MODULE_URLS.NOTICES_LIST
} as const;
