'use client';
// RESPONSIBILITY: Render 6 resource usage KPI metric cards (Members, staff, branches, storage, API calls, SMS/WhatsApp) with Cyber-Luxury styling.

import React from 'react';
import { Users, UserCheck, GitBranch, HardDrive, Cpu, MessageSquare } from 'lucide-react';
import type { UsageReportsKpiData } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber, formatStorageSize } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/utils/SuperadminAnalyticsUsageReportsFormatters';

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
      cardBg: 'bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/85 border-sky-500/30 hover:border-sky-400/50 shadow-sky-950/40',
      iconStyle: 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sky-500/20',
      blurColor: 'bg-sky-500/15',
      valueColor: 'text-sky-200',
      badgeStyle: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
      dotColor: 'bg-sky-400',
    },
    {
      title: 'Active Staff & Operators',
      value: formatUsageNumber(data.totalStaff),
      subtitle: 'Managers & clerks',
      icon: UserCheck,
      cardBg: 'bg-gradient-to-br from-[#0e0c28]/95 via-[#0a0920]/90 to-[#1a1444]/85 border-indigo-500/30 hover:border-indigo-400/50 shadow-indigo-950/40',
      iconStyle: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 shadow-indigo-500/20',
      blurColor: 'bg-indigo-500/15',
      valueColor: 'text-indigo-200',
      badgeStyle: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
      dotColor: 'bg-indigo-400',
    },
    {
      title: 'Operating Branches',
      value: formatUsageNumber(data.activeBranches),
      subtitle: 'Provisioned nodes',
      icon: GitBranch,
      cardBg: 'bg-gradient-to-br from-[#061e14]/95 via-[#061810]/90 to-[#0a2e1d]/85 border-emerald-500/30 hover:border-emerald-400/50 shadow-emerald-950/40',
      iconStyle: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20',
      blurColor: 'bg-emerald-500/15',
      valueColor: 'text-emerald-300',
      badgeStyle: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      dotColor: 'bg-emerald-400 motion-safe:animate-pulse',
    },
    {
      title: 'Cloud Storage Used',
      value: formatStorageSize(data.storageUsedGb * 1024),
      subtitle: `Quota: ${data.storageQuotaGb} GB`,
      icon: HardDrive,
      cardBg: 'bg-gradient-to-br from-[#1a0a2a]/95 via-[#130722]/90 to-[#280d3f]/85 border-purple-500/30 hover:border-purple-400/50 shadow-purple-950/40',
      iconStyle: 'bg-purple-500/20 border-purple-500/40 text-purple-400 shadow-purple-500/20',
      blurColor: 'bg-purple-500/15',
      valueColor: 'text-purple-200',
      badgeStyle: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
      dotColor: 'bg-purple-400',
    },
    {
      title: 'API Calls Volume',
      value: formatUsageNumber(data.apiCallsCount),
      subtitle: 'Monthly REST ingress',
      icon: Cpu,
      cardBg: 'bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/85 border-amber-500/30 hover:border-amber-400/50 shadow-amber-950/40',
      iconStyle: 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20',
      blurColor: 'bg-amber-500/15',
      valueColor: 'text-amber-300',
      badgeStyle: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      dotColor: 'bg-amber-400',
    },
    {
      title: 'SMS & WhatsApp Consumption',
      value: `${formatUsageNumber(data.smsConsumed)} / ${formatUsageNumber(data.whatsappConsumed)}`,
      subtitle: 'Transactional dispatch',
      icon: MessageSquare,
      cardBg: 'bg-gradient-to-br from-[#072017]/95 via-[#051912]/90 to-[#0c3123]/85 border-teal-500/30 hover:border-teal-400/50 shadow-teal-950/40',
      iconStyle: 'bg-teal-500/20 border-teal-500/40 text-teal-400 shadow-teal-500/20',
      blurColor: 'bg-teal-500/15',
      valueColor: 'text-teal-300',
      badgeStyle: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
      dotColor: 'bg-teal-400 motion-safe:animate-pulse',
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
            className={`group relative overflow-hidden p-4 rounded-2xl border shadow-lg backdrop-blur-md flex flex-col justify-between motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] ${card.cardBg}`}
          >
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full blur-xl motion-safe:transition-all motion-safe:duration-500 group-hover:scale-125 ${card.blurColor}`} />
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md ${card.iconStyle}`}>
                <Icon size={16} strokeWidth={2.3} aria-hidden="true" />
              </div>
            </div>
            <div className="relative mt-2.5">
              <p className={`text-2xl font-black tracking-tight ${card.valueColor}`}>{card.value}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full px-2 py-0.5 border text-[11px] ${card.badgeStyle}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
