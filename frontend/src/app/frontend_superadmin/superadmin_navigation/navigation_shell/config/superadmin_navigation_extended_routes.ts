// RESPONSIBILITY: Extended verified route literals for modules 09 through 16 plus legacy mappings.

export const SUPERADMIN_NAVIGATION_EXTENDED_ROUTES = {
  // 09 Security & Audit Logs
  superadmin_security: '/superadmin/superadmin_security/security_overview',
  security_overview: '/superadmin/superadmin_security/security_overview',
  security_threats: '/superadmin/superadmin_security/security_threats',
  security_active_sessions: '/superadmin/superadmin_security/security_active_sessions',
  security_user_sessions: '/superadmin/superadmin_security/security_active_sessions',
  security_ip_firewall: '/superadmin/superadmin_security/security_ip_firewall',
  security_login_security: '/superadmin/superadmin_security/security_login_security',
  security_mfa: '/superadmin/superadmin_security/security_mfa',
  security_password_policy: '/superadmin/superadmin_security/security_password_policy',
  security_audit_logs: '/superadmin/superadmin_security/security_audit_logs',
  audit_logs: '/superadmin/superadmin_security/security_audit_logs',

  // 10 Reports & Analytics
  superadmin_analytics: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_overview: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_platform_reports: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_billing_reports: '/superadmin/superadmin_analytics/analytics_billing_reports',
  analytics_usage_reports: '/superadmin/superadmin_analytics/analytics_usage_reports',
  analytics_security_reports: '/superadmin/superadmin_analytics/analytics_security_reports',
  analytics_financials: '/superadmin/superadmin_analytics/analytics_billing_reports',
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
  communication_whatsapp_logs: '/superadmin/superadmin_communication/communication_notification_center?tab=logs',
  communication_whatsapp_templates: '/superadmin/superadmin_communication/communication_notification_center?tab=templates',

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
  settings_library_configuration: '/superadmin/superadmin_settings/settings_library_configuration',
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

  // Legacy mappings
  superadmin_accounting: '/superadmin/superadmin_billing/billing_overview',
  accounting_daily_settlement: '/superadmin/superadmin_billing/billing_overview',
  accounting_expense_categories: '/superadmin/superadmin_billing/billing_overview',
  accounting_expenses: '/superadmin/superadmin_billing/billing_overview',
  accounting_financial_reports: '/superadmin/superadmin_analytics/analytics_financials',
} as const;
