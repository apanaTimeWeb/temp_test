'use client';

import { Lock, ShieldAlert, UserX, Users } from 'lucide-react';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';

interface AdminMembersBlacklistKpiGridProps {
  records: readonly AdminBlacklistRecord[];
  branchCode: string | null;
}

export function AdminMembersBlacklistKpiGrid({ records, branchCode }: AdminMembersBlacklistKpiGridProps) {
  const kpis = [
    {
      label: 'Total Blacklisted',
      value: records.length,
      icon: ShieldAlert,
      iconBox: 'bg-danger-bg border-danger text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'border-danger bg-danger-bg text-danger-text',
      trend: 'Strict Restriction',
    },
    {
      label: 'Active Blocks',
      value: records.filter((r) => r.status === 'Blacklisted' || !r.status).length,
      icon: UserX,
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      strokeColor: 'var(--chart-warning)',
      badgeBg: 'border-warning bg-warning-bg text-warning-text',
      trend: 'Admission Prohibited',
    },
    {
      label: 'Revoked Seats',
      value: records.filter((r) => r.previousSeat).length,
      icon: Lock,
      iconBox: 'bg-purple-bg border-border text-purple',
      strokeColor: 'var(--chart-primary)',
      badgeBg: 'border-border bg-purple-bg text-purple',
      trend: 'Recovered Desks',
    },
    {
      label: 'Scope Coverage',
      value: branchCode ?? 'All Branches',
      icon: Users,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'border-info bg-info-bg text-info-text',
      trend: 'Policy Enforced',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">
              {kpi.label}
            </span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${kpi.iconBox}`}>
              <kpi.icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">
            {kpi.value}
          </div>
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${kpi.badgeBg}`}>
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
