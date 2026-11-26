// RESPONSIBILITY: Render system aggregate KPI meters across all 12 resources for SuperAdmin overview.
import React from 'react';
import { Building2, Users, HardDrive, MessageSquare, Database, ShieldCheck } from 'lucide-react';
import type { SystemUsageAggregates } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/types/SuperadminUsageOverviewTypes';
import { calculateUsagePercent } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/utils/SuperadminUsageOverviewFormatters';

interface SuperadminUsageOverviewKpiCardsProps {
  summary?: SystemUsageAggregates;
}

export function SuperadminUsageOverviewKpiCards({ summary }: SuperadminUsageOverviewKpiCardsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-indigo-500/20 bg-[#0a0d24]/60 motion-safe:animate-pulse" />
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

  const kpis = [
    {
      id: 'branches',
      title: '1. Branches',
      used: summary.totalBranchesUsed,
      limit: `${summary.totalBranchesLimit} cap`,
      pct: branchPct,
      icon: Building2,
      border: 'border-sky-500/30',
      bg: 'bg-gradient-to-br from-sky-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      text: 'text-sky-400',
      bar: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    },
    {
      id: 'admins_staff',
      title: '2-3. Admins & Staff',
      used: adminStaffUsed,
      limit: `${adminStaffLimit} cap`,
      pct: adminStaffPct,
      icon: ShieldCheck,
      border: 'border-indigo-500/30',
      bg: 'bg-gradient-to-br from-indigo-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      text: 'text-indigo-400',
      bar: 'bg-gradient-to-r from-indigo-500 to-purple-400',
    },
    {
      id: 'members',
      title: '4. Members',
      used: summary.totalMembersUsed.toLocaleString(),
      limit: summary.totalMembersLimit.toLocaleString(),
      pct: memberPct,
      icon: Users,
      border: 'border-emerald-500/30',
      bg: 'bg-gradient-to-br from-emerald-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      text: 'text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    },
    {
      id: 'storage',
      title: '5-6. Cloud Storage',
      used: `${summary.totalStorageGbUsed.toFixed(1)} GB`,
      limit: `${summary.totalStorageGbLimit} GB`,
      pct: storagePct,
      icon: HardDrive,
      border: 'border-purple-500/30',
      bg: 'bg-gradient-to-br from-purple-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      text: 'text-purple-400',
      bar: 'bg-gradient-to-r from-purple-500 to-pink-400',
    },
    {
      id: 'comms',
      title: '7-9. Communication',
      used: `${summary.totalSmsSent.toLocaleString()} SMS`,
      limit: `${summary.totalWhatsappSent.toLocaleString()} WA`,
      pct: smsPct,
      icon: MessageSquare,
      border: 'border-amber-500/30',
      bg: 'bg-gradient-to-br from-amber-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      text: 'text-amber-400',
      bar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    },
    {
      id: 'apis_backups',
      title: '10-12. APIs & Backups',
      used: `${(summary.totalApiCallsMonthly / 1000).toFixed(0)}k APIs`,
      limit: `${summary.totalBackupsHealthyCount} Snapshots`,
      pct: 100,
      pctLabel: 'Healthy',
      icon: Database,
      border: 'border-cyan-500/30',
      bg: 'bg-gradient-to-br from-cyan-950/40 via-[#0a0d24] to-[#060814]',
      iconTile: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      text: 'text-cyan-400',
      bar: 'bg-gradient-to-r from-cyan-500 to-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`p-3.5 rounded-2xl border ${kpi.border} ${kpi.bg} shadow-lg backdrop-blur-md flex flex-col justify-between space-y-2.5 motion-safe:transition-all hover:scale-[1.01]`}
          >
            {/* Top row: Icon + Title + Percentage */}
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${kpi.text} truncate`}>
                <span className={`p-1 rounded-lg border ${kpi.iconTile} shrink-0`}>
                  <Icon className="h-3 w-3" />
                </span>
                <span className="truncate">{kpi.title}</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-300 shrink-0 ml-1">
                {kpi.pctLabel ?? `${kpi.pct}%`}
              </span>
            </div>

            {/* Middle row: Large Metric Value */}
            <div className="text-base sm:text-lg font-black text-white tracking-tight truncate">
              {kpi.used} <span className="text-xs font-normal text-slate-400">/ {kpi.limit}</span>
            </div>

            {/* Bottom row: Styled Progress Bar */}
            <div className="w-full bg-slate-900 border border-indigo-500/15 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-500 ${kpi.bar}`}
                style={{ width: `${Math.min(100, kpi.pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}