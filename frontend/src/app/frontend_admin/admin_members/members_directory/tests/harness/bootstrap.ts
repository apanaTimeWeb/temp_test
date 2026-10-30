/** Test harness re-exports the canonical module-owned UI scenario vocabulary. */
import type { AdminMembersDirectoryHarnessProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import { AdminMembersDirectoryScenarios, type AdminMembersDirectoryScenario } from '@/app/frontend_admin/admin_members/members_directory/mocks/scenarios/admin_members_directory.scenarios';
export { AdminMembersDirectoryScenarios };
export type { AdminMembersDirectoryScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersDirectoryScenarioLabel(scenario: AdminMembersDirectoryScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}


/** Test-only scenario harness; preserves all accessible failure, empty, and retry states. */
