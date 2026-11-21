// RESPONSIBILITY: Complete TypeScript contract for Role & Permission Management and User Account Security (Module 04 / Section 6).

export type RoleCategory = 'internal_platform' | 'tenant_library' | 'custom_staff';

export type RoleAccessScope = 'platform_wide' | 'tenant_all_branches' | 'single_branch' | 'custom_scope';

export type SystemModuleKey =
  | 'members'
  | 'lockers_management'
  | 'branch_operations'
  | 'seats_shifts'
  | 'finance_billing'
  | 'accounts_expenses'
  | 'staff_management'
  | 'communication'
  | 'reports_analytics'
  | 'system_settings';

export type ActionPermissionKey =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete_archive'
  | 'approve'
  | 'reject'
  | 'export'
  | 'print'
  | 'download'
  | 'manage_settings';

export type ModulePermissionMatrix = Record<SystemModuleKey, Record<ActionPermissionKey, boolean>>;

export interface RoleDefinition {
  id: string;
  name: string;
  roleCategory: RoleCategory;
  description: string;
  scope: RoleAccessScope;
  userCount: number;
  isSystemRole: boolean;
  temporaryExpiryAllowed: boolean;
  permissions: ModulePermissionMatrix;
  updatedAt: string;
}

export interface UserSessionRecord {
  sessionId: string;
  device: string;
  ip: string;
  browser: string;
  location: string;
  startedAt: string;
  isCurrent: boolean;
}

export interface UserLoginAttempt {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
}

export interface UserSecurityAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  roleName: string;
  roleCategory: RoleCategory;
  libraryId?: string;
  libraryName?: string;
  branchId?: string;
  branchName?: string;
  isLocked: boolean;
  mfaEnabled: boolean;
  mfaVerified: boolean;
  lastActive: string;
  hasTemporaryPermissions: boolean;
  temporaryPermissionExpiry?: string;
  activeSessions: UserSessionRecord[];
  loginHistory: UserLoginAttempt[];
}

export interface PermissionActionMeta {
  key: ActionPermissionKey;
  label: string;
  description: string;
}

export interface SystemModuleMeta {
  key: SystemModuleKey;
  label: string;
  category: string;
  description: string;
}
