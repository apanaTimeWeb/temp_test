import type { ReactNode } from 'react';
import { AdminSettingsSupportScenarioLabel, type AdminSettingsSupportScenario } from '@/app/frontend_admin/admin_settings/settings_support/tests/harness/bootstrap';
import type { AdminSettingsSupportHarnessProps } from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSettingsSupportHarness({ children, scenario = 'ACTIVE' }: AdminSettingsSupportHarnessProps) {
  return (
    <div data-testid="admin_settings_support-harness" data-scenario={AdminSettingsSupportScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSettingsSupportHarnessProps };
