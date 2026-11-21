// tests/harness/bootstrap.ts
// Standalone mock scenario mounting bootstrap for Billing Reports

import { SUPERADMIN_BILLING_REPORTS_SCENARIOS } from '../../mocks/scenarios/superadmin_analytics_billing_reports.scenarios';

export function initializeBillingReportsMockHarness(
  scenarioKey: keyof typeof SUPERADMIN_BILLING_REPORTS_SCENARIOS = 'ACTIVE_RECORDS'
) {
  return SUPERADMIN_BILLING_REPORTS_SCENARIOS[scenarioKey];
}
