import { AdminStaffRolesPermissionsApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/schemas/AdminStaffRolesPermissionsSchema';
import type { z } from 'zod';
import type { AdminStaffRolesPermissionsModule } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';

/** Synthetic permission matrix for deterministic API/UI tests and realistic Library RBAC demo. */
export const ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE: z.infer<typeof AdminStaffRolesPermissionsApiResponseSchema> = [
  {
    module: 'members',
    actions: [
      { label: 'View members & directory', key: 'members.read', roles: { admin: true, manager: true } },
      { label: 'Register new student admission', key: 'members.create', roles: { admin: true, manager: true } },
      { label: 'Edit member details & plans', key: 'members.edit', roles: { admin: true, manager: true } },
      { label: 'Cancel admission & delete records', key: 'members.delete', roles: { admin: true, manager: false } },
      { label: 'Blacklist member across network', key: 'members.blacklist', roles: { admin: true, manager: false } },
      { label: 'Export member directory (Excel/CSV)', key: 'members.export', roles: { admin: true, manager: false } },
    ],
  },
  {
    module: 'seats',
    actions: [
      { label: 'View seats & shift allocation matrix', key: 'seats.read', roles: { admin: true, manager: true } },
      { label: 'Allocate or transfer seat & shift', key: 'seats.allocate', roles: { admin: true, manager: true } },
      { label: 'Block seat for maintenance / repairs', key: 'seats.maintenance', roles: { admin: true, manager: true } },
      { label: 'Assign & manage student lockers', key: 'lockers.allocate', roles: { admin: true, manager: true } },
    ],
  },
  {
    module: 'finance',
    actions: [
      { label: 'Collect student fees & issue receipts', key: 'finance.collect_fees', roles: { admin: true, manager: true } },
      { label: 'Daily counter cash closing handover', key: 'finance.counter_close', roles: { admin: true, manager: true } },
      { label: 'Final cash settlement approval & audit', key: 'finance.settle_cash', roles: { admin: true, manager: false } },
      { label: 'Give fee waivers / special discounts', key: 'finance.discount_waiver', roles: { admin: true, manager: false } },
      { label: 'Initiate fee refund request', key: 'finance.initiate_refund', roles: { admin: true, manager: true } },
      { label: 'Approve refund & cash payout', key: 'finance.approve_refund', roles: { admin: true, manager: false } },
      { label: 'Record petty branch expenses (< ₹2,000)', key: 'finance.petty_expense', roles: { admin: true, manager: true } },
      { label: 'Approve capital expenses & bills', key: 'finance.capital_expense', roles: { admin: true, manager: false } },
      { label: 'View business P&L & financial audit', key: 'finance.view_pnl', roles: { admin: true, manager: false } },
    ],
  },
  {
    module: 'communication',
    actions: [
      { label: 'Broadcast notice to branch students', key: 'communication.branch_notice', roles: { admin: true, manager: true } },
      { label: 'Emergency network-wide WhatsApp broadcast', key: 'communication.emergency_broadcast', roles: { admin: true, manager: false } },
      { label: 'Respond to & resolve student complaints', key: 'communication.resolve_complaint', roles: { admin: true, manager: true } },
      { label: 'Edit message & notification templates', key: 'communication.edit_templates', roles: { admin: true, manager: false } },
    ],
  },
  {
    module: 'staff',
    actions: [
      { label: 'Mark branch support staff daily attendance', key: 'staff.mark_attendance', roles: { admin: true, manager: true } },
      { label: 'View monthly payroll & calculate salary', key: 'staff.view_payroll', roles: { admin: true, manager: false } },
      { label: 'Disburse salary & issue payslips', key: 'staff.disburse_payroll', roles: { admin: true, manager: false } },
      { label: 'Suspend or deactivate branch staff', key: 'staff.suspend', roles: { admin: true, manager: false } },
    ],
  },
  {
    module: 'branches',
    actions: [
      { label: 'View branch layout & facility overview', key: 'branches.view', roles: { admin: true, manager: true } },
      { label: 'Edit branch operational hours & amenities', key: 'branches.edit_timings', roles: { admin: true, manager: false } },
      { label: 'Deactivate / close branch facility', key: 'branches.deactivate', roles: { admin: true, manager: false } },
    ],
  },
];

function clonePermissions(value: readonly AdminStaffRolesPermissionsModule[]): AdminStaffRolesPermissionsModule[] {
  return value.map((module) => ({
    ...module,
    actions: module.actions.map((action) => ({ ...action, roles: { ...action.roles } })),
  }));
}

let demoPermissions = clonePermissions(ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE);

/** Return an isolated view of mutable in-memory preview state. */
export function getAdminStaffRolesPermissionsDemoState(): AdminStaffRolesPermissionsModule[] {
  return clonePermissions(demoPermissions);
}

/** Commit a preview-only state transition for subsequent mounts in this browser session. */
export function saveAdminStaffRolesPermissionsDemoState(value: readonly AdminStaffRolesPermissionsModule[]): void {
  demoPermissions = clonePermissions(value);
}

/** Test-only reset; no browser storage or network state is touched. */
export function resetAdminStaffRolesPermissionsDemoState(): void {
  demoPermissions = clonePermissions(ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE);
}
