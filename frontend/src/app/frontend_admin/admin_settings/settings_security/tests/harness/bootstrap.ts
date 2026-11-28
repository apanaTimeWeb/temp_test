import {
  AdminSettingsSecurityScenarios,
  type AdminSettingsSecurityScenario,
} from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';

/** Isolated test-scenario vocabulary owned by admin_settings_security. No sibling imports or live API assumptions. */
export { AdminSettingsSecurityScenarios, type AdminSettingsSecurityScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSettingsSecurityScenarioLabel(scenario: AdminSettingsSecurityScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
