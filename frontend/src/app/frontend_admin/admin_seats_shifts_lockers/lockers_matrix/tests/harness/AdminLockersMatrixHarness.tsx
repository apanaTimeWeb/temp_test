import type { ReactNode } from 'react';
import { AdminLockersMatrixScenarioLabel, type AdminLockersMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/tests/harness/bootstrap';
import type { AdminLockersMatrixHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminLockersMatrixHarness({ children, scenario = 'ACTIVE' }: AdminLockersMatrixHarnessProps) {
  return (
    <div data-testid="admin_lockers_matrix-harness" data-scenario={AdminLockersMatrixScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_lockers_matrix-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_lockers_matrix-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_lockers_matrix-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_lockers_matrix-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminLockersMatrixHarnessProps };
