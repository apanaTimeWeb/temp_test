import type { ReactNode } from 'react';
import { AdminCommunicationComplaintsScenarioLabel, type AdminCommunicationComplaintsScenario } from '@/app/frontend_admin/admin_communication/communication_complaints/tests/harness/bootstrap';
import type { AdminCommunicationComplaintsHarnessProps } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminCommunicationComplaintsHarness({ children, scenario = 'ACTIVE' }: AdminCommunicationComplaintsHarnessProps) {
  return (
    <div data-testid="admin_communication_complaints-harness" data-scenario={AdminCommunicationComplaintsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_communication_complaints-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_communication_complaints-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_communication_complaints-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_communication_complaints-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminCommunicationComplaintsHarnessProps };
