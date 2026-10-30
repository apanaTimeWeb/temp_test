import type { ReactNode } from 'react';
import { AdminFinanceTrustScoreScenarioLabel, type AdminFinanceTrustScoreScenario } from '@/app/frontend_admin/admin_finance/finance_trust_score/tests/harness/bootstrap';
import type { AdminFinanceTrustScoreHarnessProps } from '@/app/frontend_admin/admin_finance/finance_trust_score/types/AdminFinanceTrustScoreComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminFinanceTrustScoreHarness({ children, scenario = 'ACTIVE' }: AdminFinanceTrustScoreHarnessProps) {
  return (
    <div data-testid="admin_finance_trust_score-harness" data-scenario={AdminFinanceTrustScoreScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_finance_trust_score-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_finance_trust_score-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_finance_trust_score-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_finance_trust_score-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminFinanceTrustScoreHarnessProps };
