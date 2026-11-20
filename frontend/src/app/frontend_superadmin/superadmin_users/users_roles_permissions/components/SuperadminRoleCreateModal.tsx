'use client';
// RESPONSIBILITY: Render role creation and duplication modal dialog.
import { useState } from 'react';
import { X, ShieldPlus, AlertCircle } from 'lucide-react';
import type { RoleDefinition, RoleCategory, RoleAccessScope } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

interface SuperadminRoleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoles: RoleDefinition[];
  preselectedTemplateId?: string;
  onSubmit: (data: {
    name: string;
    roleCategory: RoleCategory;
    description: string;
    scope: RoleAccessScope;
    baseTemplateRoleId?: string;
  }) => { success: boolean; error?: string };
}

export default function SuperadminRoleCreateModal({
  isOpen,
  onClose,
  existingRoles,
  preselectedTemplateId,
  onSubmit,
}: SuperadminRoleCreateModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RoleCategory>('tenant_library');
  const [scope, setScope] = useState<RoleAccessScope>('single_branch');
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState(preselectedTemplateId || existingRoles[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Role name is required.');
      return;
    }
    const res = onSubmit({
      name: name.trim(),
      roleCategory: category,
      description: description.trim() || `Custom role with ${scope} scope`,
      scope,
      baseTemplateRoleId: templateId,
    });
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create role');
    } else {
      setErrorMsg('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-indigo-500/40 bg-[#0d102b] p-6 shadow-2xl text-white">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/20">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <ShieldPlus size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create New Role Definition</h2>
            <p className="text-xs text-slate-400">Configure access tier, scope boundary and base permissions.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Role Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Shift Supervisor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
              >
                <option value="tenant_library">Tenant & Branch</option>
                <option value="internal_platform">Platform Internal</option>
                <option value="custom_staff">Custom Staff</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Access Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as RoleAccessScope)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
              >
                <option value="single_branch">Single Branch Desk</option>
                <option value="tenant_all_branches">All Tenant Branches</option>
                <option value="platform_wide">Platform-Wide</option>
                <option value="custom_scope">Custom Scope</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Clone Base Permissions From</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
            >
              <option value="">-- Start from Blank (No Permissions) --</option>
              {existingRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.roleCategory})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Role Description / Purpose</label>
            <textarea
              rows={2}
              placeholder="e.g. Assigned to morning librarians handling seat check-ins and book reservations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
