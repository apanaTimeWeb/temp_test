// RESPONSIBILITY: Tenant & Branch scope selector with governance context banner and quick bulk controls.
import React from 'react';
import { Building2, GitBranch, Shield, Sparkles, CheckCheck, Ban, RotateCcw } from 'lucide-react';
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
    <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tenant Scope Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-teal-400">
            <Building2 size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Governance Scope:
            </span>
          </div>

          <select
            value={selectedTenantId}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500 min-w-[260px]"
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
              <GitBranch size={16} className="text-neutral-400" />
              <select
                value={selectedBranchId}
                onChange={(e) => onSelectBranch(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500 min-w-[220px]"
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
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              <Shield size={14} /> Level 1: Global Platform Switches & Base Plan Matrix
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-semibold">
                <Sparkles size={14} /> Scope: {selectedTenant?.name} [{selectedTenant?.planTier} Tier]
                {selectedBranch ? ` • Branch: ${selectedBranch.name}` : ' • All Branches'}
              </span>

              {/* Bulk Control Buttons */}
              {onEnableAll && onDisableAll && onResetAll && (
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    type="button"
                    onClick={onEnableAll}
                    title="Enable all 16 modules for this library"
                    className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={13} />
                    <span>Enable All</span>
                  </button>
                  <button
                    type="button"
                    onClick={onDisableAll}
                    title="Disable all 16 modules for this library"
                    className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Ban size={13} />
                    <span>Disable All</span>
                  </button>
                  <button
                    type="button"
                    onClick={onResetAll}
                    title="Reset to default plan entitlements"
                    className="px-2 py-1 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Reset Plan</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-neutral-400 pt-2 border-t border-border/40 flex flex-wrap items-center gap-y-1 gap-x-4">
        <span>
          <strong className="text-neutral-200">Hierarchy Rule:</strong> Effective Access = (Platform Default) AND (Plan Entitlement OR Custom Override).
        </span>
        <span>
          <strong className="text-neutral-200">Backend Enforcement:</strong> Denied modules return HTTP 403 Forbidden with FEATURE_DISABLED payload.
        </span>
      </div>
    </div>
  );
}
