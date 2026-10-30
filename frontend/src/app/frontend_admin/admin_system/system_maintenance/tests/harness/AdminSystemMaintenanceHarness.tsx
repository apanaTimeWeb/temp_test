import type { ReactNode } from 'react';
import { AdminSystemMaintenanceScenarioLabel, type AdminSystemMaintenanceScenario } from '@/app/frontend_admin/admin_system/system_maintenance/tests/harness/bootstrap';
import type { AdminSystemMaintenanceHarnessProps } from '@/app/frontend_admin/admin_system/system_maintenance/types/AdminSystemMaintenanceComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemMaintenanceHarness({ children, scenario = 'ACTIVE' }: AdminSystemMaintenanceHarnessProps) {
  return (
    <div data-testid="admin_system_maintenance-harness" data-scenario={AdminSystemMaintenanceScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_maintenance-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_maintenance-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_maintenance-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_maintenance-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemMaintenanceHarnessProps };
