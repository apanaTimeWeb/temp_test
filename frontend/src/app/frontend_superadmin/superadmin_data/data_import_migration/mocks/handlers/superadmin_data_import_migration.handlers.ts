// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/mocks/handlers/superadmin_data_import_migration.handlers.ts
/**
 * @file superadmin_data_import_migration.handlers.ts
 * @description MSW-compatible REST API handlers for Data Import & Migration Management.
 */

import { IMPORT_MIGRATION_URLS } from '../../config/superadmin_data_import_migration.url_config';
import {
  MOCK_IMPORT_OVERVIEW,
  MOCK_IMPORT_BATCHES,
  MOCK_PREFLIGHT_RESULT,
} from '../fixtures/superadmin_data_import_migration.fixtures';

export const mockImportHandlers = [
  {
    path: IMPORT_MIGRATION_URLS.OVERVIEW,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_IMPORT_OVERVIEW }),
  },
  {
    path: IMPORT_MIGRATION_URLS.BATCHES_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_IMPORT_BATCHES }),
  },
  {
    path: IMPORT_MIGRATION_URLS.VALIDATE_PREFLIGHT,
    method: 'POST',
    handler: () => ({ status: 200, data: MOCK_PREFLIGHT_RESULT }),
  },
  {
    path: IMPORT_MIGRATION_URLS.COMMIT_IMPORT,
    method: 'POST',
    handler: () => ({
      status: 200,
      data: {
        id: 'batch-new',
        batchNumber: 'MIG-2026-LIVE',
        tenantId: 'tnt-delhi-central',
        tenantName: 'Delhi Central Library',
        entityType: 'PATRONS',
        originalFileName: 'patrons.xlsx',
        totalRecords: 1250,
        importedRecords: 1226,
        failedRecords: 16,
        duplicateRecords: 8,
        status: 'COMPLETED',
        rollbackSnapshotId: 'snp-rb-live',
        errorCsvUrl: null,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        operatorId: 'superadmin@institution.edu',
      },
    }),
  },
];
