import { ADMIN_SETTINGS_BRANCHES_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_branches/mocks/fixtures/admin_settings_branches.fixtures';
import type { AdminSettingsBranchesScenario } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesTypes';

export const ADMIN_SETTINGS_BRANCHES_SCENARIO_RESPONSES: Record<
  AdminSettingsBranchesScenario,
  { status: number; dataCount: number }
> = {
  ACTIVE_RECORDS: { status: 200, dataCount: ADMIN_SETTINGS_BRANCHES_FIXTURES.length },
  EMPTY_DATA: { status: 200, dataCount: 0 },
  SERVER_500_ERROR: { status: 500, dataCount: 0 },
  NETWORK_TIMEOUT: { status: 408, dataCount: 0 },
  UNAUTHORIZED_401: { status: 401, dataCount: 0 },
  FORBIDDEN_403: { status: 403, dataCount: 0 },
  NETWORK_ERROR: { status: 0, dataCount: 0 },
  INVALID_RESPONSE: { status: 422, dataCount: 0 },
};
