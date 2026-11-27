// RESPONSIBILITY: Define canonical route/configuration constants for dashboard overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Page navigation paths used by the Superadmin dashboard; no API contract was supplied. */
const SUPERADMIN_DASHBOARD_URLS = {
  PAGE: '/superadmin/superadmin_dashboard',
  AUDIT_LOGS: '/superadmin/superadmin_system/system_audit_logs',
  LIBRARIES: '/superadmin/superadmin_libraries/libraries_overview',
  LIBRARIES_ONBOARDING: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  BRANCHES: '/superadmin/superadmin_branches/branches_overview',
  USERS: '/superadmin/superadmin_users/users_roles_permissions',
  PLANS: '/superadmin/superadmin_plans/plans_pricing_catalog',
  SUBSCRIPTIONS: '/superadmin/superadmin_subscriptions/subscriptions_overview',
  BILLING: '/superadmin/superadmin_billing/billing_invoices',
  FEATURES: '/superadmin/superadmin_features/features_overview',
  USAGE: '/superadmin/superadmin_usage/usage_overview',
  SECURITY: '/superadmin/superadmin_security/security_overview',
  REPORTS: '/superadmin/superadmin_analytics/analytics_platform_reports',
  SUPPORT_TICKETS: '/superadmin/superadmin_support/support_tickets',
  NOTIFICATIONS: '/superadmin/superadmin_communication/communication_notification_center',
  INTEGRATIONS: '/superadmin/superadmin_integrations/integrations_overview',
  DATA: '/superadmin/superadmin_data/data_overview',
  SYSTEM_HEALTH: '/superadmin/superadmin_system/system_health_overview',
  SETTINGS: '/superadmin/superadmin_settings/settings_general',
} as const;

/** Required typed grouping alias consumed by the module. */
const MODULE_URLS = SUPERADMIN_DASHBOARD_URLS;
/**
 * Defines the public ModuleUrls contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

const SUPERADMIN_DASHBOARD_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_dashboard/dashboard_overview",
  SCREEN: "/superadmin/superadmin_dashboard/dashboard_overview",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES = {
  SUPERADMIN_DASHBOARD_URLS: SUPERADMIN_DASHBOARD_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_DASHBOARD_OVERVIEW_URLS: SUPERADMIN_DASHBOARD_OVERVIEW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_DASHBOARD_OVERVIEW_API = {} as const;
