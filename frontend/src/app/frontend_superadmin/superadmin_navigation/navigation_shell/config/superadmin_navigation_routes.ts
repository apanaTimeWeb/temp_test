// RESPONSIBILITY: Provide the navigation shell with a local, stable registry of verified public route literals.
// FLOW: Navigation registry -> route links/redirects; values were verified against owning URL config constants to avoid cross-leaf imports.

export const SUPERADMIN_NAVIGATION_ROUTES = {
  // 01 Dashboard Overview
  superadmin_dashboard: '/superadmin/superadmin_dashboard/dashboard_overview',
  dashboard_overview: '/superadmin/superadmin_dashboard/dashboard_overview',

  // 02 Library Account Management
  superadmin_libraries: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_overview: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_onboarding_setup: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  libraries_profile_configuration: '/superadmin/superadmin_libraries/libraries_profile_configuration',
  libraries_student_bulk_import: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_student_smart_id: '/superadmin/superadmin_libraries/libraries_overview',

  // 03 Branch Management
  superadmin_branches: '/superadmin/superadmin_branches/branches_overview',
  branches_overview: '/superadmin/superadmin_branches/branches_overview',

  // 04 Admin & User Management
  superadmin_users: '/superadmin/superadmin_users/users_overview',
  users_overview: '/superadmin/superadmin_users/users_overview',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
  users_member_referrals: '/superadmin/superadmin_users/users_overview',
  users_member_trust_score: '/superadmin/superadmin_users/users_overview',

  // 05 Plans & Subscription
  superadmin_plans: '/superadmin/superadmin_plans/plans_pricing_catalog',
  plans_pricing_catalog: '/superadmin/superadmin_plans/plans_pricing_catalog',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
  superadmin_subscriptions: '/superadmin/superadmin_subscriptions/subscriptions_overview',
  subscriptions_overview: '/superadmin/superadmin_subscriptions/subscriptions_overview',
  subscriptions_active_subscribers: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',

  // 06 Billing & Payments
  superadmin_billing: '/superadmin/superadmin_billing/billing_invoices',
  billing_overview: '/superadmin/superadmin_billing/billing_overview',
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',

  // 07 Feature & Module Control
  superadmin_features: '/superadmin/superadmin_features/features_overview',
  features_overview: '/superadmin/superadmin_features/features_overview',

  // 08 Usage & Limit Monitoring
  superadmin_usage: '/superadmin/superadmin_usage/usage_overview',
  usage_overview: '/superadmin/superadmin_usage/usage_overview',
  usage_quota_requests: '/superadmin/superadmin_usage/usage_quota_requests',

  // 09 Security & Audit Logs
  superadmin_security: '/superadmin/superadmin_security/security_overview',
  security_overview: '/superadmin/superadmin_security/security_overview',
  security_threats: '/superadmin/superadmin_security/security_threats',
  security_active_sessions: '/superadmin/superadmin_security/security_active_sessions',
  security_user_sessions: '/superadmin/superadmin_security/security_user_sessions',
  security_ip_firewall: '/superadmin/superadmin_security/security_ip_firewall',
  security_login_security: '/superadmin/superadmin_security/security_login_security',
  security_mfa: '/superadmin/superadmin_security/security_mfa',
  security_password_policy: '/superadmin/superadmin_security/security_password_policy',
  security_api_keys: '/superadmin/superadmin_security/security_api_keys',
  audit_logs: '/superadmin/superadmin_system/system_audit_logs',

  // 10 Reports & Analytics
  superadmin_analytics: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_overview: '/superadmin/superadmin_analytics/analytics_overview',
  analytics_platform_reports: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_billing_reports: '/superadmin/superadmin_analytics/analytics_billing_reports',
  analytics_usage_reports: '/superadmin/superadmin_analytics/analytics_usage_reports',
  analytics_security_reports: '/superadmin/superadmin_analytics/analytics_security_reports',
  analytics_financials: '/superadmin/superadmin_analytics/analytics_financials',
  analytics_library_growth: '/superadmin/superadmin_analytics/analytics_library_growth',
  analytics_subscription_mix: '/superadmin/superadmin_analytics/analytics_subscription_mix',

  // 11 Support & Ticket Management
  superadmin_support: '/superadmin/superadmin_support/support_tickets',
  support_tickets: '/superadmin/superadmin_support/support_tickets',
  support_complaints: '/superadmin/superadmin_support/support_complaints',

  // 12 Notification Management
  superadmin_communication: '/superadmin/superadmin_communication/communication_notification_center',
  communication_notification_center: '/superadmin/superadmin_communication/communication_notification_center',
  communication_notices: '/superadmin/superadmin_communication/communication_notices',
  communication_whatsapp_logs: '/superadmin/superadmin_communication/communication_whatsapp_logs',
  communication_whatsapp_templates: '/superadmin/superadmin_communication/communication_whatsapp_templates',

  // 13 Integration & API Management
  superadmin_integrations: '/superadmin/superadmin_integrations/integrations_overview',
  integrations_overview: '/superadmin/superadmin_integrations/integrations_overview',

  // 14 Data, Backup & Disaster Recovery
  superadmin_data: '/superadmin/superadmin_data/data_overview',
  data_overview: '/superadmin/superadmin_data/data_overview',
  data_backup_operations: '/superadmin/superadmin_data/data_backup_operations',
  data_restore_operations: '/superadmin/superadmin_data/data_restore_operations',
  data_export_management: '/superadmin/superadmin_data/data_export_management',
  data_import_migration: '/superadmin/superadmin_data/data_import_migration',
  data_archive_retention: '/superadmin/superadmin_data/data_archive_retention',
  // Backward compatibility aliases
  backup_overview: '/superadmin/superadmin_data/data_overview',
  backup_overview__create: '/superadmin/superadmin_data/data_backup_operations?action=create',
  backup_configuration: '/superadmin/superadmin_data/data_backup_operations',
  backup_history: '/superadmin/superadmin_data/data_restore_operations',
  backup_history__restore: '/superadmin/superadmin_data/data_restore_operations?action=restore',
  backup_schedules: '/superadmin/superadmin_data/data_backup_operations',
  data_export_jobs: '/superadmin/superadmin_data/data_export_management',

  // 15 System Health & Monitoring
  superadmin_system: '/superadmin/superadmin_system/system_health_overview',
  system_health_overview: '/superadmin/superadmin_system/system_health_overview',

  // 16 Global Settings
  superadmin_settings: '/superadmin/superadmin_settings/settings_general',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_general__settings_library_configuration: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
  settings_overview: '/superadmin/superadmin_settings/settings_general',
  settings_appearance: '/superadmin/superadmin_settings/settings_branding',
  settings_branding: '/superadmin/superadmin_settings/settings_branding',
  settings_integrations: '/superadmin/superadmin_integrations/integrations_overview',
  settings_storage: '/superadmin/superadmin_data/data_overview',
  profile_overview: '/superadmin/superadmin_users/users_overview',
  profile_overview__details: '/superadmin/superadmin_users/users_overview?view=details',
  profile_overview__edit: '/superadmin/superadmin_users/users_overview?view=edit',
  profile_security: '/superadmin/superadmin_security/security_password_policy',
  profile_security__change_password: '/superadmin/superadmin_security/security_password_policy',
  profile_security__two_factor: '/superadmin/superadmin_security/security_mfa',
  profile_active_sessions: '/superadmin/superadmin_security/security_active_sessions',
  profile_login_history: '/superadmin/superadmin_security/security_login_security',

  // Legacy/compatibility mapped to canonical modules
  superadmin_accounting: '/superadmin/superadmin_billing/billing_overview',
  accounting_daily_settlement: '/superadmin/superadmin_billing/billing_overview',
  accounting_expense_categories: '/superadmin/superadmin_billing/billing_overview',
  accounting_expenses: '/superadmin/superadmin_billing/billing_overview',
  accounting_financial_reports: '/superadmin/superadmin_analytics/analytics_financials',
} as const;

/**
 * Defines the public SuperadminNavigationRouteKey contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminNavigationRouteKey = keyof typeof SUPERADMIN_NAVIGATION_ROUTES;
