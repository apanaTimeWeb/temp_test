/**
 * Responsibility: render deterministic UI-state coverage for Dashboard Reports scenarios.
 * Test-only component. It does not represent live backend/API behavior.
 */
import type { ReactNode } from 'react';
import {
  AdminDashboardReportsAnalyticsScenarioLabel,
  type AdminDashboardReportsAnalyticsScenario,
} from '@/app/frontend_admin/admin_dashboard/dashboard_reports/tests/harness/bootstrap';

export interface AdminDashboardReportsAnalyticsHarnessProps {
  children: ReactNode;
  scenario?: AdminDashboardReportsAnalyticsScenario;
}

export function AdminDashboardReportsAnalyticsHarness({
  children,
  scenario = 'ACTIVE_RECORDS',
}: AdminDashboardReportsAnalyticsHarnessProps) {
  const label = AdminDashboardReportsAnalyticsScenarioLabel(scenario);
  const attributes = {
    'data-testid': 'admin_dashboard_reports_analytics-harness',
    'data-scenario': label,
  };

  if (scenario === 'EMPTY_DATA') return <section {...attributes} role="status">No report data available.</section>;
  if (scenario === 'SERVER_500_ERROR') return <section {...attributes} role="alert">Reports are temporarily unavailable due to a server error.</section>;
  if (scenario === 'NETWORK_TIMEOUT') return <section {...attributes} role="alert">The reports request timed out. Retry the request.</section>;
  if (scenario === 'UNAUTHORIZED_401') return <section {...attributes} role="alert">Your session does not permit access to reports.</section>;
  if (scenario === 'FORBIDDEN_403') return <section {...attributes} role="alert">Your account does not have permission to view reports.</section>;
  if (scenario === 'NETWORK_ERROR') return <section {...attributes} role="alert">Reports could not be reached. Check the connection and retry.</section>;
  if (scenario === 'INVALID_RESPONSE') return <section {...attributes} role="alert">The reports service returned an invalid response.</section>;
  return <div {...attributes}>{children}</div>;
}
