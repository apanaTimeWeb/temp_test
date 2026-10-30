/** Isolated test-scenario vocabulary owned by admin_staff_roles_permissions. No sibling imports or live API assumptions. */
export const AdminStaffRolesPermissionsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminStaffRolesPermissionsScenario = (typeof AdminStaffRolesPermissionsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminStaffRolesPermissionsScenarioLabel(scenario: AdminStaffRolesPermissionsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
