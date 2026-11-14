// FLOW: Feature preview/test -> superadmin_users/users_roles_permissions/mocks/fixtures/SuperadminUsersRolesPermissionsMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: provide the local, illustrative permission-matrix preview for this read-only leaf. */
import type { SuperadminRolePermissionRow } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminUsersRolesPermissionsTypes';

/** Illustrative UI data only; these flags are not server authorization decisions. */
export const SUPERADMIN_USERS_ROLE_PERMISSIONS: SuperadminRolePermissionRow[] = [
  { module: 'Dashboard & Analytics', superadmin: true, admin: true, manager: true },
  { module: 'Library Management', superadmin: true, admin: false, manager: false },
  { module: 'Seat & Shift Allocations', superadmin: true, admin: true, manager: true },
  { module: 'Billing & Subscriptions', superadmin: true, admin: false, manager: false },
  { module: 'User Access Control', superadmin: true, admin: false, manager: false },
  { module: 'Student CRM', superadmin: true, admin: true, manager: true },
];
