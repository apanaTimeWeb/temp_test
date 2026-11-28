import {
  AdminNavigationSidebarScenarios,
  type AdminNavigationSidebarScenario,
} from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarComponentTypes';

/** Isolated test-scenario vocabulary owned by admin_navigation_sidebar. No sibling imports or live API assumptions. */
export { AdminNavigationSidebarScenarios, type AdminNavigationSidebarScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminNavigationSidebarScenarioLabel(scenario: AdminNavigationSidebarScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
