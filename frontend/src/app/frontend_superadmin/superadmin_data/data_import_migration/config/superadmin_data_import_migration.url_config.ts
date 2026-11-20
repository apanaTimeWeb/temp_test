// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/config/superadmin_data_import_migration.url_config.ts
/**
 * @file superadmin_data_import_migration.url_config.ts
 * @description Centralized URL routes and API endpoints for Data Import & Migration Management.
 */

export const IMPORT_MIGRATION_ROUTES = {
  INDEX: '/superadmin/superadmin_data/data_import_migration',
  OVERVIEW: '/superadmin/superadmin_data/data_overview',
  EXPORT: '/superadmin/superadmin_data/data_export_management',
} as const;

export const IMPORT_MIGRATION_URLS = {
  OVERVIEW: '/api/v1/superadmin/data/imports/overview',
  BATCHES_LIST: '/api/v1/superadmin/data/imports/batches',
  VALIDATE_PREFLIGHT: '/api/v1/superadmin/data/imports/validate',
  COMMIT_IMPORT: '/api/v1/superadmin/data/imports/commit',
  ROLLBACK_IMPORT: (batchId: string) => `/api/v1/superadmin/data/imports/batches/${batchId}/rollback`,
  DOWNLOAD_ERROR_CSV: (batchId: string) => `/api/v1/superadmin/data/imports/batches/${batchId}/errors.csv`,
} as const;
