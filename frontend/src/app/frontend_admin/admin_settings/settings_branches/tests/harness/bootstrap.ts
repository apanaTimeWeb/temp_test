import { ADMIN_SETTINGS_BRANCHES_SCENARIO_RESPONSES } from '@/app/frontend_admin/admin_settings/settings_branches/mocks/scenarios/admin_settings_branches.scenarios';
import { AdminSettingsBranchesScenarios, type AdminSettingsBranchesScenario } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesTypes';

export { ADMIN_SETTINGS_BRANCHES_SCENARIO_RESPONSES, AdminSettingsBranchesScenarios };
export function AdminSettingsBranchesScenarioLabel(s: AdminSettingsBranchesScenario): string {
  return s.toLowerCase();
}
