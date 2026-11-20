// RESPONSIBILITY: Metadata definitions and matrix builders for System Modules and Actions.
import type {
  SystemModuleMeta,
  PermissionActionMeta,
  ModulePermissionMatrix,
  SystemModuleKey,
  ActionPermissionKey,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

export const PERMISSION_ACTIONS: PermissionActionMeta[] = [
  { key: 'view', label: 'View', description: 'Read records, profiles & metrics' },
  { key: 'create', label: 'Create', description: 'Add new entries, members or assets' },
  { key: 'edit', label: 'Edit', description: 'Update existing details & statuses' },
  { key: 'delete_archive', label: 'Delete / Archive', description: 'Soft-delete or archive entries' },
  { key: 'approve', label: 'Approve', description: 'Approve requests, refunds or plans' },
  { key: 'reject', label: 'Reject', description: 'Decline requests with reasons' },
  { key: 'export', label: 'Export', description: 'Export records to CSV / Excel' },
  { key: 'print', label: 'Print', description: 'Print receipts, ID cards & statements' },
  { key: 'download', label: 'Download', description: 'Download offline docs & backups' },
  { key: 'manage_settings', label: 'Manage Settings', description: 'Configure module rules & quotas' },
];

export const SYSTEM_MODULES: SystemModuleMeta[] = [
  { key: 'members', label: 'Members & Students', category: 'Desk Operations', description: 'Registration, seat admissions, verification & profiles' },
  { key: 'books_catalog', label: 'Books & Shared Catalog', category: 'Library Asset', description: 'Central titles catalog, physical branch copies, issue & returns' },
  { key: 'branch_operations', label: 'Branch Operations', category: 'Branch Desk', description: 'Shift timings, entry QR scans, lockers & daily attendance' },
  { key: 'seats_shifts', label: 'Seats & Shifts Matrix', category: 'Branch Desk', description: 'Visual floor map, seat allocation & reserved desks' },
  { key: 'finance_billing', label: 'Finance & Subscriptions', category: 'Financial Control', description: 'SaaS tenant subscriptions, invoice collection & receipts' },
  { key: 'accounts_expenses', label: 'Accounts & Petty Cash', category: 'Financial Control', description: 'Daily settlement drawer, branch expenses & petty cash log' },
  { key: 'staff_management', label: 'Staff & Admin Management', category: 'Administration', description: 'Branch staff invites, attendance desk & duties' },
  { key: 'communication', label: 'Communication & Notices', category: 'Outreach', description: 'Automated SMS, WhatsApp announcements & broadcast notices' },
  { key: 'reports_analytics', label: 'Reports & Analytics', category: 'Intelligence', description: 'Branch analytics, occupancy reports & revenue summaries' },
  { key: 'system_settings', label: 'System & Branch Settings', category: 'Administration', description: 'Global platform settings, tenant quotas & security policy' },
];

export function createEmptyPermissionMatrix(): ModulePermissionMatrix {
  const allModules: SystemModuleKey[] = [
    'members', 'books_catalog', 'branch_operations', 'seats_shifts', 'finance_billing',
    'accounts_expenses', 'staff_management', 'communication', 'reports_analytics', 'system_settings',
  ];
  const allActions: ActionPermissionKey[] = [
    'view', 'create', 'edit', 'delete_archive', 'approve', 'reject', 'export', 'print', 'download', 'manage_settings',
  ];
  const matrix = {} as ModulePermissionMatrix;
  for (const m of allModules) {
    matrix[m] = {} as Record<ActionPermissionKey, boolean>;
    for (const a of allActions) matrix[m][a] = false;
  }
  return matrix;
}

export function buildRoleMatrix(overrides: Partial<Record<SystemModuleKey, Partial<Record<ActionPermissionKey, boolean>>>>): ModulePermissionMatrix {
  const base = createEmptyPermissionMatrix();
  for (const [mod, acts] of Object.entries(overrides)) {
    const mKey = mod as SystemModuleKey;
    if (base[mKey]) {
      for (const [act, val] of Object.entries(acts || {})) {
        base[mKey][act as ActionPermissionKey] = !!val;
      }
    }
  }
  return base;
}
