import type { ReactNode } from 'react';
import { AdminFinanceLateFeesScenarioLabel, type AdminFinanceLateFeesScenario } from '@/app/frontend_admin/admin_finance/finance_late_fees/tests/harness/bootstrap';
import type { AdminFinanceLateFeesHarnessProps } from '@/app/frontend_admin/admin_finance/finance_late_fees/types/AdminFinanceLateFeesTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceLateFeesHarness({ children, scenario = 'ACTIVE' }: AdminFinanceLateFeesHarnessProps) {
  return (
    <div data-testid="admin_finance_late_fees-harness" data-scenario={AdminFinanceLateFeesScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_late_fees-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_late_fees-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_late_fees-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_late_fees-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceLateFeesHarnessProps };
