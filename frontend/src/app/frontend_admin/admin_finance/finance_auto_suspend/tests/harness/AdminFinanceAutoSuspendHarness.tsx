import type { ReactNode } from 'react';
import { AdminFinanceAutoSuspendScenarioLabel, type AdminFinanceAutoSuspendScenario } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/tests/harness/bootstrap';
import type { AdminFinanceAutoSuspendHarnessProps } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceAutoSuspendHarness({ children, scenario = 'ACTIVE' }: AdminFinanceAutoSuspendHarnessProps) {
  return (
    <div data-testid="admin_finance_auto_suspend-harness" data-scenario={AdminFinanceAutoSuspendScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_auto_suspend-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceAutoSuspendHarnessProps };
