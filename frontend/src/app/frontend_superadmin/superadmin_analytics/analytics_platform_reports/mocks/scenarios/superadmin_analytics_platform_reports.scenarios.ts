// mocks/scenarios/superadmin_analytics_platform_reports.scenarios.ts
// Standard 5-scenario registry for Platform Reports

import { MOCK_PLATFORM_REPORTS_OVERVIEW } from '../fixtures/superadmin_analytics_platform_reports.fixtures';

export const SUPERADMIN_PLATFORM_REPORTS_SCENARIOS = {
  ACTIVE_RECORDS: {
    status: 200,
    envelope: {
      success: true,
      message: 'Platform reports data loaded successfully',
      data: MOCK_PLATFORM_REPORTS_OVERVIEW,
      requestId: 'req-platform-rep-active-001',
    },
  },
  EMPTY_DATA: {
    status: 200,
    envelope: {
      success: true,
      message: 'No records match the selected report filters',
      data: {
        ...MOCK_PLATFORM_REPORTS_OVERVIEW,
        kpis: {
          totalLibraries: 0,
          totalBranches: 0,
          activeAccounts: 0,
          activeAccountsRate: 0,
          growthRate: 0,
          accountCreations: 0,
          accountCancellations: 0,
          churnRate: 0,
        },
        growthTimeline: [],
        statusDistribution: [],
        items: [],
        totalCount: 0,
      },
      requestId: 'req-platform-rep-empty-002',
    },
  },
  SERVER_500_ERROR: {
    status: 500,
    envelope: {
      success: false,
      message: 'Failed to aggregate platform analytics report data',
      data: null,
      errorCode: 'ANALYTICS.PLATFORM.INTERNAL_ERROR',
      statusCode: 500,
      requestId: 'req-platform-rep-500-003',
    },
  },
  NETWORK_TIMEOUT: {
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Platform report query timed out. Please try again.',
      data: null,
      errorCode: 'ANALYTICS.PLATFORM.TIMEOUT',
      statusCode: 504,
      requestId: 'req-platform-rep-504-004',
    },
  },
  UNAUTHORIZED_401: {
    status: 401,
    envelope: {
      success: false,
      message: 'Unauthorized superadmin session. Please re-authenticate.',
      data: null,
      errorCode: 'AUTH.SUPERADMIN.SESSION_EXPIRED',
      statusCode: 401,
      requestId: 'req-platform-rep-401-005',
    },
  },
} as const;
