// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/constants/superadmin_data_import_migration.constants.ts
/**
 * @file superadmin_data_import_migration.constants.ts
 * @description Constants for Migration File Ingestion, Validation Rules, and Batch Lifecycles.
 */

export const IMPORT_ENTITY_TYPES = {
  BOOKS_CATALOG: 'BOOKS_CATALOG',
  PATRONS: 'PATRONS',
  CIRCULATION_HISTORY: 'CIRCULATION_HISTORY',
  FINES_FEES: 'FINES_FEES',
} as const;

export const DUPLICATE_STRATEGIES = {
  SKIP: 'SKIP',
  OVERWRITE: 'OVERWRITE',
  ERROR: 'ERROR',
} as const;

export const BATCH_STATUS = {
  VALIDATING: 'VALIDATING',
  VALIDATED: 'VALIDATED',
  COMMITTING: 'COMMITTING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ROLLED_BACK: 'ROLLED_BACK',
} as const;

export const SUPPORTED_IMPORT_EXTENSIONS = ['.csv', '.xlsx', '.json', '.mrc'] as const;

export const VALIDATION_SEVERITY = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  DUPLICATE: 'DUPLICATE',
} as const;
