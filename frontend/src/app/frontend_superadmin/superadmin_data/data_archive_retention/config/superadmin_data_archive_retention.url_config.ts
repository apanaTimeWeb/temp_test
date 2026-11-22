// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/config/superadmin_data_archive_retention.url_config.ts
/**
 * @file superadmin_data_archive_retention.url_config.ts
 * @description Centralized URL routes and API endpoints for Data Archive & Retention Rules.
 */

export const ARCHIVE_RETENTION_ROUTES = {
  INDEX: '/superadmin/superadmin_data/data_archive_retention',
  OVERVIEW: '/superadmin/superadmin_data/data_overview',
  BACKUP: '/superadmin/superadmin_data/data_backup_operations',
} as const;

export const ARCHIVE_RETENTION_URLS = {
  OVERVIEW: '/api/v1/superadmin/data/retention/overview',
  RULES_LIST: '/api/v1/superadmin/data/retention/rules',
  UPDATE_RULE: (id: string) => `/api/v1/superadmin/data/retention/rules/${id}`,
  ARCHIVE_RECORDS_LIST: '/api/v1/superadmin/data/archive/records',
  UNARCHIVE_RECORD: (id: string) => `/api/v1/superadmin/data/archive/records/${id}/unarchive`,
  TOGGLE_LEGAL_HOLD: (id: string) => `/api/v1/superadmin/data/archive/records/${id}/legal-hold`,
} as const;
