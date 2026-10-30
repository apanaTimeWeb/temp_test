import type { ReactNode } from 'react';
import type { AdminFinanceReceiptsScenario, AdminFinanceReceiptsHarnessProps } from '@/app/frontend_admin/admin_finance/finance_receipts/types/AdminFinanceReceiptsTypes';


/** Test-only scenarios; these fixtures do not claim an external API contract. */
export const AdminFinanceReceiptsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;

/** Renders visible states so tests exercise state semantics rather than only data attributes. */
export function AdminFinanceReceiptsHarness({ children, scenario = 'ACTIVE' }: AdminFinanceReceiptsHarnessProps) {
  const label = scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase();
  return (
    <div data-testid="admin_finance_receipts-harness" data-scenario={label}>
      {scenario === 'ACTIVE' ? children : null}
      {scenario === 'EMPTY' ? <p role="status" data-testid="admin_finance_receipts-harness-empty">No records in this scenario.</p> : null}
      {scenario === 'SERVER_500' ? <p role="alert" data-testid="admin_finance_receipts-harness-server-error">The simulated service failed.</p> : null}
      {scenario === 'TIMEOUT' ? <p role="status" data-testid="admin_finance_receipts-harness-timeout">The simulated request timed out.</p> : null}
      {scenario === 'UNAUTHORIZED' ? <p role="alert" data-testid="admin_finance_receipts-harness-unauthorized">This scenario is unauthorized.</p> : null}
    </div>
  );
}


export type { AdminFinanceReceiptsScenario, AdminFinanceReceiptsHarnessProps };
