import type { ReactNode } from 'react';
import { AdminSystemBrandingScenarioLabel, type AdminSystemBrandingScenario } from '@/app/frontend_admin/admin_system/system_branding/tests/harness/bootstrap';
import type { AdminSystemBrandingHarnessProps } from '@/app/frontend_admin/admin_system/system_branding/types/AdminSystemBrandingComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemBrandingHarness({ children, scenario = 'ACTIVE' }: AdminSystemBrandingHarnessProps) {
  return (
    <div data-testid="admin_system_branding-harness" data-scenario={AdminSystemBrandingScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_branding-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_branding-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_branding-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_branding-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemBrandingHarnessProps };
