export const SUPERADMIN_LIBRARIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  ONBOARDING_SETUP: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  OVERVIEW: '/superadmin/superadmin_libraries/libraries_overview',
  PROFILE_CONFIGURATION: '/superadmin/superadmin_libraries/libraries_profile_configuration',
} as const;
export const SUPERADMIN_LIBRARY_OPERATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  LIBRARY_CAPACITY_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis',
  LIBRARY_CAPACITY_GAP_FILLING: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling',
  LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations',
  LIBRARY_OFFLINE_OPERATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations',
  LIBRARY_SHIFT_GAP_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis',
  LIBRARY_WAITLIST_AUTOMATION: '/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation',
} as const;
export const SUPERADMIN_MEMBER_FINANCE_URLS = {
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
  MEMBER_REFERRALS: '/superadmin/superadmin_users/users_directory?view=member_referrals',
  MEMBER_REFUNDS: '/superadmin/superadmin_billing/billing_overview?view=member_refunds',
  MEMBER_RENEWALS: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_renewals',
  MEMBER_SECURITY_DEPOSITS: '/superadmin/superadmin_billing/billing_overview?view=member_security_deposits',
  MEMBER_SUBSCRIPTIONS: '/superadmin/superadmin_subscriptions/subscriptions_overview?view=member_subscriptions',
  MEMBER_TRUST_SCORE: '/superadmin/superadmin_users/users_directory?view=member_trust_score',
} as const;
export const SUPERADMIN_PLANS_URLS = {
  PAGE: '/superadmin/superadmin_plans',
  PRICING_CATALOG: '/superadmin/superadmin_plans/plans_pricing_catalog',
  PROMOTIONS: '/superadmin/superadmin_plans/plans_promotions',
} as const;
export const SUPERADMIN_PROFILE_URLS = {
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
export const SUPERADMIN_SECURITY_URLS = {
  PAGE: '/superadmin/superadmin_security',
  ACTIVE_SESSIONS: '/superadmin/superadmin_security/security_active_sessions',
  IP_FIREWALL: '/superadmin/superadmin_security/security_ip_firewall',
  LOGIN_SECURITY: '/superadmin/superadmin_security/security_login_security',
  MFA: '/superadmin/superadmin_security/security_mfa',
  OVERVIEW: '/superadmin/superadmin_security/security_overview',
  PASSWORD_POLICY: '/superadmin/superadmin_security/security_password_policy',
  THREATS: '/superadmin/superadmin_security/security_threats',
  USER_SESSIONS: '/superadmin/superadmin_security/security_active_sessions',
} as const;
export const SUPERADMIN_SETTINGS_URLS = {
  PAGE: '/superadmin/superadmin_settings',
  APPEARANCE: '/superadmin/superadmin_settings/settings_appearance',
  BRANDING: '/superadmin/superadmin_settings/settings_branding',
  GENERAL: '/superadmin/superadmin_settings/settings_general',
  INTEGRATIONS: '/superadmin/superadmin_settings/settings_integrations',
  LIBRARY_CONFIGURATION: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
  OVERVIEW: '/superadmin/superadmin_settings/settings_overview',
  STORAGE: '/superadmin/superadmin_settings/settings_storage',
} as const;
export const SUPERADMIN_STUDENT_OPERATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  STUDENT_BULK_IMPORT: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import',
  STUDENT_SMART_ID: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id',
} as const;
export const SUPERADMIN_SUBSCRIPTIONS_URLS = {
  PAGE: '/superadmin/superadmin_subscriptions',
  ACTIVE_SUBSCRIBERS: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',
  OVERVIEW: '/superadmin/superadmin_subscriptions/subscriptions_overview',
} as const;
export const SUPERADMIN_SUPPORT_URLS = {
  PAGE: '/superadmin/superadmin_support',
  COMPLAINTS: '/superadmin/superadmin_support/support_tickets',
  TICKETS: '/superadmin/superadmin_support/support_tickets',
} as const;
export const SUPERADMIN_SYSTEM_HEALTH_URLS = {
  PAGE: '/superadmin/superadmin_system',
  OVERVIEW: '/superadmin/superadmin_system/system_health_overview',
} as const;
export const SUPERADMIN_USERS_URLS = {
  PAGE: '/superadmin/superadmin_users',
  DIRECTORY: '/superadmin/superadmin_users/users_directory',
  OVERVIEW: '/superadmin/superadmin_users/users_directory',
  ROLES_PERMISSIONS: '/superadmin/superadmin_users/users_roles_permissions',
} as const;
export const SUPERADMIN_NAVIGATION_DOMAIN_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;
