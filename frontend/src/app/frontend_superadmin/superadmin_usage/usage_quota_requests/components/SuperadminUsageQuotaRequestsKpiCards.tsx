// components/SuperadminUsageQuotaRequestsKpiCards.tsx
// RESPONSIBILITY: Display aggregate KPI telemetry cards for quota expansion requests.
import React from 'react';
import { GitBranch, Clock, CheckCircle2, XCircle, Layers } from 'lucide-react';
import type { QuotaRequestsKpis } from '../types/SuperadminUsageQuotaRequestsTypes';

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
          <div key={i} className="h-24 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse" />
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
      bg: 'bg-amber-500/10 border-amber-500/30',
      badge: 'Action Required',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      title: 'Branch Expansions',
      value: kpis.branchExpansionRequestsCount,
      sub: '4th branch creation requests',
      icon: GitBranch,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      badge: 'High Priority',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      title: 'Approved Quotas',
      value: kpis.approvedCount,
      sub: 'Active expanded allocations',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      badge: 'Active Addons',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      title: 'Rejected Requests',
      value: kpis.rejectedCount,
      sub: 'Capacity or policy denied',
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      badge: 'Archived',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-xl border ${c.bg} backdrop-blur-xl flex flex-col justify-between space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Icon className={`h-4 w-4 ${c.color}`} /> {c.title}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeClass}`}>
                {c.badge}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{c.value}</div>
            <div className="text-[11px] text-slate-400">{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
