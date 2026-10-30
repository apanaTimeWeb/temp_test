import type { ReactNode } from 'react';
import { AdminSystemGapFillingScenarioLabel, type AdminSystemGapFillingScenario } from '@/app/frontend_admin/admin_system/system_gap_filling/tests/harness/bootstrap';
import type { AdminSystemGapFillingHarnessProps } from '@/app/frontend_admin/admin_system/system_gap_filling/types/AdminSystemGapFillingComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemGapFillingHarness({ children, scenario = 'ACTIVE' }: AdminSystemGapFillingHarnessProps) {
  return (
    <div data-testid="admin_system_gap_filling-harness" data-scenario={AdminSystemGapFillingScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_gap_filling-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_gap_filling-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_gap_filling-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_gap_filling-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemGapFillingHarnessProps };
