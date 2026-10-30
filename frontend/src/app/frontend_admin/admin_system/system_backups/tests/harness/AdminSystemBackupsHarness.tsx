import type { ReactNode } from 'react';
import { AdminSystemBackupsScenarioLabel, type AdminSystemBackupsScenario } from '@/app/frontend_admin/admin_system/system_backups/tests/harness/bootstrap';
import type { AdminSystemBackupsHarnessProps } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemBackupsHarness({ children, scenario = 'ACTIVE' }: AdminSystemBackupsHarnessProps) {
  return (
    <div data-testid="admin_system_backups-harness" data-scenario={AdminSystemBackupsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_backups-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_backups-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_backups-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_backups-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemBackupsHarnessProps };
