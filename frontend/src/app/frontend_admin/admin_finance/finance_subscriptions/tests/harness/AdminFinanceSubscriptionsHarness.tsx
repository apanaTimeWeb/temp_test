import type { ReactNode } from 'react';
import { AdminFinanceSubscriptionsScenarioLabel, type AdminFinanceSubscriptionsScenario } from '@/app/frontend_admin/admin_finance/finance_subscriptions/tests/harness/bootstrap';
import type { AdminFinanceSubscriptionsHarnessProps } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceSubscriptionsHarness({ children, scenario = 'ACTIVE' }: AdminFinanceSubscriptionsHarnessProps) {
  return (
    <div data-testid="admin_finance_subscriptions-harness" data-scenario={AdminFinanceSubscriptionsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_subscriptions-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_subscriptions-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_subscriptions-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_subscriptions-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceSubscriptionsHarnessProps };
