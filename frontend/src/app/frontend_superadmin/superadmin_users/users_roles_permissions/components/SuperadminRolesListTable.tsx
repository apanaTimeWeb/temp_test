'use client';
// RESPONSIBILITY: Semantic accessible table listing all roles with single-line horizontal actions.
import { useState, useMemo } from 'react';
import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
import { Shield, Copy, Trash2, Edit3, Lock, Users } from 'lucide-react';
import type { RoleDefinition } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

interface SuperadminRolesListTableProps {
  roles: RoleDefinition[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  onEditPermissions: (role: RoleDefinition) => void;
  onDuplicateRole: (role: RoleDefinition) => void;
  onDeleteRole: (roleId: string) => void;
}

export default function SuperadminRolesListTable({
  roles,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onEditPermissions,
  onDuplicateRole,
  onDeleteRole,
}: SuperadminRolesListTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const paginatedRoles = useMemo(() => {
    return roles.slice(page * pageSize, (page + 1) * pageSize);
  }, [roles, page, pageSize]);
  const getCategoryBadge = (category: RoleDefinition['roleCategory']) => {
    switch (category) {
      case 'internal_platform':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Platform Internal</span>;
      case 'tenant_library':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Tenant / Library</span>;
      case 'custom_staff':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Custom Staff</span>;
    }
  };

  const getScopeBadge = (scope: RoleDefinition['scope']) => {
    switch (scope) {
      case 'platform_wide':
        return <span className="text-purple-300 font-semibold">Platform-Wide</span>;
      case 'tenant_all_branches':
        return <span className="text-indigo-300 font-semibold">All Tenant Branches</span>;
      case 'single_branch':
        return <span className="text-emerald-300 font-semibold">Assigned Branch Desk</span>;
      case 'custom_scope':
        return <span className="text-amber-300 font-semibold">Custom Defined Scope</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 shadow-md">
        <div className="relative flex-1 min-w-[240px]">
          <input maxLength={250}
            type="search"
            placeholder="Search roles by name or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-xl border border-indigo-500/25 bg-input px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'internal_platform', label: 'Platform Internal' },
            { id: 'tenant_library', label: 'Tenant & Branch' },
            { id: 'custom_staff', label: 'Custom Roles' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setCategoryFilter(cat.id); setPage(0); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Table */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#101438] text-slate-300 border-b border-indigo-500/20 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="py-3 px-4">Role Name & System Tag</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Access Scope</th>
                <th scope="col" className="py-3 px-4">Active Users</th>
                <th scope="col" className="py-3 px-4">Temporary Perms</th>
                <th scope="col" className="py-3 px-4">Last Updated</th>
                <th scope="col" className="py-3 px-4 min-w-[200px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10 text-slate-200">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No roles matched your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-indigo-500/5 transition-colors">
                    {/* Role Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-white text-sm">{role.name}</div>
                        {role.isSystemRole ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700" title="System core role">
                            <Lock size={10} /> System
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Shield size={10} /> Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{role.description}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">{getCategoryBadge(role.roleCategory)}</td>

                    {/* Scope */}
                    <td className="py-3 px-4 whitespace-nowrap">{getScopeBadge(role.scope)}</td>

                    {/* Users */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-300 font-semibold">
                        <Users size={12} className="text-indigo-400" />
                        {role.userCount} users
                      </span>
                    </td>

                    {/* Temporary Expiry */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {role.temporaryExpiryAllowed ? (
                        <span className="text-emerald-400 font-medium">Supported</span>
                      ) : (
                        <span className="text-slate-500">Permanent Only</span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400">{role.updatedAt}</td>

                    {/* Single-line Horizontal Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-nowrap whitespace-nowrap">
                        {/* 1. Edit Matrix */}
                        <button
                          type="button"
                          onClick={() => onEditPermissions(role)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all font-semibold cursor-pointer shrink-0"
                          title="Open Action-Level Permission Matrix"
                        >
                          <Edit3 size={12} />
                          <span>Permissions</span>
                        </button>

                        {/* 2. Duplicate Role */}
                        <button
                          type="button"
                          onClick={() => onDuplicateRole(role)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 motion-safe:transition-all font-semibold cursor-pointer shrink-0"
                          title="Duplicate this role"
                        >
                          <Copy size={12} />
                          <span>Duplicate</span>
                        </button>

                        {/* 3. Delete Custom Role */}
                        {!role.isSystemRole && (
                          <button
                            type="button"
                            onClick={() => onDeleteRole(role.id)}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:text-white hover:bg-rose-600/30 motion-safe:transition-all cursor-pointer shrink-0"
                            title="Delete custom role"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={roles.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="roles"
        />
      </div>
    </div>
  );
}
