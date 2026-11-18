import type { ReactNode } from 'react';
import {
  AdminFinanceAutoSuspendScenarioLabel,
  type AdminFinanceAutoSuspendScenario,
} from './bootstrap';

export interface AdminFinanceAutoSuspendHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceAutoSuspendScenario;
}

export function AdminFinanceAutoSuspendHarness({
  children,
  scenario = 'ACTIVE',
}: AdminFinanceAutoSuspendHarnessProps) {
  return (
    <div
      data-testid="admin_finance_auto_suspend-harness"
      data-scenario={AdminFinanceAutoSuspendScenarioLabel(scenario)}
      data-scenario-state={scenario}
    >
      {scenario === 'ACTIVE' ? (
        children
      ) : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_auto_suspend-harness-state-empty">
          No records available in this isolated scenario.
        </div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-server-error">
          Simulated server error response (HTTP 500).
        </div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-timeout">
          Simulated request timeout.
        </div>
      ) : (
        <div role="alert" data-testid="admin_finance_auto_suspend-harness-state-unauthorized">
          Simulated unauthorized response (HTTP 401).
        </div>
      )}
    </div>
  );
}
