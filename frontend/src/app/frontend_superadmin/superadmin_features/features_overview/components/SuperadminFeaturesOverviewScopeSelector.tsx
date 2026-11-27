// RESPONSIBILITY: Tenant & Branch scope selector with governance context banner and quick bulk controls.
import React from 'react';
import { Building2, GitBranch, Shield, CheckCheck, Ban, RotateCcw } from 'lucide-react';
import type { MockTenantOption } from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';

interface ScopeSelectorProps {
  tenantsList: MockTenantOption[];
  selectedTenantId: string;
  selectedBranchId: string;
  selectedTenant?: MockTenantOption;
  selectedBranch?: { id: string; name: string; code: string };
  onSelectTenant: (id: string) => void;
  onSelectBranch: (id: string) => void;
  onEnableAll?: () => void;
  onDisableAll?: () => void;
  onResetAll?: () => void;
}

export default function SuperadminFeaturesOverviewScopeSelector({
  tenantsList,
  selectedTenantId,
  selectedBranchId,
  selectedTenant,
  selectedBranch,
  onSelectTenant,
  onSelectBranch,
  onEnableAll,
  onDisableAll,
  onResetAll,
}: ScopeSelectorProps) {
  const isGlobal = selectedTenantId === 'global';

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-xl shadow-xl space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tenant Scope Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-teal-400">
            <span className="p-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30">
              <Building2 size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Governance Scope:
            </span>
          </div>

          <select
            value={selectedTenantId}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 min-w-[260px] cursor-pointer"
          >
            <option value="global">🌐 Platform-Wide Defaults (All Libraries)</option>
            {tenantsList.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                🏢 {tenant.name} ({tenant.planTier} Tier)
              </option>
            ))}
          </select>

          {/* Branch Dropdown if tenant selected */}
          {!isGlobal && selectedTenant && (
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-slate-400" />
              <select
                value={selectedBranchId}
                onChange={(e) => onSelectBranch(e.target.value)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 min-w-[220px] cursor-pointer"
              >
                <option value="all">All Branches (Tenant-Wide)</option>
                {selectedTenant.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    📍 {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status Pill & Bulk Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {isGlobal ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold shadow-xs">
              <Shield size={14} /> Level 1: Global Platform Switches & Base Plan Matrix
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold shadow-xs">
                <Shield size={14} /> Scope: {selectedTenant?.name} [{selectedTenant?.planTier} Tier]
                {selectedBranch ? ` • Branch: ${selectedBranch.name}` : ' • All Branches'}
              </span>

              {/* Bulk Control Buttons */}
              {onEnableAll && onDisableAll && onResetAll && (
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    type="button"
                    onClick={onEnableAll}
                    title="Enable all 16 modules for this library"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <CheckCheck size={13} />
                    <span>Enable All</span>
                  </button>

                  <button
                    type="button"
                    onClick={onDisableAll}
                    title="Disable all 16 modules for this library"
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold flex items-center gap-1 motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Ban size={13} />
                    <span>Disable All</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetAll}
                    title="Reset all custom overrides back to plan defaults"
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Plan</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}