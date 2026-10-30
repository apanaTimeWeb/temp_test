import type { ReactNode } from 'react';
import { AdminAccountsSeatGapReportScenarioLabel, type AdminAccountsSeatGapReportScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/tests/harness/bootstrap';
import type { AdminAccountsSeatGapReportHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAccountsSeatGapReportHarness({ children, scenario = 'ACTIVE' }: AdminAccountsSeatGapReportHarnessProps) {
  return (
    <div data-testid="admin_accounts_seat_gap_report-harness" data-scenario={AdminAccountsSeatGapReportScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_accounts_seat_gap_report-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_accounts_seat_gap_report-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_accounts_seat_gap_report-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_accounts_seat_gap_report-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAccountsSeatGapReportHarnessProps };
