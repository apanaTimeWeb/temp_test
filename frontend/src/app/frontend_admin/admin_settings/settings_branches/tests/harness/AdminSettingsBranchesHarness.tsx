import type { ReactNode } from 'react';
import { AdminSettingsBranchesScenarioLabel, type AdminSettingsBranchesScenario } from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/bootstrap';
import type { AdminSettingsBranchesHarnessProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSettingsBranchesHarness({ children, scenario = 'ACTIVE' }: AdminSettingsBranchesHarnessProps) {
  return (
    <div data-testid="admin_settings_branches-harness" data-scenario={AdminSettingsBranchesScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSettingsBranchesHarnessProps };
