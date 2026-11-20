// RESPONSIBILITY: Tenant & Branch scope selector with governance context banner.
import React from 'react';
import { Building2, GitBranch, Shield, Sparkles } from 'lucide-react';
import type { MockTenantOption } from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';

interface ScopeSelectorProps {
  tenantsList: MockTenantOption[];
  selectedTenantId: string;
  selectedBranchId: string;
  selectedTenant?: MockTenantOption;
  selectedBranch?: { id: string; name: string; code: string };
  onSelectTenant: (id: string) => void;
  onSelectBranch: (id: string) => void;
}

export default function SuperadminFeaturesOverviewScopeSelector({
  tenantsList,
  selectedTenantId,
  selectedBranchId,
  selectedTenant,
  selectedBranch,
  onSelectTenant,
  onSelectBranch,
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

        {/* Status Pill */}
        <div className="flex items-center gap-2 text-xs">
          {isGlobal ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Shield size={14} /> Level 1: Global Platform Switches & Base Plan Matrix
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles size={14} /> Level 3 Scope: {selectedTenant?.name} [{selectedTenant?.planTier} Tier]
              {selectedBranch ? ` - Branch: ${selectedBranch.name}` : ' (All Branches)'}
            </span>
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
