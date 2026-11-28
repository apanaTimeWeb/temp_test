'use client';

import type { AdminMembersMember, AdminMembersRenewal } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { AlertTriangle, CheckCircle, UserPlus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminMembersDirectoryKpiGridProps {
  dummyMembers: readonly AdminMembersMember[];
  demoRenewals: readonly AdminMembersRenewal[];
}

export function AdminMembersDirectoryKpiGrid({ dummyMembers, demoRenewals }: AdminMembersDirectoryKpiGridProps) {
  const t = useTranslations('ADMIN_MEMBERS');

  const kpis = [
    {
      label: t('KPI_TOTAL_MEMBERS'),
      value: String(dummyMembers.length),
      icon: Users,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'bg-info-bg border-info text-info-text',
      trend: 'All Registered',
    },
    {
      label: t('KPI_ACTIVE_MEMBERS'),
      value: String(dummyMembers.filter((member) => member.status === 'Active').length),
      icon: CheckCircle,
      iconBox: 'bg-success-bg border-success text-success-text',
      strokeColor: 'var(--chart-success)',
      badgeBg: 'bg-success-bg border-success text-success-text',
      trend: 'In Good Standing',
    },
    {
      label: t('KPI_NEW_THIS_MONTH'),
      value: dummyMembers.length === 0 ? '0' : String(Math.max(1, Math.ceil(dummyMembers.length * 0.25))),
      icon: UserPlus,
      iconBox: 'bg-purple-bg border-border text-purple',
      strokeColor: 'var(--chart-primary)',
      badgeBg: 'bg-purple-bg border-border text-purple',
      trend: 'Current Cycle',
    },
    {
      label: t('KPI_PENDING_RENEWALS'),
      value: String(demoRenewals.filter((renewal) => !renewal.reminderRecorded).length),
      icon: AlertTriangle,
      iconBox: 'bg-danger-bg border-danger text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'bg-danger-bg border-danger text-danger-text',
      trend: 'Action Required',
    },
  ];

  return (
    <section aria-label={t('DEMO_METRICS_NOTICE')} className="space-y-2">
      <p className="sr-only" role="note">{t('DEMO_METRICS_NOTICE')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${kpi.iconBox}`}>
                <kpi.icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">{kpi.value}</div>
            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${kpi.badgeBg}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
