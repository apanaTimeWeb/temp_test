'use client';

import { ShieldCheck, ShieldX, Users } from 'lucide-react';

interface ManagerFinanceTrustScoresKpiGridProps {
  scoredCount: number;
  lowTrustCount: number;
  avgTrustScore: number;
  scoredLabel: string;
  lowTrustLabel: string;
  avgLabel: string;
}

export default function ManagerFinanceTrustScoresKpiGrid({
  scoredCount,
  lowTrustCount,
  avgTrustScore,
  scoredLabel,
  lowTrustLabel,
  avgLabel,
}: ManagerFinanceTrustScoresKpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="fin-kpi-card fin-trust-kpi-card--indigo group relative overflow-hidden rounded-2xl border p-4 sm:p-5 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="fin-trust-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{scoredLabel}</span>
            <div className="fin-trust-kpi-icon w-10 h-10 rounded-xl border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">{scoredCount}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Total Ranked
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Student profiles with reliability tracking</p>
          </div>
        </div>
      </div>

      <div className="fin-kpi-card fin-kpi-card--danger fin-trust-kpi-card--rose group relative overflow-hidden rounded-2xl border p-4 sm:p-5 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="fin-trust-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{lowTrustLabel}</span>
            <div className="fin-trust-kpi-icon w-10 h-10 rounded-xl border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <ShieldX size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-sans">{lowTrustCount}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                High Risk
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Low reliability profiles · Requires advance deposit</p>
          </div>
        </div>
      </div>

      <div className="fin-kpi-card fin-trust-kpi-card--emerald group relative overflow-hidden rounded-2xl border p-4 sm:p-5 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="fin-trust-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{avgLabel}</span>
            <div className="fin-trust-kpi-icon w-10 h-10 rounded-xl border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-sans">
                {avgTrustScore}<span className="text-sm font-normal text-emerald-300/60">/100</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Campus Standing
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Campus-wide reliability benchmark</p>
          </div>
        </div>
      </div>
    </div>
  );
}
