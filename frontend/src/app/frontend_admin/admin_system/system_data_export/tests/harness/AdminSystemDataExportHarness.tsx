import type { ReactNode } from 'react';
import { AdminSystemDataExportScenarioLabel, type AdminSystemDataExportScenario } from '@/app/frontend_admin/admin_system/system_data_export/tests/harness/bootstrap';
import type { AdminSystemDataExportHarnessProps } from '@/app/frontend_admin/admin_system/system_data_export/types/AdminSystemDataExportComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemDataExportHarness({ children, scenario = 'ACTIVE' }: AdminSystemDataExportHarnessProps) {
  return (
    <div data-testid="admin_system_data_export-harness" data-scenario={AdminSystemDataExportScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_data_export-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_data_export-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_data_export-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_data_export-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemDataExportHarnessProps };
