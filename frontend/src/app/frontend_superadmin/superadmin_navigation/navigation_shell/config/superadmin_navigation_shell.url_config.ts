// RESPONSIBILITY: Define canonical route/configuration constants for navigation shell; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config.ts -> typed constants -> owning route or API caller.
/** Navigation infrastructure routes only. Feature destinations are duplicated locally in the navigation registry under Strict WET; no sibling feature imports are used. */
const SUPERADMIN_NAVIGATION_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;
/**
 * Defines the public SuperadminNavigationUrls contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type SuperadminNavigationUrls = typeof SUPERADMIN_NAVIGATION_URLS;

/** Shared navigation shell is infrastructure, not a standalone route destination. */
const SUPERADMIN_NAVIGATION_SHELL_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;


/** Domain route maps migrated out of domain roots; business API endpoints remain owned by individual leaf submodules. */

/** Migrated route map from former domain-root config superadmin_accounting.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_ACCOUNTING_URLS = {
  PAGE: '/superadmin/superadmin_accounting',
  DAILY_SETTLEMENT: '/superadmin/superadmin_accounting/accounting_daily_settlement',
  EXPENSE_CATEGORIES: '/superadmin/superadmin_accounting/accounting_expense_categories',
  EXPENSES: '/superadmin/superadmin_accounting/accounting_expenses',
  EXPENSES_ADD: '/superadmin/superadmin_accounting/accounting_expenses?view=create',
  FINANCIAL_REPORTS: '/superadmin/superadmin_accounting/accounting_financial_reports',
} as const;


/** Migrated route map from former domain-root config superadmin_analytics.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_ANALYTICS_URLS = {
  PAGE: '/superadmin/superadmin_analytics',
  FINANCIALS: '/superadmin/superadmin_analytics/analytics_financials',
  LIBRARY_GROWTH: '/superadmin/superadmin_analytics/analytics_library_growth',
  OVERVIEW: '/superadmin/superadmin_analytics/analytics_overview',
  SUBSCRIPTION_MIX: '/superadmin/superadmin_analytics/analytics_subscription_mix',
} as const;


/** Migrated route map from former domain-root config superadmin_audit.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_AUDIT_URLS = {
  PAGE: '/superadmin/superadmin_system',
  LOGS: '/superadmin/superadmin_system/audit_logs',
} as const;


/** Migrated route map from former domain-root config superadmin_backup.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_BACKUP_URLS = {
  PAGE: '/superadmin/superadmin_system',
  CONFIGURATION: '/superadmin/superadmin_system/backup_configuration',
  CREATE_FLOW: '/superadmin/superadmin_system/backup_overview?view=create',
  HISTORY: '/superadmin/superadmin_system/backup_history',
  OVERVIEW: '/superadmin/superadmin_system/backup_overview',
  RESTORE_FLOW: '/superadmin/superadmin_system/backup_history?view=restore',
  SCHEDULES: '/superadmin/superadmin_system/backup_schedules',
} as const;


/** Migrated route map from former domain-root config superadmin_billing.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_BILLING_URLS = {
  PAGE: '/superadmin/superadmin_billing',
  INVOICES: '/superadmin/superadmin_billing/billing_invoices',
  OVERVIEW: '/superadmin/superadmin_billing/billing_overview',
} as const;


/** Migrated route map from former domain-root config superadmin_communication.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_COMMUNICATION_URLS = {
  PAGE: '/superadmin/superadmin_communication',
  NOTICES: '/superadmin/superadmin_communication/communication_notices',
  NOTIFICATION_CENTER: '/superadmin/superadmin_communication/communication_notification_center',
  WHATSAPP_INTEGRATION: '/superadmin/superadmin_communication/communication_whatsapp_integration',
  WHATSAPP_LOGS: '/superadmin/superadmin_communication/communication_whatsapp_logs',
  WHATSAPP_TEMPLATES: '/superadmin/superadmin_communication/communication_whatsapp_templates',
} as const;


/** Migrated route map from former domain-root config superadmin_dashboard.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_DASHBOARD_URLS = {
  PAGE: '/superadmin/superadmin_dashboard',
  OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Migrated route map from former domain-root config superadmin_data_management.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_DATA_MANAGEMENT_URLS = {
  PAGE: '/superadmin/superadmin_system',
  DATA_EXPORT_JOBS: '/superadmin/superadmin_system/data_export_jobs',
} as const;


/** Migrated route map from former domain-root config superadmin_asset_registry_and_maintenance.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_FACILITIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  FACILITY_ASSET_MAINTENANCE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
  FACILITY_ASSET_REGISTRY: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry',
  FACILITY_MAINTENANCE_WORK_ORDERS: '/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders',
  FACILITY_POWER_MANAGEMENT: '/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management',
} as const;


/** Migrated route map from former domain-root config superadmin_libraries.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_LIBRARIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  ONBOARDING_SETUP: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  OVERVIEW: '/superadmin/superadmin_libraries/libraries_overview',
  PROFILE_CONFIGURATION: '/superadmin/superadmin_libraries/libraries_profile_configuration',
} as const;


/** Migrated route map from former domain-root config superadmin_library_capacity_and_availability.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_LIBRARY_OPERATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  LIBRARY_CAPACITY_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis',
  LIBRARY_CAPACITY_GAP_FILLING: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling',
  LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations',
  LIBRARY_OFFLINE_OPERATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations',
  LIBRARY_SHIFT_GAP_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis',
  LIBRARY_WAITLIST_AUTOMATION: '/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation',
} as const;


/** Migrated route map from former domain-root config superadmin_member_finance.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_MEMBER_FINANCE_URLS = {
  PAGE: '/superadmin/superadmin_billing',
  MEMBER_AUTO_SUSPEND_POLICY: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_auto_suspend_policy',
  OVERVIEW: '/superadmin/superadmin_billing/billing_overview?view=member_finance_overview',
  MEMBER_INVOICE_DETAIL: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices_detail',
  MEMBER_INVOICES: '/superadmin/superadmin_billing/billing_invoices?view=member_invoices',
  MEMBER_LATE_FEES: '/superadmin/superadmin_billing/billing_overview?view=member_late_fees',
  MEMBER_PAYMENT_PROMISES: '/superadmin/superadmin_billing/billing_overview?view=member_payment_promises',
  MEMBER_PAYMENTS: '/superadmin/superadmin_billing/billing_overview?view=member_payments',
  MEMBER_PAYMENTS_COLLECTION: '/superadmin/superadmin_billing/billing_overview?view=member_payments_collection',
  MEMBER_RECEIPT_DETAIL: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts_detail',
  MEMBER_RECEIPTS: '/superadmin/superadmin_billing/billing_invoices?view=member_receipts',
  MEMBER_REFERRALS: '/superadmin/superadmin_users/users_overview?view=member_referrals',
  MEMBER_REFUNDS: '/superadmin/superadmin_billing/billing_overview?view=member_refunds',
  MEMBER_RENEWALS: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals',
  MEMBER_SECURITY_DEPOSITS: '/superadmin/superadmin_billing/billing_overview?view=member_security_deposits',
  MEMBER_SUBSCRIPTIONS: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions',
  MEMBER_TRUST_SCORE: '/superadmin/superadmin_users/users_overview?view=member_trust_score',
} as const;


/** Migrated route map from former domain-root config superadmin_plans.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_PLANS_URLS = {
  PAGE: '/superadmin/superadmin_plans',
  PRICING_CATALOG: '/superadmin/superadmin_plans/plans_pricing_catalog',
  PROMOTIONS: '/superadmin/superadmin_plans/plans_promotions',
} as const;


/** Migrated route map from former domain-root config superadmin_profile.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_PROFILE_URLS = {
  PAGE: '/superadmin/superadmin_settings',
  ACTIVE_SESSIONS: '/superadmin/superadmin_settings/profile_active_sessions',
  LOGIN_HISTORY: '/superadmin/superadmin_settings/profile_login_history',
  OVERVIEW: '/superadmin/superadmin_settings/profile_overview',
  OVERVIEW_DETAILS: '/superadmin/superadmin_settings/profile_overview?view=details',
  OVERVIEW_EDIT: '/superadmin/superadmin_settings/profile_overview?view=edit',
  SECURITY: '/superadmin/superadmin_settings/profile_security',
  SECURITY_CHANGE_PASSWORD: '/superadmin/superadmin_settings/profile_security?view=change-password',
  SECURITY_TWO_FACTOR: '/superadmin/superadmin_settings/profile_security?view=two-factor',
} as const;


/** Migrated route map from former domain-root config superadmin_security.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_SECURITY_URLS = {
  PAGE: '/superadmin/superadmin_security',
  ACTIVE_SESSIONS: '/superadmin/superadmin_security/security_active_sessions',
  API_KEYS: '/superadmin/superadmin_security/security_api_keys',
  IP_FIREWALL: '/superadmin/superadmin_security/security_ip_firewall',
  LOGIN_SECURITY: '/superadmin/superadmin_security/security_login_security',
  MFA: '/superadmin/superadmin_security/security_mfa',
  OVERVIEW: '/superadmin/superadmin_security/security_overview',
  PASSWORD_POLICY: '/superadmin/superadmin_security/security_password_policy',
  THREATS: '/superadmin/superadmin_security/security_threats',
  USER_SESSIONS: '/superadmin/superadmin_security/security_user_sessions',
} as const;


/** Migrated route map from former domain-root config superadmin_settings.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_SETTINGS_URLS = {
  PAGE: '/superadmin/superadmin_settings',
  APPEARANCE: '/superadmin/superadmin_settings/settings_appearance',
  BRANDING: '/superadmin/superadmin_settings/settings_branding',
  GENERAL: '/superadmin/superadmin_settings/settings_general',
  INTEGRATIONS: '/superadmin/superadmin_settings/settings_integrations',
  LIBRARY_CONFIGURATION: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
  MAINTENANCE_MODE: '/superadmin/superadmin_settings/settings_maintenance_mode',
  OVERVIEW: '/superadmin/superadmin_settings/settings_overview',
  STORAGE: '/superadmin/superadmin_settings/settings_storage',
} as const;


/** Migrated route map from former domain-root config superadmin_student_onboarding_and_identity.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_STUDENT_OPERATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  STUDENT_BULK_IMPORT: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import',
  STUDENT_SMART_ID: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id',
} as const;


/** Migrated route map from former domain-root config superadmin_subscriptions.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_SUBSCRIPTIONS_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions',
  ACTIVE_SUBSCRIBERS: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
  OVERVIEW: '/superadmin/superadmin_subscriptions/subscriptions_overview',
} as const;


/** Migrated route map from former domain-root config superadmin_support.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_SUPPORT_URLS = {
  PAGE: '/superadmin/superadmin_support',
  COMPLAINTS: '/superadmin/superadmin_support/support_complaints',
  TICKETS: '/superadmin/superadmin_support/support_tickets',
} as const;


/** Migrated route map from former domain-root config superadmin_system_health.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_SYSTEM_HEALTH_URLS = {
  PAGE: '/superadmin/superadmin_system',
  OVERVIEW: '/superadmin/superadmin_system/system_health_overview',
} as const;


/** Migrated route map from former domain-root config superadmin_users.url_config.ts; kept in the role navigation route registry to satisfy root quarantine. */
/** Canonical domain route map. API endpoints remain leaf-owned and are not declared here. */
const SUPERADMIN_USERS_URLS = {
  PAGE: '/superadmin/superadmin_users',
  DIRECTORY: '/superadmin/superadmin_users/users_directory',
  OVERVIEW: '/superadmin/superadmin_users/users_overview',
  ROLES_PERMISSIONS: '/superadmin/superadmin_users/users_roles_permissions',
} as const;


/** Migrated route registry from the former navigation domain root config. */
/** Navigation infrastructure routes only. Feature destinations are duplicated locally in the navigation registry under Strict WET; no sibling feature imports are used. */
const SUPERADMIN_NAVIGATION_DOMAIN_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;
/**
 * Defines the public SuperadminNavigationDomainUrls contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type SuperadminNavigationDomainUrls = typeof SUPERADMIN_NAVIGATION_DOMAIN_URLS;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_NAVIGATION_SHELL_ROUTES = {
  SUPERADMIN_NAVIGATION_URLS: SUPERADMIN_NAVIGATION_URLS,
  SUPERADMIN_NAVIGATION_SHELL_URLS: SUPERADMIN_NAVIGATION_SHELL_URLS,
  SUPERADMIN_ACCOUNTING_URLS: SUPERADMIN_ACCOUNTING_URLS,
  SUPERADMIN_ANALYTICS_URLS: SUPERADMIN_ANALYTICS_URLS,
  SUPERADMIN_AUDIT_URLS: SUPERADMIN_AUDIT_URLS,
  SUPERADMIN_BACKUP_URLS: SUPERADMIN_BACKUP_URLS,
  SUPERADMIN_BILLING_URLS: SUPERADMIN_BILLING_URLS,
  SUPERADMIN_COMMUNICATION_URLS: SUPERADMIN_COMMUNICATION_URLS,
  SUPERADMIN_DASHBOARD_URLS: SUPERADMIN_DASHBOARD_URLS,
  SUPERADMIN_DATA_MANAGEMENT_URLS: SUPERADMIN_DATA_MANAGEMENT_URLS,
  SUPERADMIN_FACILITIES_URLS: SUPERADMIN_FACILITIES_URLS,
  SUPERADMIN_LIBRARIES_URLS: SUPERADMIN_LIBRARIES_URLS,
  SUPERADMIN_LIBRARY_OPERATIONS_URLS: SUPERADMIN_LIBRARY_OPERATIONS_URLS,
  SUPERADMIN_MEMBER_FINANCE_URLS: SUPERADMIN_MEMBER_FINANCE_URLS,
  SUPERADMIN_PLANS_URLS: SUPERADMIN_PLANS_URLS,
  SUPERADMIN_PROFILE_URLS: SUPERADMIN_PROFILE_URLS,
  SUPERADMIN_SECURITY_URLS: SUPERADMIN_SECURITY_URLS,
  SUPERADMIN_SETTINGS_URLS: SUPERADMIN_SETTINGS_URLS,
  SUPERADMIN_STUDENT_OPERATIONS_URLS: SUPERADMIN_STUDENT_OPERATIONS_URLS,
  SUPERADMIN_SUBSCRIPTIONS_URLS: SUPERADMIN_SUBSCRIPTIONS_URLS,
  SUPERADMIN_SUPPORT_URLS: SUPERADMIN_SUPPORT_URLS,
  SUPERADMIN_SYSTEM_HEALTH_URLS: SUPERADMIN_SYSTEM_HEALTH_URLS,
  SUPERADMIN_USERS_URLS: SUPERADMIN_USERS_URLS,
  SUPERADMIN_NAVIGATION_DOMAIN_URLS: SUPERADMIN_NAVIGATION_DOMAIN_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_NAVIGATION_SHELL_API = {} as const;
