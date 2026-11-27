'use client';

import React from 'react';
import { CheckCircle2, GitBranch, RotateCcw, Tag } from 'lucide-react';
import type { DeploymentRecord } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthKillswitchesConfig';

interface SuperadminSystemHealthDeploymentsGridProps {
  deployments: DeploymentRecord[];
  rollingBackSha: string | null;
  onRollback: (record: DeploymentRecord) => void;
}

export default function SuperadminSystemHealthDeploymentsGrid({
  deployments,
  rollingBackSha,
  onRollback,
}: SuperadminSystemHealthDeploymentsGridProps) {
  return (
    <div className="relative z-10 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <GitBranch size={15} className="text-sky-400" />
          <span>Recent Production Deployments</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
          Auto-rollback on 5xx spike
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {deployments.map((dep) => {
          const isLive = dep.status === 'Live';
          const isRolling = rollingBackSha === dep.commitSha;
          return (
            <div
              key={dep.commitSha}
              className={`group relative overflow-hidden rounded-2xl p-4 motion-safe:transition-all motion-safe:duration-300 flex flex-col justify-between ${
                isLive
                  ? 'border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-[#080d1e] shadow-lg shadow-emerald-500/5'
                  : 'border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/80 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={13} className={isLive ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="font-mono text-xs font-bold text-slate-100">{dep.version}</span>
                  <span className="rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {dep.commitSha}
                  </span>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                    isLive
                      ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-xs'
                      : 'border-slate-700 bg-slate-800/70 text-slate-400'
                  }`}
                >
                  {dep.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{dep.notes}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2.5 border-t border-slate-800/60">
                <span className="truncate text-[10px]">
                  By <strong className="text-slate-300 font-medium">{dep.author}</strong>
                </span>

                {!isLive ? (
                  <button
                    type="button"
                    onClick={() => onRollback(dep)}
                    disabled={isRolling}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 text-[11px] font-semibold shadow-xs motion-safe:transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                    title="Rollback cluster to this release"
                  >
                    <RotateCcw size={11} className={isRolling ? 'motion-safe:animate-spin' : ''} />
                    <span>{isRolling ? 'Rolling...' : 'Rollback'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Active Build
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
