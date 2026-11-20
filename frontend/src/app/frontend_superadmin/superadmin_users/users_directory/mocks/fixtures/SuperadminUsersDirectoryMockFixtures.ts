// FLOW: Feature preview/test -> superadmin_users/users_directory/mocks/fixtures/SuperadminUsersDirectoryMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Users Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type { SuperadminRolePermissionRow, SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';

export const SUPERADMIN_USERS_INITIAL_USERS: SuperadminUserData[] = [
  { id: '1', name: 'Sample User A', username: 'sample.a', email: 'sample.a@example.invalid', phone: '+91 98765 43210', role: 'SuperAdmin', branch: 'Global', status: 'Active', lastLogin: '2026-09-30 09:30 AM', twoFactor: true },
  { id: '2', name: 'Sample User B', username: 'sample.b', email: 'sample.b@example.invalid', phone: '+91 98123 45678', role: 'Admin', branch: 'Sample Tenant A', status: 'Active', lastLogin: '2026-09-29 11:15 AM', twoFactor: false },
  { id: '3', name: 'Sample User C', username: 'sample.c', email: 'sample.c@example.invalid', phone: '+91 98987 65432', role: 'Manager', branch: 'Sample Tenant A', status: 'Suspended', lastLogin: '2026-08-28 04:20 PM', twoFactor: false },
  { id: '4', name: 'Sample User D', username: 'sample.d', email: 'sample.d@example.invalid', phone: '+91 97112 33445', role: 'Admin', branch: 'Sample Tenant B', status: 'Active', lastLogin: '2026-09-30 08:00 AM', twoFactor: true },
];

export const SUPERADMIN_USERS_ROLE_PERMISSIONS: SuperadminRolePermissionRow[] = [
  { module: 'Dashboard & Analytics', superadmin: true, admin: true, manager: true },
  { module: 'Library Management', superadmin: true, admin: false, manager: false },
  { module: 'Seat & Shift Allocations', superadmin: true, admin: true, manager: true },
  { module: 'Billing & Subscriptions', superadmin: true, admin: false, manager: false },
  { module: 'User Access Control', superadmin: true, admin: false, manager: false },
  { module: 'Student CRM', superadmin: true, admin: true, manager: true },
];
