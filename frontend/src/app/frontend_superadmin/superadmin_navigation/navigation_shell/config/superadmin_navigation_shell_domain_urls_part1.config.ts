// RESPONSIBILITY: Define canonical domain route maps part 1 for navigation shell.

export const SUPERADMIN_NAVIGATION_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;

export const SUPERADMIN_NAVIGATION_SHELL_URLS = {
  AUTH_LOGIN: '/auth/login',
  FORBIDDEN: '/403',
} as const;

export const SUPERADMIN_ACCOUNTING_URLS = {
  PAGE: '/superadmin/superadmin_accounting',
  DAILY_SETTLEMENT: '/superadmin/superadmin_accounting/accounting_daily_settlement',
  EXPENSE_CATEGORIES: '/superadmin/superadmin_accounting/accounting_expense_categories',
  EXPENSES: '/superadmin/superadmin_accounting/accounting_expenses',
  EXPENSES_ADD: '/superadmin/superadmin_accounting/accounting_expenses?view=create',
  FINANCIAL_REPORTS: '/superadmin/superadmin_accounting/accounting_financial_reports',
} as const;

export const SUPERADMIN_ANALYTICS_URLS = {
  PAGE: '/superadmin/superadmin_analytics',
  FINANCIALS: '/superadmin/superadmin_analytics/analytics_financials',
  LIBRARY_GROWTH: '/superadmin/superadmin_analytics/analytics_library_growth',
  OVERVIEW: '/superadmin/superadmin_analytics/analytics_overview',
  SUBSCRIPTION_MIX: '/superadmin/superadmin_analytics/analytics_subscription_mix',
} as const;

export const SUPERADMIN_AUDIT_URLS = {
  PAGE: '/superadmin/superadmin_system',
  LOGS: '/superadmin/superadmin_system/audit_logs',
} as const;

export const SUPERADMIN_BACKUP_URLS = {
  PAGE: '/superadmin/superadmin_system',
  CONFIGURATION: '/superadmin/superadmin_system/backup_configuration',
  CREATE_FLOW: '/superadmin/superadmin_system/backup_overview?view=create',
  HISTORY: '/superadmin/superadmin_system/backup_history',
  OVERVIEW: '/superadmin/superadmin_system/backup_overview',
  RESTORE_FLOW: '/superadmin/superadmin_system/backup_history?view=restore',
  SCHEDULES: '/superadmin/superadmin_system/backup_schedules',
} as const;

export const SUPERADMIN_BILLING_URLS = {
  PAGE: '/superadmin/superadmin_billing',
  INVOICES: '/superadmin/superadmin_billing/billing_invoices',
  OVERVIEW: '/superadmin/superadmin_billing/billing_overview',
} as const;

export const SUPERADMIN_COMMUNICATION_URLS = {
  PAGE: '/superadmin/superadmin_communication',
  NOTICES: '/superadmin/superadmin_communication/communication_notices',
  NOTIFICATION_CENTER: '/superadmin/superadmin_communication/communication_notification_center',
  WHATSAPP_LOGS: '/superadmin/superadmin_communication/communication_notification_center?tab=logs',
  WHATSAPP_TEMPLATES: '/superadmin/superadmin_communication/communication_notification_center?tab=templates',
} as const;

export const SUPERADMIN_DASHBOARD_URLS = {
  PAGE: '/superadmin/superadmin_dashboard',
  OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

export const SUPERADMIN_DATA_MANAGEMENT_URLS = {
  PAGE: '/superadmin/superadmin_system',
  DATA_EXPORT_JOBS: '/superadmin/superadmin_system/data_export_jobs',
} as const;

export const SUPERADMIN_FACILITIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  FACILITY_ASSET_MAINTENANCE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
  FACILITY_ASSET_REGISTRY: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry',
  FACILITY_MAINTENANCE_WORK_ORDERS: '/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders',
  FACILITY_POWER_MANAGEMENT: '/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management',
} as const;
