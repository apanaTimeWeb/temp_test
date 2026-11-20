// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/mocks/scenarios/superadmin_data_import_migration.scenarios.ts
/**
 * @file superadmin_data_import_migration.scenarios.ts
 * @description Mock scenarios for testing import batches, validation states, and errors.
 */

import {
  MOCK_IMPORT_OVERVIEW,
  MOCK_IMPORT_BATCHES,
  MOCK_PREFLIGHT_RESULT,
} from '../fixtures/superadmin_data_import_migration.fixtures';

export const importScenarios = {
  default: {
    overview: MOCK_IMPORT_OVERVIEW,
    batches: MOCK_IMPORT_BATCHES,
    preflight: MOCK_PREFLIGHT_RESULT,
  },
  empty: {
    overview: {
      totalBatchesRun: 0,
      totalRecordsIngested: 0,
      lastMigrationAt: null,
      activeRollbackSnapshotsCount: 0,
    },
    batches: [],
    preflight: null,
  },
};
