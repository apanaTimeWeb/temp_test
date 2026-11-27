'use client';

import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { Building, Calendar, Check, CheckCircle2, Copy, Hash, ShieldCheck, Wifi } from 'lucide-react';
import Image from 'next/image';

interface ManagerSettingsBranchInfoHeroProps {
  branchData: ManagerSettingsBranchInfoDraft;
  copiedKey: string | null;
  onCopy: (text: string, label: string, key: string) => void;
  onOpenWifiModal: () => void;
}

/** Hero facility badge banner displaying branch identity, code, establishment date, and Wi-Fi standee shortcut. */
export function ManagerSettingsBranchInfoHero({
  branchData,
  copiedKey,
  onCopy,
  onOpenWifiModal,
}: ManagerSettingsBranchInfoHeroProps) {
  return (
    <div className="mgr-branch-hero-surface rounded-xl border p-4 sm:p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          {branchData.libraryLogo ? (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-amber-500/30 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center shadow-md">
              <Image
                src={branchData.libraryLogo}
                alt={branchData.branchName}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <Building size={24} />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {branchData.branchName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                Active Branch
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => onCopy(branchData.branchCode, 'Branch Code', 'hero_code')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/25 motion-safe:transition-colors cursor-pointer group"
                title="Click to copy code"
              >
                <Hash size={11} className="text-amber-400" />
                <span>{branchData.branchCode}</span>
                {copiedKey === 'hero_code' ? (
                  <Check size={11} className="text-emerald-400 ml-0.5" />
                ) : (
                  <Copy size={10} className="text-amber-400 group-hover:text-amber-300 ml-0.5" />
                )}
              </button>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-medium border border-purple-500/25">
                <CheckCircle2 size={11} className="text-purple-400" />
                {branchData.libraryType || 'Private Study Hub'}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                <Calendar size={11} className="text-slate-400" />
                Est. {branchData.establishmentDate || '2021'}
              </span>

              <button
                type="button"
                onClick={onOpenWifiModal}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/25 motion-safe:transition-all cursor-pointer"
                title="Open Student Wi-Fi Front Desk Standee"
              >
                <Wifi size={11} className="text-cyan-400" />
                <span>Wi-Fi Standee QR</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] shrink-0 self-start md:self-auto">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <span className="text-slate-200 font-semibold block">Central Master Record</span>
            <span className="text-slate-400 text-[10px] block">Governed by SuperAdmin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
