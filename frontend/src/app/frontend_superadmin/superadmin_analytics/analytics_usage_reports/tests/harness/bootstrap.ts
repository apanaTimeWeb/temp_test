// tests/harness/bootstrap.ts
// Standalone mock scenario mounting bootstrap for Usage Reports

import { SUPERADMIN_USAGE_REPORTS_SCENARIOS } from '../../mocks/scenarios/superadmin_analytics_usage_reports.scenarios';

export function initializeUsageReportsMockHarness(
  scenarioKey: keyof typeof SUPERADMIN_USAGE_REPORTS_SCENARIOS = 'ACTIVE_RECORDS'
) {
  return SUPERADMIN_USAGE_REPORTS_SCENARIOS[scenarioKey];
}
