import type { AdminStaffRolesPermissionsRole } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/config/admin_staff_roles_permissions.url_config';
import type { AdminStaffRolesPermissionsScenario } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** API role keys remain string-keyed because the supplied endpoint schema permits role names beyond this view's configured role. */
export interface AdminStaffRolesPermissionsAction {
  label: string;
  key: string;
  roles: Record<string, boolean>;
}

export interface AdminStaffRolesPermissionsModule {
  module: string;
  actions: AdminStaffRolesPermissionsAction[];
}

export type { AdminStaffRolesPermissionsRole };

export interface AdminStaffRolesPermissionsMatrixTableProps {
  modules: AdminStaffRolesPermissionsModule[];
  demoMode: boolean;
  onToggle: (moduleIndex: number, actionIndex: number, roleKey: string) => void;
}

export interface AdminStaffRolesPermissionsHarnessProps {
  children: ReactNode;
  scenario?: AdminStaffRolesPermissionsScenario;
}
