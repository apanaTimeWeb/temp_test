'use client';
// RESPONSIBILITY: Own state and business logic for Roles, Permissions & User Account Security (Module 04).
import { useState, useCallback, useMemo } from 'react';
import type {
  RoleDefinition,
  UserSecurityAccount,
  RoleCategory,
  ModulePermissionMatrix,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';
import {
  INITIAL_ROLES,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminRolesPermissionsData';
import {
  INITIAL_USER_SECURITY_ACCOUNTS,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminUserSecurityAccountsData';
import {
  createEmptyPermissionMatrix,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminRolesPermissionsMetadata';

export function useSuperadminRolesPermissions() {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [userAccounts, setUserAccounts] = useState<UserSecurityAccount[]>(INITIAL_USER_SECURITY_ACCOUNTS);
  const [roleCategoryFilter, setRoleCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Create New Role
  const createRole = useCallback((data: {
    name: string;
    roleCategory: RoleCategory;
    description: string;
    scope: RoleDefinition['scope'];
    baseTemplateRoleId?: string;
  }): { success: boolean; error?: string; role?: RoleDefinition } => {
    const isDuplicate = roles.some((r) => r.name.trim().toLowerCase() === data.name.trim().toLowerCase());
    if (isDuplicate) {
      return { success: false, error: `Role with name "${data.name}" already exists.` };
    }

    let initialPermissions = createEmptyPermissionMatrix();
    if (data.baseTemplateRoleId) {
      const template = roles.find((r) => r.id === data.baseTemplateRoleId);
      if (template) initialPermissions = JSON.parse(JSON.stringify(template.permissions));
    }

    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: data.name.trim(),
      roleCategory: data.roleCategory,
      description: data.description.trim(),
      scope: data.scope,
      userCount: 0,
      isSystemRole: false,
      temporaryExpiryAllowed: true,
      permissions: initialPermissions,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setRoles((prev) => [...prev, newRole]);
    return { success: true, role: newRole };
  }, [roles]);

  // 2. Duplicate Role (1-click clone)
  const duplicateRole = useCallback((sourceRoleId: string, newRoleName: string): { success: boolean; error?: string; role?: RoleDefinition } => {
    const source = roles.find((r) => r.id === sourceRoleId);
    if (!source) return { success: false, error: 'Source role not found.' };

    const name = newRoleName.trim();
    if (roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, error: `Role "${name}" already exists. Choose a different name.` };
    }

    const cloned: RoleDefinition = {
      ...source,
      id: `role-${Date.now()}`,
      name,
      description: `Cloned from ${source.name}. ${source.description}`,
      isSystemRole: false,
      userCount: 0,
      permissions: JSON.parse(JSON.stringify(source.permissions)),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setRoles((prev) => [...prev, cloned]);
    return { success: true, role: cloned };
  }, [roles]);

  // 3. Update Permissions Matrix
  const updateRolePermissions = useCallback((roleId: string, updatedPermissions: ModulePermissionMatrix) => {
    setRoles((prev) => prev.map((r) => {
      if (r.id !== roleId) return r;
      return { ...r, permissions: updatedPermissions, updatedAt: new Date().toISOString().slice(0, 10) };
    }));
  }, []);

  // 4. Delete Custom Role
  const deleteCustomRole = useCallback((roleId: string): { success: boolean; error?: string } => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return { success: false, error: 'Role not found.' };
    if (target.isSystemRole) return { success: false, error: 'System roles cannot be deleted.' };
    if (target.userCount > 0) return { success: false, error: `Cannot delete role with ${target.userCount} assigned active users. Reassign users first.` };

    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    return { success: true };
  }, [roles]);

  // 5. User Account Security Controls: Lock / Unlock
  const toggleAccountLock = useCallback((userId: string, reason?: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      const nextLocked = !u.isLocked;
      const newLoginLog = {
        id: `lh-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ip: 'Internal Audit',
        device: 'SuperAdmin Console',
        browser: 'Security Gateway',
        status: (nextLocked ? 'FAILED' : 'SUCCESS') as 'FAILED' | 'SUCCESS',
        failureReason: nextLocked ? `Account locked by SuperAdmin: ${reason || 'Security precaution'}` : undefined,
      };
      return {
        ...u,
        isLocked: nextLocked,
        activeSessions: nextLocked ? [] : u.activeSessions, // terminate sessions if locked
        loginHistory: [newLoginLog, ...u.loginHistory],
      };
    }));
  }, []);

  // 6. Trigger Password Reset Link
  const triggerPasswordReset = useCallback((userId: string) => {
    const target = userAccounts.find((u) => u.id === userId);
    return target ? `Password reset invitation link dispatched to ${target.email}` : 'User not found';
  }, [userAccounts]);

  // 7. Reset MFA with Verification
  const resetMfa = useCallback((userId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return { ...u, mfaEnabled: false, mfaVerified: false };
    }));
  }, []);

  // 8. Revoke Specific Session
  const revokeSession = useCallback((userId: string, sessionId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        activeSessions: u.activeSessions.filter((s) => s.sessionId !== sessionId),
      };
    }));
  }, []);

  // 9. Revoke All Active Sessions
  const revokeAllSessions = useCallback((userId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return { ...u, activeSessions: [] };
    }));
  }, []);

  // 10. Grant Temporary Permissions with Expiry
  const grantTemporaryPermission = useCallback((userId: string, durationDays: number, note: string) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);
    const expiryStr = `${expiry.toISOString().slice(0, 10)} (${durationDays} days left - Note: ${note})`;

    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        hasTemporaryPermissions: true,
        temporaryPermissionExpiry: expiryStr,
      };
    }));
  }, []);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchCat = roleCategoryFilter === 'all' || r.roleCategory === roleCategoryFilter;
      const matchSearch = !searchQuery.trim() ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [roles, roleCategoryFilter, searchQuery]);

  return {
    roles,
    filteredRoles,
    userAccounts,
    roleCategoryFilter,
    setRoleCategoryFilter,
    searchQuery,
    setSearchQuery,
    createRole,
    duplicateRole,
    updateRolePermissions,
    deleteCustomRole,
    toggleAccountLock,
    triggerPasswordReset,
    resetMfa,
    revokeSession,
    revokeAllSessions,
    grantTemporaryPermission,
  };
}
