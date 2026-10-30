import type { ReactNode } from 'react';
import { AdminSystemOfflineScenarioLabel, type AdminSystemOfflineScenario } from '@/app/frontend_admin/admin_system/system_offline/tests/harness/bootstrap';
import type { AdminSystemOfflineHarnessProps } from '@/app/frontend_admin/admin_system/system_offline/types/AdminSystemOfflineComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemOfflineHarness({ children, scenario = 'ACTIVE' }: AdminSystemOfflineHarnessProps) {
  return (
    <div data-testid="admin_system_offline-harness" data-scenario={AdminSystemOfflineScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_offline-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_offline-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_offline-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_offline-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemOfflineHarnessProps };
