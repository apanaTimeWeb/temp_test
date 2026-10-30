import type { ReactNode } from 'react';
import { AdminFinanceDashboardScenarioLabel, type AdminFinanceDashboardScenario } from '@/app/frontend_admin/admin_finance/finance_dashboard/tests/harness/bootstrap';
import type { AdminFinanceDashboardHarnessProps } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceDashboardHarness({ children, scenario = 'ACTIVE' }: AdminFinanceDashboardHarnessProps) {
  return (
    <div data-testid="admin_finance_dashboard-harness" data-scenario={AdminFinanceDashboardScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_dashboard-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_dashboard-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_dashboard-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_dashboard-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceDashboardHarnessProps };
