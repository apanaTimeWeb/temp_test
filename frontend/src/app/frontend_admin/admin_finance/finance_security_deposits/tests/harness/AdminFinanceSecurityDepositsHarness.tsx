import type { ReactNode } from 'react';
import {
  AdminFinanceSecurityDepositsScenarioLabel,
  type AdminFinanceSecurityDepositsScenario,
} from './bootstrap';

export interface AdminFinanceSecurityDepositsHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceSecurityDepositsScenario;
}

export function AdminFinanceSecurityDepositsHarness({
  children,
  scenario = 'ACTIVE',
}: AdminFinanceSecurityDepositsHarnessProps) {
  return (
    <div
      data-testid="admin_finance_security_deposits-harness"
      data-scenario={AdminFinanceSecurityDepositsScenarioLabel(scenario)}
      data-scenario-state={scenario}
    >
      {scenario === 'ACTIVE' ? (
        children
      ) : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_security_deposits-harness-state-empty">
          No records available in this isolated scenario.
        </div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_security_deposits-harness-state-server-error">
          Simulated server error response (HTTP 500).
        </div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_security_deposits-harness-state-timeout">
          Simulated request timeout.
        </div>
      ) : (
        <div role="alert" data-testid="admin_finance_security_deposits-harness-state-unauthorized">
          Simulated unauthorized response (HTTP 401).
        </div>
      )}
    </div>
  );
}
