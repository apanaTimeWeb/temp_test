import { AdminSettingsProfileScenarioLabel, type AdminSettingsProfileScenario } from '@/app/frontend_admin/admin_settings/settings_profile/tests/harness/bootstrap';
import type { AdminSettingsProfileHarnessProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSettingsProfileHarness({ children, scenario = 'ACTIVE' }: AdminSettingsProfileHarnessProps) {
  return (
    <div data-testid="admin_settings_profile-harness" data-scenario={AdminSettingsProfileScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSettingsProfileHarnessProps };
