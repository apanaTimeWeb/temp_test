// mocks/scenarios/superadmin_usage_overview.scenarios.ts
import { MOCK_LIBRARY_USAGE_LIST, MOCK_SYSTEM_USAGE_SUMMARY } from '../fixtures/superadmin_usage_overview.fixtures';

export const SUPERADMIN_USAGE_OVERVIEW_SCENARIOS = {
  ACTIVE: {
    status: 200,
    envelope: {
      success: true,
      message: 'Usage metrics loaded successfully',
      data: MOCK_LIBRARY_USAGE_LIST,
      requestId: 'req-usage-active-001',
    },
  },
  EMPTY: {
    status: 200,
    envelope: {
      success: true,
      message: 'No libraries found matching search criteria',
      data: [],
      requestId: 'req-usage-empty-002',
    },
  },
  SERVER_500: {
    status: 500,
    envelope: {
      success: false,
      message: 'Internal server error while aggregating telemetry',
      data: null,
      errorCode: 'ERR_USAGE_TELEMETRY_500',
      statusCode: 500,
      requestId: 'req-usage-err-500',
    },
  },
  TIMEOUT: {
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Gateway timeout querying resource cluster',
      data: null,
      errorCode: 'ERR_USAGE_TIMEOUT',
      statusCode: 504,
      requestId: 'req-usage-timeout-504',
    },
  },
  UNAUTHORIZED: {
    status: 403,
    envelope: {
      success: false,
      message: 'Unauthorized: SuperAdmin role required for quota metrics',
      data: null,
      errorCode: 'ERR_FORBIDDEN_USAGE_METRICS',
      statusCode: 403,
      requestId: 'req-usage-auth-403',
    },
  },
} as const;
