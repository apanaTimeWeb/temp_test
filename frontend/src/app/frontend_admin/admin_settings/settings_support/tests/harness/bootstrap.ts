import {
  AdminSettingsSupportScenarios,
  type AdminSettingsSupportScenario,
} from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';

/** Isolated test-scenario vocabulary owned by admin_settings_support. No sibling imports or live API assumptions. */
export { AdminSettingsSupportScenarios, type AdminSettingsSupportScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSettingsSupportScenarioLabel(scenario: AdminSettingsSupportScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
