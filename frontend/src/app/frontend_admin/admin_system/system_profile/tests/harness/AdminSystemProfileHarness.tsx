import type { ReactNode } from 'react';
import { AdminSystemProfileScenarioLabel, type AdminSystemProfileScenario } from '@/app/frontend_admin/admin_system/system_profile/tests/harness/bootstrap';
import type { AdminSystemProfileHarnessProps } from '@/app/frontend_admin/admin_system/system_profile/types/AdminSystemProfileComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemProfileHarness({ children, scenario = 'ACTIVE' }: AdminSystemProfileHarnessProps) {
  return (
    <div data-testid="admin_system_profile-harness" data-scenario={AdminSystemProfileScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_profile-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_profile-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_profile-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_profile-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemProfileHarnessProps };
