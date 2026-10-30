import type { ReactNode } from 'react';
import { AdminStaffRolesPermissionsScenarioLabel, type AdminStaffRolesPermissionsScenario } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/bootstrap';
import type { AdminStaffRolesPermissionsHarnessProps } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';


/** Standalone scenario harness; it does not mock or imply a live backend contract. */
export function AdminStaffRolesPermissionsHarness({ children, scenario = 'ACTIVE' }: AdminStaffRolesPermissionsHarnessProps) {
  return (
    <div data-testid="admin_staff_roles_permissions-harness" data-scenario={AdminStaffRolesPermissionsScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminStaffRolesPermissionsHarnessProps };
