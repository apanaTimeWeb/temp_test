'use client';

import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { Calendar, Phone, Target, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type AdminCrmTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

interface AdminMembersEnquiriesHeaderKpisProps {
  timeFiltered: readonly Enquiry[];
  timeRange: AdminCrmTimeRange;
  onChangeTimeRange: (range: AdminCrmTimeRange) => void;
  customStartDate: string;
  customEndDate: string;
  onChangeStartDate: (val: string) => void;
  onChangeEndDate: (val: string) => void;
  timeRangeLabel: string;
}

export function AdminMembersEnquiriesHeaderKpis({
  timeFiltered,
  timeRange,
  onChangeTimeRange,
  customStartDate,
  customEndDate,
  onChangeStartDate,
  onChangeEndDate,
  timeRangeLabel,
}: AdminMembersEnquiriesHeaderKpisProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const totalLeads = timeFiltered.length;
  const newProspects = timeFiltered.filter((e) => e.status === 'New').length;
  const inPipeline = timeFiltered.filter((e) => ['Visited', 'Interested'].includes(e.status)).length;
  const converted = timeFiltered.filter((e) => e.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

  const kpis = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      sub: `All enquiries in ${timeRangeLabel}`,
    },
    {
      label: 'New Prospects',
      value: newProspects,
      icon: UserCheck,
      iconBox: 'bg-primary-subtle border-border-focus text-primary',
      strokeColor: 'var(--chart-primary)',
      sub: `Fresh inbound leads (${timeRangeLabel})`,
    },
    {
      label: 'In Pipeline',
      value: inPipeline,
      icon: TrendingUp,
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      strokeColor: 'var(--chart-warning)',
      sub: `Visited + Interested (${timeRangeLabel})`,
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: Target,
      iconBox: 'bg-success-bg border-success text-success-text',
      strokeColor: 'var(--chart-success)',
      sub: `${converted} admitted in ${timeRangeLabel}`,
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
                <Phone size={22} className="text-primary" aria-hidden="true" />
                <span>{t('PAGE_TITLE')}</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{totalLeads} Active Enquiries</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2.5 py-0.5 text-[11px] font-mono text-text-secondary">
                Range: <span className="text-primary font-semibold">{timeRangeLabel}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
              Track prospective student desk enquiries, preferred study shifts, and admission conversions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface-highlight p-1.5">
            <div className="flex items-center rounded-lg bg-card p-1 border border-border">
              {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangeTimeRange(r)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors ${
                    timeRange === r ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : (
                    <>
                      <Calendar className="h-3 w-3" aria-hidden="true" /> Custom
                    </>
                  )}
                </button>
              ))}
            </div>
            {timeRange === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input maxLength={100} type="date" value={customStartDate} onChange={(e) => onChangeStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                <span className="text-text-secondary">to</span>
                <input maxLength={100} type="date" value={customEndDate} onChange={(e) => onChangeEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, iconBox, strokeColor, sub }) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconBox}`}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">{value}</p>
            <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary truncate">{sub}</p>
          </div>
        ))}
      </div>
    </>
  );
}
