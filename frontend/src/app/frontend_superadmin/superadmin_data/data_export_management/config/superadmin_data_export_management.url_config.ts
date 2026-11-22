// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/config/superadmin_data_export_management.url_config.ts
/**
 * @file superadmin_data_export_management.url_config.ts
 * @description Centralized URL routes and API endpoints for Tenant & Branch Data Export Management.
 */

export const EXPORT_MANAGEMENT_ROUTES = {
  INDEX: '/superadmin/superadmin_data/data_export_management',
  OVERVIEW: '/superadmin/superadmin_data/data_overview',
  BACKUP: '/superadmin/superadmin_data/data_backup_operations',
  RESTORE: '/superadmin/superadmin_data/data_restore_operations',
} as const;

export const EXPORT_MANAGEMENT_URLS = {
  OVERVIEW: '/api/v1/superadmin/data/exports/overview',
  JOBS_LIST: '/api/v1/superadmin/data/exports/jobs',
  TENANTS_LIST: '/api/v1/superadmin/data/exports/tenants',
  BRANCHES_LIST: '/api/v1/superadmin/data/exports/branches',
  TRIGGER_EXPORT: '/api/v1/superadmin/data/exports/trigger',
  CANCEL_EXPORT: (id: string) => `/api/v1/superadmin/data/exports/jobs/${id}/cancel`,
  DOWNLOAD_EXPORT: (id: string) => `/api/v1/superadmin/data/exports/jobs/${id}/download`,
} as const;
