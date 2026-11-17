'use client';

import { useTranslations } from 'next-intl';
import { ShieldAlert, IndianRupee, Clock, Activity } from 'lucide-react';

interface AdminShiftsGapAuditSummaryProps {
  totalIncidents: number;
  totalFinesRecovered: number;
}

export function AdminShiftsGapAuditSummary({
  totalIncidents,
  totalFinesRecovered,
}: AdminShiftsGapAuditSummaryProps) {
  const t = useTranslations('ADMIN_SHIFTS');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
      <div className="relative overflow-hidden rounded-xl border border-rose-500/20 bg-linear-to-br from-rose-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{t('kpiTotalOverstays')}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <ShieldAlert size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{totalIncidents}</p>
        <p className="mt-1 text-xs text-text-secondary">Detected overstay audits</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{t('kpiRevenueRecovered')}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">₹{totalFinesRecovered}</p>
        <p className="mt-1 text-xs text-text-secondary">Recovered penalty dues</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{t('kpiAvgOverstayMins')}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">32m</p>
        <p className="mt-1 text-xs text-text-secondary">Average duration / case</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{t('kpiGhostRate')}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Activity size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">4.8%</p>
        <p className="mt-1 text-xs text-text-secondary">Shift transition leak</p>
      </div>
    </div>
  );
}

export default AdminShiftsGapAuditSummary;
