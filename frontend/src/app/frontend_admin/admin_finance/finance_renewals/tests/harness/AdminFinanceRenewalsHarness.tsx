import type { ReactNode } from 'react';
import { AdminFinanceRenewalsScenarioLabel, type AdminFinanceRenewalsScenario } from '@/app/frontend_admin/admin_finance/finance_renewals/tests/harness/bootstrap';
import type { AdminFinanceRenewalsHarnessProps } from '@/app/frontend_admin/admin_finance/finance_renewals/types/AdminFinanceRenewalsComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceRenewalsHarness({ children, scenario = 'ACTIVE' }: AdminFinanceRenewalsHarnessProps) {
  return (
    <div data-testid="admin_finance_renewals-harness" data-scenario={AdminFinanceRenewalsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_renewals-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_renewals-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_renewals-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_renewals-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceRenewalsHarnessProps };
