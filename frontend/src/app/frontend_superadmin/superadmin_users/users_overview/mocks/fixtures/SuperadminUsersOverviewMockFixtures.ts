// FLOW: Feature preview/test -> superadmin_users/users_overview/mocks/fixtures/SuperadminUsersOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Users Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type { SuperadminRolePermissionRow, SuperadminSessionData, SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_overview/types/SuperadminUsersOverviewTypes';

export const SUPERADMIN_USERS_INITIAL_USERS: SuperadminUserData[] = [
  { id: '1', name: 'Sample User A', username: 'sample.a', email: 'sample.a@example.invalid', role: 'SuperAdmin', branch: 'Global', status: 'Active', lastLogin: '2026-09-30 09:30 AM', twoFactor: true },
  { id: '2', name: 'Sample User B', username: 'sample.b', email: 'sample.b@example.invalid', role: 'Admin', branch: 'Sample Tenant A', status: 'Active', lastLogin: '2026-09-29 11:15 AM', twoFactor: false },
  { id: '3', name: 'Sample User C', username: 'sample.c', email: 'sample.c@example.invalid', role: 'Manager', branch: 'Sample Tenant A', status: 'Suspended', lastLogin: '2026-08-28 04:20 PM', twoFactor: false },
  { id: '4', name: 'Sample User D', username: 'sample.d', email: 'sample.d@example.invalid', role: 'Admin', branch: 'Sample Tenant B', status: 'Active', lastLogin: '2026-09-30 08:00 AM', twoFactor: true },
];

export const SUPERADMIN_USERS_INITIAL_SESSIONS: SuperadminSessionData[] = [
  { id: 's1', user: 'Sample User A', device: 'MacBook Pro - Chrome', ip: '192.0.2.10', location: 'Example Region A', lastActive: 'Just now', status: 'Active' },
  { id: 's2', user: 'Sample User A', device: 'iPhone 14 Pro - Safari', ip: '192.0.2.11', location: 'Example Region A', lastActive: '2 hours ago', status: 'Active' },
  { id: 's3', user: 'Sample User B', device: 'Windows 11 - Edge', ip: '198.51.100.12', location: 'Example Region B', lastActive: '10 mins ago', status: 'Active' },
  { id: 's4', user: 'Sample User C', device: 'Unknown Device', ip: '203.0.113.13', location: 'Example Region C', lastActive: '1 month ago', status: 'Revoked' },
];

export const SUPERADMIN_USERS_ROLE_PERMISSIONS: SuperadminRolePermissionRow[] = [
  { module: 'Dashboard & Analytics', superadmin: true, admin: true, manager: true },
  { module: 'Library Management', superadmin: true, admin: false, manager: false },
  { module: 'Seat & Shift Allocations', superadmin: true, admin: true, manager: true },
  { module: 'Billing & Subscriptions', superadmin: true, admin: false, manager: false },
  { module: 'User Access Control', superadmin: true, admin: false, manager: false },
  { module: 'Student CRM', superadmin: true, admin: true, manager: true },
];
