/** Test-only bootstrap, state labels and standalone React harness for canonical profile scenarios. */
import {
  AdminSettingsProfileScenarios,
  type AdminSettingsProfileScenario,
} from '@/app/frontend_admin/admin_settings/settings_profile/mocks/scenarios/admin_settings_profile.scenarios';

export { AdminSettingsProfileScenarios };
export type { AdminSettingsProfileScenario };

export function AdminSettingsProfileScenarioLabel(scenario: AdminSettingsProfileScenario): string {
  const labels: Record<AdminSettingsProfileScenario, string> = {
    ACTIVE_RECORDS: 'active-records',
    EMPTY_DATA: 'empty-data',
    SERVER_500_ERROR: 'server-error',
    NETWORK_TIMEOUT: 'timeout',
    UNAUTHORIZED_401: 'unauthorized',
    FORBIDDEN_403: 'forbidden',
    NETWORK_ERROR: 'network-error',
    INVALID_RESPONSE: 'invalid-response',
  };
  return labels[scenario];
}

