// RESPONSIBILITY: KPI summary cards and main header for SuperAdmin Feature & Module Governance.
import React from 'react';
import { Sliders, ShieldCheck, ShieldAlert, Layers, KeyRound } from 'lucide-react';
import type { PlatformModuleState, TenantModuleOverride } from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';

interface HeaderKpisProps {
  platformStates: PlatformModuleState[];
  overrides: TenantModuleOverride[];
}

export default function SuperadminFeaturesOverviewHeaderKpis({
  platformStates,
  overrides,
}: HeaderKpisProps) {
  const totalModules = ALL_16_LIBRARY_MODULES.length;
  const globallyActiveCount = platformStates.filter((s) => s.platformDefault).length;
  const globallyDisabledCount = totalModules - globallyActiveCount;
  const activeOverridesCount = overrides.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sliders size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                07. Feature & Module Control
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                3-Tier Hierarchy + API Guard
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Platform Default (System-Wide), Plan Entitlement (Tier-Wise), & Account/Branch Overrides with backend API denial enforcement.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-card/80">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Library Modules</span>
            <Layers size={15} className="text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">{totalModules}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Full SaaS capability catalog</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card/80">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Globally Enabled (L1)</span>
            <ShieldCheck size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1.5">{globallyActiveCount}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Platform defaults active</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card/80">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Platform Killswitch (L1)</span>
            <ShieldAlert size={15} className="text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1.5">{globallyDisabledCount}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Globally blocked system-wide</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card/80">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Active Overrides (L3)</span>
            <KeyRound size={15} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1.5">{activeOverridesCount}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Custom tenant/branch rules</div>
        </div>
      </div>
    </div>
  );
}
