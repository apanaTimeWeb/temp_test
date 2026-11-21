// mocks/scenarios/superadmin_analytics_security_reports.scenarios.ts
// Test and mock scenarios for Superadmin Security Reports

import { MOCK_SECURITY_REPORTS_OVERVIEW } from '../fixtures/superadmin_analytics_security_reports.fixtures';
import type { ApiResponse } from '@/lib/api';
import type { SecurityReportsOverviewData } from '../../types/SuperadminAnalyticsSecurityReportsTypes';

export const SUPERADMIN_SECURITY_REPORTS_SCENARIOS = {
  ACTIVE_RECORDS: {
    name: 'Active Security Reports with threat and login telemetry',
    envelope: {
      success: true,
      message: 'Security reports loaded successfully',
      data: MOCK_SECURITY_REPORTS_OVERVIEW,
      requestId: 'req-sec-scen-001',
    } as ApiResponse<SecurityReportsOverviewData>,
  },
  EMPTY_RECORDS: {
    name: 'Empty Security Reports dataset',
    envelope: {
      success: true,
      message: 'No security audit logs found matching criteria',
      data: {
        ...MOCK_SECURITY_REPORTS_OVERVIEW,
        items: [],
        totalCount: 0,
      },
      requestId: 'req-sec-scen-002',
    } as ApiResponse<SecurityReportsOverviewData>,
  },
};
