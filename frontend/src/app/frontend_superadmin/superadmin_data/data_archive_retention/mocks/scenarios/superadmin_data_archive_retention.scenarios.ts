// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/mocks/scenarios/superadmin_data_archive_retention.scenarios.ts
/**
 * @file superadmin_data_archive_retention.scenarios.ts
 * @description Mock scenarios for testing retention rules and archived records catalog.
 */

import {
  MOCK_ARCHIVE_OVERVIEW,
  MOCK_RETENTION_RULES,
  MOCK_ARCHIVED_RECORDS,
} from '../fixtures/superadmin_data_archive_retention.fixtures';

export const archiveRetentionScenarios = {
  default: {
    overview: MOCK_ARCHIVE_OVERVIEW,
    rules: MOCK_RETENTION_RULES,
    records: MOCK_ARCHIVED_RECORDS,
  },
  empty: {
    overview: {
      totalArchivedRecords: 0,
      totalColdStorageBytes: 0,
      activeRetentionRulesCount: 0,
      activeLegalHoldsCount: 0,
    },
    rules: [],
    records: [],
  },
};
