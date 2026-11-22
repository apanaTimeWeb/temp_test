// mocks/scenarios/superadmin_analytics_usage_reports.scenarios.ts
// Test and mock scenarios for Superadmin Usage Reports

import { MOCK_USAGE_REPORTS_OVERVIEW } from '../fixtures/superadmin_analytics_usage_reports.fixtures';
import type { ApiResponse } from '@/lib/api';
import type { UsageReportsOverviewData } from '../../types/SuperadminAnalyticsUsageReportsTypes';

export const SUPERADMIN_USAGE_REPORTS_SCENARIOS = {
  ACTIVE_RECORDS: {
    name: 'Active Usage Reports with realistic consumption',
    envelope: {
      success: true,
      message: 'Usage reports loaded successfully',
      data: MOCK_USAGE_REPORTS_OVERVIEW,
      requestId: 'req-usage-scen-001',
    } as ApiResponse<UsageReportsOverviewData>,
  },
  EMPTY_RECORDS: {
    name: 'Empty Usage Reports dataset',
    envelope: {
      success: true,
      message: 'No usage records found matching criteria',
      data: {
        ...MOCK_USAGE_REPORTS_OVERVIEW,
        items: [],
        totalCount: 0,
      },
      requestId: 'req-usage-scen-002',
    } as ApiResponse<UsageReportsOverviewData>,
  },
};
