import type { ReactNode } from 'react';
import { AdminShiftsManagementScenarioLabel, type AdminShiftsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/tests/harness/bootstrap';
import type { AdminShiftsManagementHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminShiftsManagementHarness({ children, scenario = 'ACTIVE' }: AdminShiftsManagementHarnessProps) {
  return (
    <div data-testid="admin_shifts_management-harness" data-scenario={AdminShiftsManagementScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_shifts_management-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_shifts_management-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_shifts_management-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_shifts_management-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminShiftsManagementHarnessProps };
