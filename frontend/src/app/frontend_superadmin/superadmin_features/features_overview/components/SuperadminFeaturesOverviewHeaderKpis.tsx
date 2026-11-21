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
      {/* ── Main Banner ── */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-xl p-5 shadow-2xl shadow-indigo-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/25 text-white shrink-0">
              <Sliders size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  07. Feature & Module Control
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-xs">
                  3-Tier Hierarchy + API Guard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Platform Default (System-Wide), Plan Entitlement (Tier-Wise), & Account/Branch Overrides with backend API denial enforcement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Modules */}
        <div className="p-4 rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-[#0a0d24] to-[#060814] shadow-lg backdrop-blur-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Library Modules</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Layers size={14} />
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{totalModules}</div>
          <div className="text-[11px] text-slate-400">Full SaaS capability catalog</div>
        </div>

        {/* Globally Enabled */}
        <div className="p-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-[#0a0d24] to-[#060814] shadow-lg backdrop-blur-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Globally Enabled (L1)</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={14} />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">{globallyActiveCount}</div>
          <div className="text-[11px] text-slate-400">Platform defaults active</div>
        </div>

        {/* Platform Killswitch */}
        <div className="p-4 rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/40 via-[#0a0d24] to-[#060814] shadow-lg backdrop-blur-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Platform Killswitch (L1)</span>
            <span className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert size={14} />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight">{globallyDisabledCount}</div>
          <div className="text-[11px] text-slate-400">Globally blocked system-wide</div>
        </div>

        {/* Active Overrides */}
        <div className="p-4 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-[#0a0d24] to-[#060814] shadow-lg backdrop-blur-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Overrides (L3)</span>
            <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <KeyRound size={14} />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">{activeOverridesCount}</div>
          <div className="text-[11px] text-slate-400">Custom tenant/branch rules</div>
        </div>
      </div>
    </div>
  );
}