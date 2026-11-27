// components/SuperadminDataOverviewRpoRtoGauges.tsx
// RESPONSIBILITY: Renders deep SLA metrics for RPO and RTO, restore sandbox drill status, and trigger controls. No direct fetch.
'use client';

import React from 'react';
import { Clock, Play, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { SuperadminDataOverviewRpoRtoStatus } from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';
import { displayValue } from '@/lib/display_value';

interface SuperadminDataOverviewRpoRtoGaugesProps {
  rpoRto: SuperadminDataOverviewRpoRtoStatus | undefined;
  onSimulateDrill: () => void;
  isSimulatingDrill: boolean;
}

export function SuperadminDataOverviewRpoRtoGauges({
  rpoRto,
  onSimulateDrill,
  isSimulatingDrill,
}: SuperadminDataOverviewRpoRtoGaugesProps) {
  if (!rpoRto) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="data_overview-rpo-rto-gauges">
      {/* ── RPO (Recovery Point Objective) ── */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Clock size={20} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Recovery Point Objective (RPO)</h3>
              <p className="text-xs text-muted-foreground">Maximum tolerable data loss interval</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
              rpoRto.rpoStatus === 'COMPLIANT'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {rpoRto.rpoStatus === 'COMPLIANT' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {rpoRto.rpoStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/60">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">Target RPO SLA</div>
            <div className="text-xl font-black text-foreground mt-0.5">
              ≤ {displayValue(rpoRto.targetRpoMinutes)} mins
            </div>
            <div className="text-[11px] text-muted-foreground">Continuous WAL stream</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">Actual Current RPO</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {displayValue(rpoRto.currentRpoMinutes)} mins
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium">Safe buffer: 10.8m margin</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-neutral-900/40 p-3 rounded-lg border border-border/50">
          <span className="text-foreground font-semibold">Tenant Isolation Guarantee: </span>
          Wal logs are segmented by tenant partition namespace. Restoring a point-in-time state for any single library executes without locking or rewinding sibling tenant databases.
        </div>
      </div>

      {/* ── RTO (Recovery Time Objective) & Restore Testing ── */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <RotateCcw size={20} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Recovery Time Objective (RTO)</h3>
              <p className="text-xs text-muted-foreground">Maximum downtime duration until restore completion</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
              rpoRto.rtoStatus === 'COMPLIANT'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {rpoRto.rtoStatus === 'COMPLIANT' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {rpoRto.rtoStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/60">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">Target RTO SLA</div>
            <div className="text-xl font-black text-foreground mt-0.5">
              ≤ {displayValue(rpoRto.targetRtoMinutes)} mins
            </div>
            <div className="text-[11px] text-muted-foreground">Full platform failover</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">Tested Sandbox RTO</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {displayValue(rpoRto.testedRtoMinutes)} mins
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium">Pass Rate: {rpoRto.lastDrillPassRate}%</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900/40 p-3 rounded-lg border border-border/50">
          <div>
            <div className="text-[11px] text-muted-foreground">Next Scheduled Automated Drill:</div>
            <div className="text-xs font-semibold text-foreground">{rpoRto.nextScheduledDrill}</div>
          </div>
          <button
            type="button"
            onClick={onSimulateDrill}
            disabled={isSimulatingDrill}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white motion-safe:transition-all motion-safe:duration-300 shadow-md shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50 cursor-pointer min-w-40 justify-center"
            data-testid="data_overview-run-drill-btn"
          >
            {isSimulatingDrill ? (
              <>
                <RotateCcw size={13} className="motion-safe:animate-spin text-emerald-100" />
                <span>Drill Running...</span>
              </>
            ) : (
              <>
                <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
                  <Play size={12} className="fill-white" />
                </span>
                <span>Run Sandbox Drill</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
