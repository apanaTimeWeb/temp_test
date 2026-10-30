import type { ReactNode } from 'react';
import { AdminStaffDirectoryScenarioLabel, type AdminStaffDirectoryScenario } from '@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap';
import type { AdminStaffDirectoryHarnessProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';


/** Standalone scenario harness; it does not mock or imply a live backend contract. */
export function AdminStaffDirectoryHarness({ children, scenario = 'ACTIVE' }: AdminStaffDirectoryHarnessProps) {
  return (
    <div data-testid="admin_staff_directory-harness" data-scenario={AdminStaffDirectoryScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminStaffDirectoryHarnessProps };
