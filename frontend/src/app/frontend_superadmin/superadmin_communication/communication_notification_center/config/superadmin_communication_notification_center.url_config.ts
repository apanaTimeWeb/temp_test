// RESPONSIBILITY: Define canonical route/configuration constants for communication notification center; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_communication/communication_notification_center/config/superadmin_communication_notification_center.url_config.ts -> typed constants -> owning route or API caller.
/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Existing API endpoint paths and public page routes observed in the supplied frontend source. */
const SUPERADMIN_COMMUNICATION_URLS = {
  PAGE: '/superadmin/superadmin_communication',
  // API endpoints — preserve the existing backend contract.

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
} as const;

const MODULE_URLS = SUPERADMIN_COMMUNICATION_URLS;
/**
 * Defines the public ModuleUrls contract for communication notification center. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for communication_notification_center; screens share this isolated feature module. */
const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS = {
  PAGE: "/superadmin/superadmin_communication/communication_notification_center",
  SCREEN: "/superadmin/superadmin_communication/communication_notification_center",
  SCREENS: {
    "communication_notification_center": "/superadmin/superadmin_communication/communication_notification_center",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;




/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES = {
  SUPERADMIN_COMMUNICATION_URLS: SUPERADMIN_COMMUNICATION_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS
} as const;

/** No API client contract is supplied for this notification-center view; endpoint paths remain owned by notices/complaints leaves. */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API = {} as const;
