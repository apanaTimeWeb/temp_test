import type { ReactNode } from 'react';
import { AdminSystemSmartIdScenarioLabel, type AdminSystemSmartIdScenario } from '@/app/frontend_admin/admin_system/system_smart_id/tests/harness/bootstrap';
import type { AdminSystemSmartIdHarnessProps } from '@/app/frontend_admin/admin_system/system_smart_id/types/AdminSystemSmartIdComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemSmartIdHarness({ children, scenario = 'ACTIVE' }: AdminSystemSmartIdHarnessProps) {
  return (
    <div data-testid="admin_system_smart_id-harness" data-scenario={AdminSystemSmartIdScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_smart_id-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_smart_id-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_smart_id-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_smart_id-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemSmartIdHarnessProps };
