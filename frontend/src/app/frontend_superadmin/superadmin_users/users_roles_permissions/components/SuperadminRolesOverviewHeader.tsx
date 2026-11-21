'use client';
// RESPONSIBILITY: Hero header and navigation controls for Role & Permission Management (Module 04).
import { ShieldCheck, Plus, Users, KeyRound, Sparkles, Layers } from 'lucide-react';

interface SuperadminRolesOverviewHeaderProps {
  activeTab: 'roles_matrix' | 'user_security';
  setActiveTab: (tab: 'roles_matrix' | 'user_security') => void;
  onCreateRole: () => void;
  totalRolesCount: number;
  totalUsersCount: number;
}

export default function SuperadminRolesOverviewHeader({
  activeTab,
  setActiveTab,
  onCreateRole,
  totalRolesCount,
  totalUsersCount,
}: SuperadminRolesOverviewHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0a0d24]/95 via-[#0d1238]/90 to-[#090c20]/95 p-5 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-md">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2.5">
          {/* Badge Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-xs">
              <ShieldCheck size={13} className="text-indigo-400" />
              Granular Action-Level RBAC
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10 System & Branch Roles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-xs">
              <Sparkles size={12} className="text-purple-400" /> Multi-Tenant Scoped
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <span>Admin, Manager & Staff Permission Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1.5">
              SuperAdmin centralized role creation, granular 10-action module matrix, branch isolation rules, account lockouts, MFA resets, and real-time active session controls.
            </p>
          </div>
        </div>

        {/* CTA & Tab Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('roles_matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                activeTab === 'roles_matrix'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Layers size={14} />
              <span>Roles & Matrix ({totalRolesCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('user_security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                activeTab === 'user_security'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <KeyRound size={14} />
              <span>User Security & Sessions ({totalUsersCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateRole}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-950/60 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Create New Role</span>
          </button>
        </div>
      </div>
    </div>
  );
}
