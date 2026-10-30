import type { ReactNode } from 'react';
import { AdminLockersManagementScenarioLabel, type AdminLockersManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/tests/harness/bootstrap';
import type { AdminLockersManagementHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/types/AdminLockersManagementComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminLockersManagementHarness({ children, scenario = 'ACTIVE' }: AdminLockersManagementHarnessProps) {
  return (
    <div data-testid="admin_lockers_management-harness" data-scenario={AdminLockersManagementScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_lockers_management-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_lockers_management-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_lockers_management-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_lockers_management-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminLockersManagementHarnessProps };
