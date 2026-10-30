import type { ReactNode } from 'react';
import { AdminSeatsManagementScenarioLabel, type AdminSeatsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/tests/harness/bootstrap';
import type { AdminSeatsManagementHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSeatsManagementHarness({ children, scenario = 'ACTIVE' }: AdminSeatsManagementHarnessProps) {
  return (
    <div data-testid="admin_seats_management-harness" data-scenario={AdminSeatsManagementScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_seats_management-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_seats_management-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_seats_management-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_seats_management-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSeatsManagementHarnessProps };
