// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/api/superadmin_data_import_migration.query_keys.ts
/**
 * @file superadmin_data_import_migration.query_keys.ts
 * @description Hierarchical query key factory for Data Import & Migration Management.
 */

export const superadminDataImportMigrationKeys = {
  all: ['superadmin_data_import_migration'] as const,
  overview: () => [...superadminDataImportMigrationKeys.all, 'overview'] as const,
  batches: (filters?: Record<string, unknown>) =>
    [...superadminDataImportMigrationKeys.all, 'batches', filters ?? {}] as const,
  batchDetail: (batchId: string) =>
    [...superadminDataImportMigrationKeys.all, 'batches', batchId] as const,
};
