import type { ReactNode } from 'react';
import { AdminShiftsMigrationScenarioLabel, type AdminShiftsMigrationScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/tests/harness/bootstrap';
import type { AdminShiftsMigrationHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/types/AdminShiftsMigrationComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminShiftsMigrationHarness({ children, scenario = 'ACTIVE' }: AdminShiftsMigrationHarnessProps) {
  return (
    <div data-testid="admin_shifts_migration-harness" data-scenario={AdminShiftsMigrationScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_shifts_migration-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_shifts_migration-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_shifts_migration-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_shifts_migration-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminShiftsMigrationHarnessProps };
