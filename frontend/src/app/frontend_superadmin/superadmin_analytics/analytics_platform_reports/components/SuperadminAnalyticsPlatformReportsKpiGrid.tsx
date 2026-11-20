'use client';
// RESPONSIBILITY: Render KPI metric stat cards for Platform Reports overview.

import React from 'react';
import { Building2, GitBranch, ShieldCheck, TrendingUp, UserPlus, UserX } from 'lucide-react';
import type { PlatformReportsKpiData } from '../types/SuperadminAnalyticsPlatformReportsTypes';
import { formatPlatformReportNumber, formatPlatformReportPercent } from '../utils/SuperadminAnalyticsPlatformReportsFormatters';

interface Props {
  kpis?: PlatformReportsKpiData;
}

export function SuperadminAnalyticsPlatformReportsKpiGrid({ kpis }: Props) {
  const data = kpis ?? {
    totalLibraries: 0,
    totalBranches: 0,
    activeAccounts: 0,
    activeAccountsRate: 0,
    growthRate: 0,
    accountCreations: 0,
    accountCancellations: 0,
    churnRate: 0,
  };

  const cards = [
    {
      title: 'Total Libraries',
      value: formatPlatformReportNumber(data.totalLibraries),
      subtitle: 'Registered SaaS tenants',
      icon: Building2,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Total Branches',
      value: formatPlatformReportNumber(data.totalBranches),
      subtitle: 'Active physical study centers',
      icon: GitBranch,
      colorText: 'text-indigo-400',
      colorBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Active Accounts',
      value: formatPlatformReportNumber(data.activeAccounts),
      subtitle: `${data.activeAccountsRate}% operational rate`,
      icon: ShieldCheck,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Platform Growth',
      value: formatPlatformReportPercent(data.growthRate),
      subtitle: 'Month-over-month expansion',
      icon: TrendingUp,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'New Account Creation',
      value: `+${formatPlatformReportNumber(data.accountCreations)}`,
      subtitle: 'Onboarded this period',
      icon: UserPlus,
      colorText: 'text-violet-400',
      colorBg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Account Cancellation',
      value: `${formatPlatformReportNumber(data.accountCancellations)}`,
      subtitle: `${data.churnRate}% tenant churn`,
      icon: UserX,
      colorText: 'text-rose-400',
      colorBg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-2xl border ${c.colorBg} bg-card/60 backdrop-blur-xs flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xs`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.colorText} bg-background/50`}>
                <Icon size={16} aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
