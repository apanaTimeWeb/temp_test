import type { ReactNode } from 'react';
import { AdminCommunicationNoticesScenarioLabel, type AdminCommunicationNoticesScenario } from '@/app/frontend_admin/admin_communication/communication_notices/tests/harness/bootstrap';
import type { AdminCommunicationNoticesHarnessProps } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminCommunicationNoticesHarness({ children, scenario = 'ACTIVE' }: AdminCommunicationNoticesHarnessProps) {
  return (
    <div data-testid="admin_communication_notices-harness" data-scenario={AdminCommunicationNoticesScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_communication_notices-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_communication_notices-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_communication_notices-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_communication_notices-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminCommunicationNoticesHarnessProps };
