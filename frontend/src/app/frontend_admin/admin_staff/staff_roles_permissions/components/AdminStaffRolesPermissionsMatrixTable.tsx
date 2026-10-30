'use client';
// RESPONSIBILITY: AdminStaffRolesPermissionsMatrixTable component owned by admin_staff_roles_permissions; responsibility folder: admin_staff_roles_permissions_matrix_table.

import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { Shield } from 'lucide-react';
import { ADMIN_STAFF_ROLES_PERMISSIONS_ROLES } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/config/admin_staff_roles_permissions.url_config';
import type { AdminStaffRolesPermissionsModule, AdminStaffRolesPermissionsRole } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';
import { resolveAdminStaffRolesPermissionsRoleEntry } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/utils/AdminStaffRolesPermissionsRoleUtils';
import type { AdminStaffRolesPermissionsMatrixTableProps } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';


/** Renders the permission matrix; role field resolution preserves API key casing and surfaces absent fields as unknown. */
export default function AdminStaffRolesPermissionsMatrixTable({ modules, demoMode, onToggle }: AdminStaffRolesPermissionsMatrixTableProps) {
  const t = useTranslations('ADMIN_STAFF_ROLES_PERMISSIONS');
  const roleLabels: Record<AdminStaffRolesPermissionsRole, string> = { manager: t('ROLE_MANAGER') };
  const moduleLabelKeys: Record<string, string> = { members: 'MODULE_MEMBERS', students: 'MODULE_STUDENTS', branches: 'MODULE_BRANCHES', dashboard: 'MODULE_DASHBOARD', reports: 'MODULE_REPORTS' };
  const getModuleLabel = (moduleId: string) => { const key = moduleLabelKeys[moduleId.trim().toLowerCase()]; return key ? t(key) : t('MODULE_UNKNOWN'); };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-highlight">
            <th scope="col" className="p-3 text-left text-text-secondary">{t('COLUMN_PERMISSION_ACTION')}</th>
            {ADMIN_STAFF_ROLES_PERMISSIONS_ROLES.map((role) => (
              <th key={role} scope="col" className="p-3 text-left text-text-secondary">{roleLabels[role]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((module, moduleIndex) => (
            <Fragment key={module.module}>
              <tr>
                <th scope="rowgroup" colSpan={ADMIN_STAFF_ROLES_PERMISSIONS_ROLES.length + 1} className="border-t border-border bg-surface-highlight p-3 text-left text-text-primary">
                  <Shield size={18} strokeWidth={2} className="mr-2 inline text-primary" />
                  {getModuleLabel(module.module)}
                </th>
              </tr>
              {module.actions.map((action, actionIndex) => (
                <tr key={action.key} className="border-t border-border">
                  <th scope="row" className="p-3 text-left font-normal text-text-primary">{action.label}</th>
                  {ADMIN_STAFF_ROLES_PERMISSIONS_ROLES.map((role) => {
                    const entry = resolveAdminStaffRolesPermissionsRoleEntry(action.roles, role);
                    const isEnabled = entry.value === true;
                    const isConfigured = entry.key !== null;
                    const roleLabel = roleLabels[role];
                    const accessibleName = isConfigured
                      ? t(isEnabled ? 'ACCESSIBILITY_DISABLE' : 'ACCESSIBILITY_ENABLE', { action: action.label, role: roleLabel })
                      : t('ACCESSIBILITY_UNKNOWN', { action: action.label, role: roleLabel });
                    return (
                      <td key={role} className="p-3">
                        <button
                          type="button"
                          aria-pressed={isConfigured ? isEnabled : undefined}
                          aria-label={accessibleName}
                          disabled={!demoMode || !isConfigured}
                          onClick={() => { if (entry.key !== null) onToggle(moduleIndex, actionIndex, entry.key); }}
                          className={`min-h-11 min-w-11 rounded-full border border-border disabled:cursor-not-allowed disabled:opacity-60 ${!isConfigured ? 'bg-surface-highlight text-text-disabled' : isEnabled ? 'bg-success text-on-success' : 'bg-surface-highlight text-text-secondary'}`}
                        >
                          <span className="sr-only">{!isConfigured ? t('STATE_UNKNOWN') : isEnabled ? t('STATE_ENABLED') : t('STATE_DISABLED')}</span>
                          <span aria-hidden="true" className="mx-auto block h-3 w-3 rounded-full bg-current" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
