'use client';
// RESPONSIBILITY: Render 6 security audit KPI metric cards (Login history, failed login, locked accounts, permission changes, exports, suspicious activity).

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
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Failed Logins',
      value: formatSecurityNumber(data.failedLogins),
      subtitle: 'Auth rejections logged',
      icon: ShieldAlert,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Locked Accounts',
      value: formatSecurityNumber(data.lockedAccounts),
      subtitle: 'Security lockouts enforced',
      icon: Lock,
      colorText: 'text-rose-400',
      colorBg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Permission Changes',
      value: formatSecurityNumber(data.permissionChanges),
      subtitle: 'Role & privilege shifts',
      icon: UserCog,
      colorText: 'text-indigo-400',
      colorBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Data Exports Triggered',
      value: formatSecurityNumber(data.dataExports),
      subtitle: 'Bulk tenant data extractions',
      icon: DownloadCloud,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Suspicious Activities',
      value: formatSecurityNumber(data.suspiciousActivities),
      subtitle: 'Anomalies & flagged IPs',
      icon: AlertTriangle,
      colorText: 'text-rose-400',
      colorBg: 'bg-rose-500/10 border-rose-500/20',
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
