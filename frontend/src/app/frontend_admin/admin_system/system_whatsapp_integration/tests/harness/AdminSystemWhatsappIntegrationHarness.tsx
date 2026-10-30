import type { ReactNode } from 'react';
import { AdminSystemWhatsappIntegrationScenarioLabel, type AdminSystemWhatsappIntegrationScenario } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/tests/harness/bootstrap';
import type { AdminSystemWhatsappIntegrationHarnessProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemWhatsappIntegrationHarness({ children, scenario = 'ACTIVE' }: AdminSystemWhatsappIntegrationHarnessProps) {
  return (
    <div data-testid="admin_system_whatsapp_integration-harness" data-scenario={AdminSystemWhatsappIntegrationScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_whatsapp_integration-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_whatsapp_integration-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_whatsapp_integration-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_whatsapp_integration-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemWhatsappIntegrationHarnessProps };
