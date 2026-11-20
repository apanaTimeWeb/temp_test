// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/mocks/scenarios/superadmin_data_export_management.scenarios.ts
/**
 * @file superadmin_data_export_management.scenarios.ts
 * @description Mock scenarios for export queue states, empty list, and error handling.
 */

import {
  MOCK_EXPORT_OVERVIEW,
  MOCK_EXPORT_JOBS,
  MOCK_EXPORT_TENANTS,
  MOCK_EXPORT_BRANCHES,
} from '../fixtures/superadmin_data_export_management.fixtures';

export const exportScenarios = {
  default: {
    overview: MOCK_EXPORT_OVERVIEW,
    jobs: MOCK_EXPORT_JOBS,
    tenants: MOCK_EXPORT_TENANTS,
    branches: MOCK_EXPORT_BRANCHES,
  },
  empty: {
    overview: {
      activeJobsCount: 0,
      completedTodayCount: 0,
      totalStorageUsedBytes: 0,
      totalExportsGenerated: 0,
    },
    jobs: [],
    tenants: MOCK_EXPORT_TENANTS,
    branches: MOCK_EXPORT_BRANCHES,
  },
};
