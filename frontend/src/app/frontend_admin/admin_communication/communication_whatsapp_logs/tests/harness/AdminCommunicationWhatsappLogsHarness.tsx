import type { ReactNode } from 'react';
import { AdminCommunicationWhatsappLogsScenarioLabel, type AdminCommunicationWhatsappLogsScenario } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/tests/harness/bootstrap';
import type { AdminCommunicationWhatsappLogsHarnessProps } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminCommunicationWhatsappLogsHarness({ children, scenario = 'ACTIVE' }: AdminCommunicationWhatsappLogsHarnessProps) {
  return (
    <div data-testid="admin_communication_whatsapp_logs-harness" data-scenario={AdminCommunicationWhatsappLogsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_communication_whatsapp_logs-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_communication_whatsapp_logs-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_communication_whatsapp_logs-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_communication_whatsapp_logs-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminCommunicationWhatsappLogsHarnessProps };
