// components/SuperadminUsageQuotaRequestsKpiCards.tsx
// RESPONSIBILITY: Display aggregate KPI telemetry cards for quota expansion requests.
import React from 'react';
import { GitBranch, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { QuotaRequestsKpis } from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/types/SuperadminUsageQuotaRequestsTypes';

interface SuperadminUsageQuotaRequestsKpiCardsProps {
  kpis?: QuotaRequestsKpis;
}

export function SuperadminUsageQuotaRequestsKpiCards({
  kpis,
}: SuperadminUsageQuotaRequestsKpiCardsProps) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-indigo-500/20 bg-[#0a0d24]/60 motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Pending Review',
      value: kpis.pendingReviewCount,
      sub: `${kpis.branchExpansionRequestsCount} branch expansion requests`,
      icon: Clock,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-gradient-to-br from-amber-950/40 via-[#0a0d24] to-[#060814]',
      badge: 'Action Required',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconTile: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Branch Expansions',
      value: kpis.branchExpansionRequestsCount,
      sub: '4th branch creation requests',
      icon: GitBranch,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-gradient-to-br from-indigo-950/40 via-[#0a0d24] to-[#060814]',
      badge: 'High Priority',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      iconTile: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    },
    {
      title: 'Approved Quotas',
      value: kpis.approvedCount,
      sub: 'Active expanded allocations',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-gradient-to-br from-emerald-950/40 via-[#0a0d24] to-[#060814]',
      badge: 'Active Addons',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      iconTile: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Rejected Requests',
      value: kpis.rejectedCount,
      sub: 'Capacity or policy denied',
      icon: XCircle,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-gradient-to-br from-rose-950/40 via-[#0a0d24] to-[#060814]',
      badge: 'Archived',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      iconTile: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-2xl border ${c.border} ${c.bg} shadow-lg backdrop-blur-xl flex flex-col justify-between space-y-2 hover:scale-[1.01] motion-safe:transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className={`p-1.5 rounded-lg border ${c.iconTile}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {c.title}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${c.badgeClass}`}>
                {c.badge}
              </span>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{c.value}</div>
            <div className="text-[11px] text-slate-400">{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}