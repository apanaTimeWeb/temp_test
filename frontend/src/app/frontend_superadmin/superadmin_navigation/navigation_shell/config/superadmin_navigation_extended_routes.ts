// RESPONSIBILITY: Verified route literals for modules 09 through 16 plus active header/layout aliases.

export const SUPERADMIN_NAVIGATION_EXTENDED_ROUTES = {
  // 09 Security & Audit Logs
  superadmin_security: '/superadmin/superadmin_security/security_overview',
  security_overview: '/superadmin/superadmin_security/security_overview',
  security_threats: '/superadmin/superadmin_security/security_threats',
  security_active_sessions: '/superadmin/superadmin_security/security_active_sessions',
  security_ip_firewall: '/superadmin/superadmin_security/security_ip_firewall',
  security_login_security: '/superadmin/superadmin_security/security_login_security',
  security_mfa: '/superadmin/superadmin_security/security_mfa',
  security_password_policy: '/superadmin/superadmin_security/security_password_policy',
  security_audit_logs: '/superadmin/superadmin_security/security_audit_logs',
  audit_logs: '/superadmin/superadmin_security/security_audit_logs',

  // 10 Reports & Analytics
  superadmin_analytics: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_platform_reports: '/superadmin/superadmin_analytics/analytics_platform_reports',
  analytics_billing_reports: '/superadmin/superadmin_analytics/analytics_billing_reports',
  analytics_usage_reports: '/superadmin/superadmin_analytics/analytics_usage_reports',
  analytics_security_reports: '/superadmin/superadmin_analytics/analytics_security_reports',

  // 11 Support & Ticket Management
  superadmin_support: '/superadmin/superadmin_support/support_tickets',
  support_tickets: '/superadmin/superadmin_support/support_tickets',

  // 12 Notification Management
  superadmin_communication: '/superadmin/superadmin_communication/communication_notification_center',
  communication_notification_center: '/superadmin/superadmin_communication/communication_notification_center',
  communication_notices: '/superadmin/superadmin_communication/communication_notices',

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

  // 15 System Health & Monitoring
  superadmin_system: '/superadmin/superadmin_system/system_health_overview',
  system_health_overview: '/superadmin/superadmin_system/system_health_overview',

  // 16 Global Settings
  superadmin_settings: '/superadmin/superadmin_settings/settings_general',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_library_configuration: '/superadmin/superadmin_settings/settings_library_configuration',
  settings_overview: '/superadmin/superadmin_settings/settings_general',
  settings_branding: '/superadmin/superadmin_settings/settings_branding',
  profile_overview: '/superadmin/superadmin_users/users_directory',
} as const;
