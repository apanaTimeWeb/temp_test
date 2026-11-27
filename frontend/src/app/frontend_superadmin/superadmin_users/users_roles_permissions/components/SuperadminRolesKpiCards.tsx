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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" aria-label="Role and Security Metrics">
      {/* 1. Total Roles */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c0f28] via-[#101438] to-[#181d4a] p-5 shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-200 hover:scale-[1.01] hover:border-indigo-400/50 min-h-[136px] flex flex-col justify-between">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-indigo-500/10 blur-xl motion-safe:transition-all group-hover:bg-indigo-500/20" />
        <div className="flex items-center justify-between text-slate-300 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Total Roles</span>
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shadow-inner shrink-0">
            <Shield size={16} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black tracking-tight text-white leading-none">{totalRoles}</p>
          <p className="text-[11px] text-slate-400 mt-2">System & Custom Templates</p>
        </div>
      </div>

      {/* 2. Platform Internal Roles */}
      <div className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#130d28] via-[#1a1238] to-[#25184a] p-5 shadow-lg shadow-purple-950/40 motion-safe:transition-all motion-safe:duration-200 hover:scale-[1.01] hover:border-purple-400/50 min-h-[136px] flex flex-col justify-between">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-purple-500/10 blur-xl motion-safe:transition-all group-hover:bg-purple-500/20" />
        <div className="flex items-center justify-between text-slate-300 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Platform Internal</span>
          <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-inner shrink-0">
            <Crown size={16} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black tracking-tight text-purple-200 leading-none">{platformRoles}</p>
          <p className="text-[11px] text-purple-300/80 mt-2">SuperAdmin, Support, Finance</p>
        </div>
      </div>

      {/* 3. Tenant & Branch Roles */}
      <div className="group relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#0a1828] via-[#0d2038] to-[#122e4a] p-5 shadow-lg shadow-sky-950/40 motion-safe:transition-all motion-safe:duration-200 hover:scale-[1.01] hover:border-sky-400/50 min-h-[136px] flex flex-col justify-between">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-sky-500/10 blur-xl motion-safe:transition-all group-hover:bg-sky-500/20" />
        <div className="flex items-center justify-between text-slate-300 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Tenant & Branch</span>
          <div className="h-8 w-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center shadow-inner shrink-0">
            <Building2 size={16} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black tracking-tight text-sky-200 leading-none">{tenantRoles}</p>
          <p className="text-[11px] text-slate-400 mt-2">Admin, Manager, Staff</p>
        </div>
      </div>

      {/* 4. Active Staff Accounts */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a2418] via-[#0d3020] to-[#12422c] p-5 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-200 hover:scale-[1.01] hover:border-emerald-400/50 min-h-[136px] flex flex-col justify-between">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-xl motion-safe:transition-all group-hover:bg-emerald-500/20" />
        <div className="flex items-center justify-between text-slate-300 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Staff Accounts</span>
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-inner shrink-0">
            <Users size={16} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black tracking-tight text-emerald-200 leading-none">{totalUsers}</p>
          <p className="text-[11px] text-emerald-400/90 mt-2">With RBAC assignments</p>
        </div>
      </div>

      {/* 5. Account Security Lockouts */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#240a12] via-[#300d18] to-[#421220] p-5 shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-200 hover:scale-[1.01] hover:border-rose-400/50 min-h-[136px] flex flex-col justify-between">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-rose-500/10 blur-xl motion-safe:transition-all group-hover:bg-rose-500/20" />
        <div className="flex items-center justify-between text-slate-300 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Security Locks</span>
          <div className="h-8 w-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center shadow-inner shrink-0">
            <UserX size={16} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black tracking-tight text-rose-200 leading-none">{lockedUsers}</p>
          <p className="text-[11px] text-rose-300/90 mt-2">{lockedUsers === 0 ? 'All accounts active' : 'Locked for safety'}</p>
        </div>
      </div>
    </div>
  );
}
