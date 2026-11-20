'use client';
// RESPONSIBILITY: Master coordinator for Role & Permission Management (Module 04) adhering to WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1 (< 300 lines).
import { useState } from 'react';
import { useSuperadminRolesPermissions } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/hooks/useSuperadminRolesPermissions';
import SuperadminRolesOverviewHeader from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesOverviewHeader';
import SuperadminRolesKpiCards from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesKpiCards';
import SuperadminRolesListTable from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolesListTable';
import SuperadminUserSecurityAccountsTable from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUserSecurityAccountsTable';
import SuperadminRolePermissionEditorModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRolePermissionEditorModal';
import SuperadminRoleCreateModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminRoleCreateModal';
import SuperadminUserSecurityAuditModal from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUserSecurityAuditModal';
import type { RoleDefinition, UserSecurityAccount } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

export default function SuperadminUsersRolesPermissionsPageClient() {
  const {
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
  } = useSuperadminRolesPermissions();

  const [activeTab, setActiveTab] = useState<'roles_matrix' | 'user_security'>('roles_matrix');
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cloneTemplateId, setCloneTemplateId] = useState<string | undefined>(undefined);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [selectedSecurityUser, setSelectedSecurityUser] = useState<UserSecurityAccount | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleDuplicate = (role: RoleDefinition) => {
    setCloneTemplateId(role.id);
    setIsCreateModalOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) return;
    const res = deleteCustomRole(roleToDelete);
    if (res.success) {
      showToast('Custom role deleted successfully.');
    } else {
      showToast(res.error || 'Failed to delete role');
    }
    setRoleToDelete(null);
  };

  // Sync selected user when userAccounts updates
  const activeSecurityUser = selectedSecurityUser
    ? userAccounts.find((u) => u.id === selectedSecurityUser.id) || selectedSecurityUser
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 rounded-xl border border-indigo-500/50 bg-indigo-950/90 text-indigo-200 px-4 py-3 shadow-xl flex items-center gap-2 backdrop-blur-md animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <SuperadminRolesOverviewHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateRole={() => {
          setCloneTemplateId(undefined);
          setIsCreateModalOpen(true);
        }}
        totalRolesCount={roles.length}
        totalUsersCount={userAccounts.length}
      />

      {/* KPI Cards */}
      <SuperadminRolesKpiCards roles={roles} userAccounts={userAccounts} />

      {/* Main Tab Content */}
      {activeTab === 'roles_matrix' ? (
        <SuperadminRolesListTable
          roles={filteredRoles}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={roleCategoryFilter}
          setCategoryFilter={setRoleCategoryFilter}
          onEditPermissions={(role) => setEditingRole(role)}
          onDuplicateRole={handleDuplicate}
          onDeleteRole={handleDeleteRole}
        />
      ) : (
        <SuperadminUserSecurityAccountsTable
          users={userAccounts}
          onOpenSecurityModal={(u) => setSelectedSecurityUser(u)}
          onToggleLock={(uid) => {
            toggleAccountLock(uid);
            showToast('Account lock state updated.');
          }}
          onTriggerPasswordReset={(uid) => {
            const msg = triggerPasswordReset(uid);
            showToast(msg);
          }}
        />
      )}

      {/* Matrix Editor Modal */}
      {editingRole && (
        <SuperadminRolePermissionEditorModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onSave={(roleId, updatedMatrix) => {
            updateRolePermissions(roleId, updatedMatrix);
            setEditingRole(null);
            showToast(`Permissions updated for role "${editingRole.name}"!`);
          }}
        />
      )}

      {/* Create / Clone Role Modal */}
      <SuperadminRoleCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingRoles={roles}
        preselectedTemplateId={cloneTemplateId}
        onSubmit={(data) => {
          const res = createRole(data);
          if (res.success) {
            setIsCreateModalOpen(false);
            showToast(`New role "${data.name}" created successfully!`);
          }
          return res;
        }}
      />

      {/* User Security & Active Sessions Modal */}
      {activeSecurityUser && (
        <SuperadminUserSecurityAuditModal
          user={activeSecurityUser}
          onClose={() => setSelectedSecurityUser(null)}
          onToggleLock={toggleAccountLock}
          onTriggerPasswordReset={triggerPasswordReset}
          onResetMfa={resetMfa}
          onRevokeSession={revokeSession}
          onRevokeAllSessions={revokeAllSessions}
          onGrantTemporaryPermission={grantTemporaryPermission}
        />
      )}

      {/* Delete Custom Role Confirmation Dialog */}
      {roleToDelete && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#0f172a] p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Custom Role</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this custom role? This cannot be undone and will revoke custom permissions.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
