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
    <div className="w-full rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-[#0c0f28] via-[#12163a] to-[#181d4a] p-5 sm:p-6 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          {/* Badge Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck size={12} className="text-indigo-400" />
              Granular Action-Level RBAC
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10 System & Branch Roles
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Sparkles size={11} /> Multi-Tenant Scoped
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <ShieldCheck className="text-indigo-400 shrink-0" size={28} />
              <span>Admin, Manager & Staff Permission Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
              SuperAdmin centralized role creation, granular 10-action module matrix, branch isolation rules, account lockouts, MFA resets, and real-time active session controls.
            </p>
          </div>
        </div>

        {/* CTA & Tab Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-indigo-500/30">
            <button
              type="button"
              onClick={() => setActiveTab('roles_matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roles_matrix'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>Roles & Matrix ({totalRolesCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('user_security')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'user_security'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound size={14} />
              <span>User Security & Sessions ({totalUsersCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateRole}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-950/60 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Create New Role</span>
          </button>
        </div>
      </div>
    </div>
  );
}
