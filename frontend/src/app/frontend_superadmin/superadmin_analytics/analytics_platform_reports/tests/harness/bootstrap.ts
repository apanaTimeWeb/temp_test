// tests/harness/bootstrap.ts
// Standalone mock scenario mounting bootstrap for Platform Reports

import { SUPERADMIN_PLATFORM_REPORTS_SCENARIOS } from '../../mocks/scenarios/superadmin_analytics_platform_reports.scenarios';

export function initializePlatformReportsMockHarness(scenarioKey: keyof typeof SUPERADMIN_PLATFORM_REPORTS_SCENARIOS = 'ACTIVE_RECORDS') {
  return SUPERADMIN_PLATFORM_REPORTS_SCENARIOS[scenarioKey];
}
