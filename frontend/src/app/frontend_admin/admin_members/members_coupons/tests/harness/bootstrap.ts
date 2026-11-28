import type { AdminMembersCouponsScenario } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';

/** Isolated test-scenario vocabulary owned by admin_members_coupons. No sibling imports or live API assumptions. */
export const AdminMembersCouponsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type { AdminMembersCouponsScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminMembersCouponsScenarioLabel(scenario: AdminMembersCouponsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
