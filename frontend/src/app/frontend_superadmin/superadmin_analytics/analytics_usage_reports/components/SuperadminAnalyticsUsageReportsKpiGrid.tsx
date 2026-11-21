'use client';
// RESPONSIBILITY: Render 6 resource usage KPI metric cards (Members, staff, branches, storage, API calls, SMS/WhatsApp).

import React from 'react';
import { Users, UserCheck, GitBranch, HardDrive, Cpu, MessageSquare } from 'lucide-react';
import type { UsageReportsKpiData } from '../types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber, formatStorageSize } from '../utils/SuperadminAnalyticsUsageReportsFormatters';

interface Props {
  kpis?: UsageReportsKpiData;
}

export function SuperadminAnalyticsUsageReportsKpiGrid({ kpis }: Props) {
  const data = kpis ?? {
    totalMembers: 0,
    totalStaff: 0,
    activeBranches: 0,
    storageUsedGb: 0,
    storageQuotaGb: 0,
    apiCallsCount: 0,
    smsConsumed: 0,
    whatsappConsumed: 0,
    consumptionBreakdown: [],
  };

  const cards = [
    {
      title: 'Total Members',
      value: formatUsageNumber(data.totalMembers),
      subtitle: 'Enrolled across libraries',
      icon: Users,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Active Staff & Operators',
      value: formatUsageNumber(data.totalStaff),
      subtitle: 'Library managers & clerks',
      icon: UserCheck,
      colorText: 'text-indigo-400',
      colorBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Operating Branches',
      value: formatUsageNumber(data.activeBranches),
      subtitle: 'Provisioned physical nodes',
      icon: GitBranch,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Cloud Storage Used',
      value: formatStorageSize(data.storageUsedGb * 1024),
      subtitle: `Quota: ${data.storageQuotaGb} GB allocated`,
      icon: HardDrive,
      colorText: 'text-purple-400',
      colorBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'API Calls Volume',
      value: formatUsageNumber(data.apiCallsCount),
      subtitle: 'Monthly REST & RPC ingress',
      icon: Cpu,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'SMS & WhatsApp Consumption',
      value: `${formatUsageNumber(data.smsConsumed)} / ${formatUsageNumber(data.whatsappConsumed)}`,
      subtitle: 'Transactional & alert dispatch',
      icon: MessageSquare,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5"
      data-testid="usage-reports-kpi-grid"
    >
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${card.colorBg} bg-card/60 backdrop-blur-xs flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xs`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
              <div className={`p-1.5 rounded-lg ${card.colorText} bg-background/50`}>
                <Icon size={16} aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
