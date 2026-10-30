/**
 * Canonical test bootstrap for the Dashboard Reports standalone UI-state harness.
 * This module owns stable scenario labels only; the actual React harness lives in
 * AdminDashboardReportsAnalyticsHarness.tsx so the module has a discoverable harness artifact.
 */
import {
  ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES,
  type AdminDashboardReportsScenarioName,
} from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';

export const AdminDashboardReportsAnalyticsScenarios = ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES;
export type AdminDashboardReportsAnalyticsScenario = AdminDashboardReportsScenarioName;

/** Translate the stable transport-level scenario id into a test-visible label. */
export function AdminDashboardReportsAnalyticsScenarioLabel(scenario: AdminDashboardReportsScenarioName): string {
  const labels: Record<AdminDashboardReportsScenarioName, string> = {
    ACTIVE_RECORDS: 'active-records',
    EMPTY_DATA: 'empty-data',
    SERVER_500_ERROR: 'server-error',
    NETWORK_TIMEOUT: 'timeout',
    UNAUTHORIZED_401: 'unauthorized',
    FORBIDDEN_403: 'forbidden',
    NETWORK_ERROR: 'network-error',
    INVALID_RESPONSE: 'invalid-response',
  };
  return labels[scenario];
}
