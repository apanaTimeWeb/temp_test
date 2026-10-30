import type { ReactNode } from 'react';
import { AdminSettingsSecurityScenarioLabel, type AdminSettingsSecurityScenario } from '@/app/frontend_admin/admin_settings/settings_security/tests/harness/bootstrap';
import type { AdminSettingsSecurityHarnessProps } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSettingsSecurityHarness({ children, scenario = 'ACTIVE' }: AdminSettingsSecurityHarnessProps) {
  return (
    <div data-testid="admin_settings_security-harness" data-scenario={AdminSettingsSecurityScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSettingsSecurityHarnessProps };
