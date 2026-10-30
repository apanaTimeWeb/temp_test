import type { ReactNode } from 'react';
import { AdminAssetsMaintenanceScenarioLabel, type AdminAssetsMaintenanceScenario } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/tests/harness/bootstrap';
import type { AdminAssetsMaintenanceHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/types/AdminAssetsMaintenanceTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAssetsMaintenanceHarness({ children, scenario = 'ACTIVE' }: AdminAssetsMaintenanceHarnessProps) {
  return (
    <div data-testid="admin_assets_maintenance-harness" data-scenario={AdminAssetsMaintenanceScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_assets_maintenance-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_assets_maintenance-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_assets_maintenance-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_assets_maintenance-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAssetsMaintenanceHarnessProps };
