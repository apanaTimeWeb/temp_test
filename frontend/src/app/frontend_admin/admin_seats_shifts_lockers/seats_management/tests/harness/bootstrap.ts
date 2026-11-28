import type { AdminSeatsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';

/** Isolated test-scenario vocabulary owned by admin_seats_management. No sibling imports or live API assumptions. */
export const AdminSeatsManagementScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type { AdminSeatsManagementScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminSeatsManagementScenarioLabel(scenario: AdminSeatsManagementScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
