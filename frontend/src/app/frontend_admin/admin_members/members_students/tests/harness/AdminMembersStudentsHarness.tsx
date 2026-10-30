import type { ReactNode } from 'react';
import { AdminMembersStudentsScenarioLabel, type AdminMembersStudentsScenario } from '@/app/frontend_admin/admin_members/members_students/tests/harness/bootstrap';
import type { AdminMembersStudentsHarnessProps } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminMembersStudentsHarness({ children, scenario = 'ACTIVE' }: AdminMembersStudentsHarnessProps) {
  return (
    <div data-testid="admin_members_students-harness" data-scenario={AdminMembersStudentsScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminMembersStudentsHarnessProps };
