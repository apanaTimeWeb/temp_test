'use client';
// RESPONSIBILITY: Render 6 security audit KPI metric cards (Login history, failed login, locked accounts, permission changes, exports, suspicious activity) with Cyber-Luxury styling.

import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, UserCog, DownloadCloud, AlertTriangle } from 'lucide-react';
import type { SecurityReportsKpiData } from '../types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityNumber } from '../utils/SuperadminAnalyticsSecurityReportsFormatters';

interface Props {
  kpis?: SecurityReportsKpiData;
}

export function SuperadminAnalyticsSecurityReportsKpiGrid({ kpis }: Props) {
  const data = kpis ?? {
    totalLogins: 0,
    failedLogins: 0,
    lockedAccounts: 0,
    permissionChanges: 0,
    dataExports: 0,
    suspiciousActivities: 0,
    threatDistribution: [],
  };

  const cards = [
    {
      title: 'Total Login History',
      value: formatSecurityNumber(data.totalLogins),
      subtitle: 'Authenticated sessions',
      icon: ShieldCheck,
      cardBg: 'bg-gradient-to-br from-[#061e14]/95 via-[#061810]/90 to-[#0a2e1d]/85 border-emerald-500/30 hover:border-emerald-400/50 shadow-emerald-950/40',
      iconStyle: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20',
      blurColor: 'bg-emerald-500/15',
      valueColor: 'text-emerald-300',
      badgeStyle: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      dotColor: 'bg-emerald-400',
    },
    {
      title: 'Failed Logins',
      value: formatSecurityNumber(data.failedLogins),
      subtitle: 'Auth rejections logged',
      icon: ShieldAlert,
      cardBg: 'bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/85 border-amber-500/30 hover:border-amber-400/50 shadow-amber-950/40',
      iconStyle: 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20',
      blurColor: 'bg-amber-500/15',
      valueColor: 'text-amber-300',
      badgeStyle: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      dotColor: 'bg-amber-400',
    },
    {
      title: 'Locked Accounts',
      value: formatSecurityNumber(data.lockedAccounts),
      subtitle: 'Security lockouts',
      icon: Lock,
      cardBg: 'bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/85 border-rose-500/30 hover:border-rose-400/50 shadow-rose-950/40',
      iconStyle: 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/20',
      blurColor: 'bg-rose-500/15',
      valueColor: 'text-rose-300',
      badgeStyle: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
      dotColor: 'bg-rose-400 animate-pulse',
    },
    {
      title: 'Permission Changes',
      value: formatSecurityNumber(data.permissionChanges),
      subtitle: 'Role & privilege shifts',
      icon: UserCog,
      cardBg: 'bg-gradient-to-br from-[#0e0c28]/95 via-[#0a0920]/90 to-[#1a1444]/85 border-indigo-500/30 hover:border-indigo-400/50 shadow-indigo-950/40',
      iconStyle: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 shadow-indigo-500/20',
      blurColor: 'bg-indigo-500/15',
      valueColor: 'text-indigo-200',
      badgeStyle: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
      dotColor: 'bg-indigo-400',
    },
    {
      title: 'Data Exports Triggered',
      value: formatSecurityNumber(data.dataExports),
      subtitle: 'Tenant extractions',
      icon: DownloadCloud,
      cardBg: 'bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/85 border-sky-500/30 hover:border-sky-400/50 shadow-sky-950/40',
      iconStyle: 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sky-500/20',
      blurColor: 'bg-sky-500/15',
      valueColor: 'text-sky-200',
      badgeStyle: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
      dotColor: 'bg-sky-400',
    },
    {
      title: 'Suspicious Activities',
      value: formatSecurityNumber(data.suspiciousActivities),
      subtitle: 'Flagged IP anomalies',
      icon: AlertTriangle,
      cardBg: 'bg-gradient-to-br from-[#20080e]/95 via-[#18050a]/90 to-[#320c15]/85 border-rose-500/35 hover:border-rose-400/55 shadow-rose-950/50',
      iconStyle: 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/20',
      blurColor: 'bg-rose-500/15',
      valueColor: 'text-rose-300',
      badgeStyle: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
      dotColor: 'bg-rose-400 animate-pulse',
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5"
      data-testid="security-reports-kpi-grid"
    >
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`group relative overflow-hidden p-4 rounded-2xl border shadow-lg backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${card.cardBg}`}
          >
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full blur-xl transition-all duration-500 group-hover:scale-125 ${card.blurColor}`} />
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md ${card.iconStyle}`}>
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
