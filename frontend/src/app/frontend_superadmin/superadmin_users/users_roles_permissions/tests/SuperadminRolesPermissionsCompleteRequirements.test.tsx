import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useSuperadminRolesPermissions } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/hooks/useSuperadminRolesPermissions';
import SuperadminRolesOverviewHeader from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesOverviewHeader';
import SuperadminRolesKpiCards from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesKpiCards';
import SuperadminRolesListTable from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesListTable';
import SuperadminRolePermissionEditorModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolePermissionEditorModal';
import SuperadminRoleCreateModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRoleCreateModal';
import SuperadminUserSecurityAuditModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUserSecurityAuditModal';
import { INITIAL_ROLES } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminRolesPermissionsData';
import { INITIAL_USER_SECURITY_ACCOUNTS } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminUserSecurityAccountsData';

describe('Module 04: Admin, Manager aur Staff Permission Management', () => {
  describe('useSuperadminRolesPermissions Hook', () => {
    it('initializes with all 10 roles across platform internal and tenant levels', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      expect(result.current.roles.length).toBe(10);

      const roleNames = result.current.roles.map((r) => r.name);
      expect(roleNames).toContain('SuperAdmin');
      expect(roleNames).toContain('Support Admin');
      expect(roleNames).toContain('Finance Admin');
      expect(roleNames).toContain('Library Admin');
      expect(roleNames).toContain('Branch Manager');
      expect(roleNames).toContain('Librarian');
      expect(roleNames).toContain('Accountant');
      expect(roleNames).toContain('Receptionist');
      expect(roleNames).toContain('Communication Staff');
      expect(roleNames).toContain('Custom Staff Role');
    });

    it('enforces duplicate role name check when creating a new role', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      act(() => {
        const res = result.current.createRole({
          name: 'SuperAdmin',
          roleCategory: 'internal_platform',
          description: 'Duplicate',
          scope: 'platform_wide',
        });
        expect(res.success).toBe(false);
        expect(res.error).toContain('already exists');
      });
    });

    it('duplicates an existing role preserving its permissions matrix', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      const branchManager = result.current.roles.find((r) => r.name === 'Branch Manager')!;

      act(() => {
        const res = result.current.duplicateRole(branchManager.id, 'Branch Manager Night Shift');
        expect(res.success).toBe(true);
        expect(res.role?.name).toBe('Branch Manager Night Shift');
        expect(res.role?.isSystemRole).toBe(false);
      });

      const cloned = result.current.roles.find((r) => r.name === 'Branch Manager Night Shift');
      expect(cloned).toBeDefined();
      expect(cloned?.permissions.members.view).toBe(true);
      expect(cloned?.permissions.accounts_expenses.view).toBe(false); // Matches Branch Manager preset
    });

    it('updates module action-level permissions for a role', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      const targetRole = result.current.roles[0];
      const updatedMatrix = JSON.parse(JSON.stringify(targetRole.permissions));
      updatedMatrix.finance_billing.create = false;

      act(() => {
        result.current.updateRolePermissions(targetRole.id, updatedMatrix);
      });

      const updated = result.current.roles.find((r) => r.id === targetRole.id);
      expect(updated?.permissions.finance_billing.create).toBe(false);
    });

    it('locks user account and terminates all active sessions', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      const activeUser = result.current.userAccounts.find((u) => !u.isLocked && u.activeSessions.length > 0)!;

      act(() => {
        result.current.toggleAccountLock(activeUser.id, 'Suspicious IP access detected');
      });

      const lockedUser = result.current.userAccounts.find((u) => u.id === activeUser.id);
      expect(lockedUser?.isLocked).toBe(true);
      expect(lockedUser?.activeSessions.length).toBe(0); // All sessions terminated
      expect(lockedUser?.loginHistory[0].status).toBe('FAILED');
    });

    it('revokes an individual active session and all sessions', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      const targetUser = result.current.userAccounts.find((u) => u.activeSessions.length >= 2)!;
      const sessionToRevoke = targetUser.activeSessions[0].sessionId;

      act(() => {
        result.current.revokeSession(targetUser.id, sessionToRevoke);
      });

      let updated = result.current.userAccounts.find((u) => u.id === targetUser.id)!;
      expect(updated.activeSessions.some((s) => s.sessionId === sessionToRevoke)).toBe(false);

      act(() => {
        result.current.revokeAllSessions(targetUser.id);
      });

      updated = result.current.userAccounts.find((u) => u.id === targetUser.id)!;
      expect(updated.activeSessions.length).toBe(0);
    });

    it('grants temporary elevated permissions with expiry calculation', () => {
      const { result } = renderHook(() => useSuperadminRolesPermissions());
      const user = result.current.userAccounts[0];

      act(() => {
        result.current.grantTemporaryPermission(user.id, 14, 'Interim Branch Lead');
      });

      const updated = result.current.userAccounts.find((u) => u.id === user.id);
      expect(updated?.hasTemporaryPermissions).toBe(true);
      expect(updated?.temporaryPermissionExpiry).toContain('14 days left');
    });
  });

  describe('UI Presentation & Interaction Controls', () => {
    it('renders Header with title and tab triggers', () => {
      const setTab = vi.fn();
      const onCreate = vi.fn();

      render(
        <SuperadminRolesOverviewHeader
          activeTab="roles_matrix"
          setActiveTab={setTab}
          onCreateRole={onCreate}
          totalRolesCount={10}
          totalUsersCount={4}
        />
      );

      expect(screen.getByText(/Admin, Manager & Staff Permission Management/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create New Role/i })).toBeInTheDocument();

      const secTab = screen.getByRole('button', { name: /User Security & Sessions/i });
      fireEvent.click(secTab);
      expect(setTab).toHaveBeenCalledWith('user_security');
    });

    it('renders KPI Cards with breakdown of platform vs branch roles', () => {
      render(
        <SuperadminRolesKpiCards
          roles={INITIAL_ROLES}
          userAccounts={INITIAL_USER_SECURITY_ACCOUNTS}
        />
      );

      expect(screen.getByText('Total Roles')).toBeInTheDocument();
      expect(screen.getByText('Platform Internal')).toBeInTheDocument();
      expect(screen.getByText('Tenant & Branch')).toBeInTheDocument();
      expect(screen.getByText('Staff Accounts')).toBeInTheDocument();
      expect(screen.getByText('Security Locks')).toBeInTheDocument();
    });

    it('renders RolesListTable with single-line horizontal actions and search', () => {
      const onEdit = vi.fn();
      const onDuplicate = vi.fn();
      const onDelete = vi.fn();

      render(
        <SuperadminRolesListTable
          roles={INITIAL_ROLES}
          searchQuery=""
          setSearchQuery={vi.fn()}
          categoryFilter="all"
          setCategoryFilter={vi.fn()}
          onEditPermissions={onEdit}
          onDuplicateRole={onDuplicate}
          onDeleteRole={onDelete}
        />
      );

      expect(screen.getByText('SuperAdmin')).toBeInTheDocument();
      expect(screen.getByText('Branch Manager')).toBeInTheDocument();
      expect(screen.getByText('Accountant')).toBeInTheDocument();

      const permButtons = screen.getAllByRole('button', { name: /Permissions/i });
      expect(permButtons.length).toBeGreaterThan(0);
      fireEvent.click(permButtons[0]);
      expect(onEdit).toHaveBeenCalledWith(INITIAL_ROLES[0]);
    });

    it('renders PermissionEditorModal with 10 modules and 10 action toggles', () => {
      const onSave = vi.fn();
      const onClose = vi.fn();

      render(
        <SuperadminRolePermissionEditorModal
          role={INITIAL_ROLES[0]}
          onClose={onClose}
          onSave={onSave}
        />
      );

      expect(screen.getByText(/Action-Level Permissions Editor/i)).toBeInTheDocument();
      expect(screen.getByText('Members & Students')).toBeInTheDocument();
      expect(screen.getByText('Books & Shared Catalog')).toBeInTheDocument();
      expect(screen.getByText('Finance & Subscriptions')).toBeInTheDocument();

      const saveBtn = screen.getByRole('button', { name: /Save Permissions Matrix/i });
      fireEvent.click(saveBtn);
      expect(onSave).toHaveBeenCalledWith(INITIAL_ROLES[0].id, expect.any(Object));
    });

    it('renders UserSecurityAuditModal with lock, reset, and session controls', () => {
      const user = INITIAL_USER_SECURITY_ACCOUNTS[0];
      const onToggleLock = vi.fn();
      const onResetPwd = vi.fn().mockReturnValue('Reset link sent');
      const onResetMfa = vi.fn();

      render(
        <SuperadminUserSecurityAuditModal
          user={user}
          onClose={vi.fn()}
          onToggleLock={onToggleLock}
          onTriggerPasswordReset={onResetPwd}
          onResetMfa={onResetMfa}
          onRevokeSession={vi.fn()}
          onRevokeAllSessions={vi.fn()}
          onGrantTemporaryPermission={vi.fn()}
        />
      );

      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(/Account Access Lock/i)).toBeInTheDocument();
      expect(screen.getByText(/Trigger Secure Password Reset/i)).toBeInTheDocument();
      expect(screen.getByText(/MFA Security Reset/i)).toBeInTheDocument();

      const lockBtn = screen.getByRole('button', { name: /Lock Account/i });
      fireEvent.click(lockBtn);
      expect(onToggleLock).toHaveBeenCalled();
    });
  });
});
