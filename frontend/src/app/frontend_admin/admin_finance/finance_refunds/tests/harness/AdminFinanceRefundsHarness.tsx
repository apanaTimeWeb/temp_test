import type { ReactNode } from 'react';
import type { AdminFinanceRefundsScenario, AdminFinanceRefundsHarnessProps } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';


/** Test-only scenarios; these fixtures do not claim an external API contract. */
export const AdminFinanceRefundsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;

/** Renders visible states so tests exercise state semantics rather than only data attributes. */
export function AdminFinanceRefundsHarness({ children, scenario = 'ACTIVE' }: AdminFinanceRefundsHarnessProps) {
  const label = scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase();
  return (
    <div data-testid="admin_finance_refunds-harness" data-scenario={label}>
      {scenario === 'ACTIVE' ? children : null}
      {scenario === 'EMPTY' ? <p role="status" data-testid="admin_finance_refunds-harness-empty">No records in this scenario.</p> : null}
      {scenario === 'SERVER_500' ? <p role="alert" data-testid="admin_finance_refunds-harness-server-error">The simulated service failed.</p> : null}
      {scenario === 'TIMEOUT' ? <p role="status" data-testid="admin_finance_refunds-harness-timeout">The simulated request timed out.</p> : null}
      {scenario === 'UNAUTHORIZED' ? <p role="alert" data-testid="admin_finance_refunds-harness-unauthorized">This scenario is unauthorized.</p> : null}
    </div>
  );
}


export type { AdminFinanceRefundsScenario, AdminFinanceRefundsHarnessProps };
