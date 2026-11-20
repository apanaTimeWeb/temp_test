// RESPONSIBILITY: Render system aggregate KPI meters across all 12 resources for SuperAdmin overview.
import React from 'react';
import { Building2, Users, HardDrive, MessageSquare, Database, ShieldCheck } from 'lucide-react';
import type { SystemUsageAggregates } from '../types/SuperadminUsageOverviewTypes';
import { calculateUsagePercent } from '../utils/SuperadminUsageOverviewFormatters';

interface SuperadminUsageOverviewKpiCardsProps {
  summary?: SystemUsageAggregates;
}

export function SuperadminUsageOverviewKpiCards({ summary }: SuperadminUsageOverviewKpiCardsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse" />
        ))}
      </div>
    );
  }

  const branchPct = calculateUsagePercent(summary.totalBranchesUsed, summary.totalBranchesLimit);
  const memberPct = calculateUsagePercent(summary.totalMembersUsed, summary.totalMembersLimit);
  const storagePct = calculateUsagePercent(summary.totalStorageGbUsed, summary.totalStorageGbLimit);
  const smsPct = calculateUsagePercent(summary.totalSmsSent, summary.totalSmsLimit);
  const adminStaffUsed = summary.totalAdminsUsed + summary.totalStaffUsed;
  const adminStaffLimit = summary.totalAdminsLimit + summary.totalStaffLimit;
  const adminStaffPct = calculateUsagePercent(adminStaffUsed, adminStaffLimit);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Branches */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-sky-400">
            <Building2 className="h-3.5 w-3.5" /> 1. Branches
          </span>
          <span className="font-mono text-[11px]">{branchPct}%</span>
        </div>
        <div className="text-lg font-black text-white">
          {summary.totalBranchesUsed} <span className="text-xs font-normal text-slate-400">/ {summary.totalBranchesLimit} cap</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-sky-400 h-full rounded-full transition-all" style={{ width: `${branchPct}%` }} />
        </div>
      </div>

      {/* 2 & 3. Admins & Staff */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-indigo-400">
            <ShieldCheck className="h-3.5 w-3.5" /> 2-3. Admins & Staff
          </span>
          <span className="font-mono text-[11px]">{adminStaffPct}%</span>
        </div>
        <div className="text-lg font-black text-white">
          {adminStaffUsed} <span className="text-xs font-normal text-slate-400">/ {adminStaffLimit} cap</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-400 h-full rounded-full transition-all" style={{ width: `${adminStaffPct}%` }} />
        </div>
      </div>

      {/* 4. Members */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
            <Users className="h-3.5 w-3.5" /> 4. Members
          </span>
          <span className="font-mono text-[11px]">{memberPct}%</span>
        </div>
        <div className="text-lg font-black text-white">
          {summary.totalMembersUsed.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {summary.totalMembersLimit.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${memberPct}%` }} />
        </div>
      </div>

      {/* 5 & 6. Storage & Uploads */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-purple-400">
            <HardDrive className="h-3.5 w-3.5" /> 5-6. Cloud Storage
          </span>
          <span className="font-mono text-[11px]">{storagePct}%</span>
        </div>
        <div className="text-lg font-black text-white">
          {summary.totalStorageGbUsed.toFixed(1)} GB <span className="text-xs font-normal text-slate-400">/ {summary.totalStorageGbLimit} GB</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-purple-400 h-full rounded-full transition-all" style={{ width: `${storagePct}%` }} />
        </div>
      </div>

      {/* 7, 8, 9. SMS, WhatsApp & Email */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-amber-400">
            <MessageSquare className="h-3.5 w-3.5" /> 7-9. Communication
          </span>
          <span className="font-mono text-[11px]">{smsPct}%</span>
        </div>
        <div className="text-lg font-black text-white">
          {summary.totalSmsSent.toLocaleString()} <span className="text-xs font-normal text-slate-400">SMS / {summary.totalWhatsappSent.toLocaleString()} WA</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${smsPct}%` }} />
        </div>
      </div>

      {/* 10, 11, 12. APIs, Exports & Backups */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-cyan-400">
            <Database className="h-3.5 w-3.5" /> 10-12. APIs & Backups
          </span>
          <span className="font-mono text-[11px]">Healthy</span>
        </div>
        <div className="text-lg font-black text-white">
          {(summary.totalApiCallsMonthly / 1000).toFixed(0)}k <span className="text-xs font-normal text-slate-400">APIs • {summary.totalBackupsHealthyCount} Snapshots</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-400 h-full rounded-full" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
