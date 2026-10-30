import type { ReactNode } from 'react';
import { AdminAccountsDailySettlementScenarioLabel, type AdminAccountsDailySettlementScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/tests/harness/bootstrap';
import type { AdminAccountsDailySettlementHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAccountsDailySettlementHarness({ children, scenario = 'ACTIVE' }: AdminAccountsDailySettlementHarnessProps) {
  return (
    <div data-testid="admin_accounts_daily_settlement-harness" data-scenario={AdminAccountsDailySettlementScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_accounts_daily_settlement-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_accounts_daily_settlement-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_accounts_daily_settlement-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_accounts_daily_settlement-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAccountsDailySettlementHarnessProps };
