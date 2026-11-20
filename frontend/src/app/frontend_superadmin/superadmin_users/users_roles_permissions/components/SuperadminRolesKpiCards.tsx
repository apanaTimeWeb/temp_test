'use client';
// RESPONSIBILITY: Display top metrics for Roles, Permissions, and Account Security.
import { Shield, Crown, Building2, UserX, Users } from 'lucide-react';
import type { RoleDefinition, UserSecurityAccount } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

interface SuperadminRolesKpiCardsProps {
  roles: RoleDefinition[];
  userAccounts: UserSecurityAccount[];
}

export default function SuperadminRolesKpiCards({ roles, userAccounts }: SuperadminRolesKpiCardsProps) {
  const totalRoles = roles.length;
  const platformRoles = roles.filter((r) => r.roleCategory === 'internal_platform').length;
  const tenantRoles = roles.filter((r) => r.roleCategory === 'tenant_library' || r.roleCategory === 'custom_staff').length;
  const totalUsers = userAccounts.length;
  const lockedUsers = userAccounts.filter((u) => u.isLocked).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6" aria-label="Role and Security Metrics">
      {/* 1. Total Roles */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Roles</span>
          <Shield size={16} className="text-indigo-400" />
        </div>
        <p className="text-2xl font-black text-white">{totalRoles}</p>
        <p className="text-[11px] text-slate-400 mt-1">System & Custom Templates</p>
      </div>

      {/* 2. Platform Internal Roles */}
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Platform Internal</span>
          <Crown size={16} className="text-purple-400" />
        </div>
        <p className="text-2xl font-black text-purple-300">{platformRoles}</p>
        <p className="text-[11px] text-purple-300/80 mt-1">SuperAdmin, Support, Finance</p>
      </div>

      {/* 3. Tenant & Branch Roles */}
      <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Tenant & Branch</span>
          <Building2 size={16} className="text-sky-400" />
        </div>
        <p className="text-2xl font-black text-sky-300">{tenantRoles}</p>
        <p className="text-[11px] text-slate-400 mt-1">Admin, Manager, Librarian, Staff</p>
      </div>

      {/* 4. Active Staff Accounts */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Staff Accounts</span>
          <Users size={16} className="text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-white">{totalUsers}</p>
        <p className="text-[11px] text-emerald-400/90 mt-1">With RBAC assignments</p>
      </div>

      {/* 5. Account Security Lockouts */}
      <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Security Locks</span>
          <UserX size={16} className="text-rose-400" />
        </div>
        <p className="text-2xl font-black text-rose-300">{lockedUsers}</p>
        <p className="text-[11px] text-rose-300/90 mt-1">{lockedUsers === 0 ? 'All accounts active' : 'Locked for safety'}</p>
      </div>
    </div>
  );
}
