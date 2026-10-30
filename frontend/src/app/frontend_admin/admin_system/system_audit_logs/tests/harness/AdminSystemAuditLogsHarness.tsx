import type { ReactNode } from 'react';
import { AdminSystemAuditLogsScenarioLabel, type AdminSystemAuditLogsScenario } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/bootstrap';
import type { AdminSystemAuditLogsHarnessProps } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSystemAuditLogsHarness({ children, scenario = 'ACTIVE' }: AdminSystemAuditLogsHarnessProps) {
  return (
    <div data-testid="admin_system_audit_logs-harness" data-scenario={AdminSystemAuditLogsScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSystemAuditLogsHarnessProps };
