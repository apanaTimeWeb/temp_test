import type { ReactNode } from 'react';
import { AdminFinancePaymentPromisesScenarioLabel, type AdminFinancePaymentPromisesScenario } from '@/app/frontend_admin/admin_finance/finance_payment_promises/tests/harness/bootstrap';
import type { AdminFinancePaymentPromisesHarnessProps } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinancePaymentPromisesHarness({ children, scenario = 'ACTIVE' }: AdminFinancePaymentPromisesHarnessProps) {
  return (
    <div data-testid="admin_finance_payment_promises-harness" data-scenario={AdminFinancePaymentPromisesScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_payment_promises-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_payment_promises-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_payment_promises-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_payment_promises-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinancePaymentPromisesHarnessProps };
