'use client';

import { useTranslations } from 'next-intl';

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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-border bg-surface-highlight p-3">
        <span className="text-xs text-text-secondary">{t('kpiTotalOverstays')}</span>
        <p className="mt-1 text-2xl font-bold text-text-primary">{totalIncidents}</p>
        <span className="text-xs text-text-secondary">Across 3 active branches</span>
      </div>
      <div className="rounded-lg border border-border bg-surface-highlight p-3">
        <span className="text-xs text-text-secondary">{t('kpiRevenueRecovered')}</span>
        <p className="mt-1 text-2xl font-bold text-success-text">₹{totalFinesRecovered}</p>
        <span className="text-xs text-text-secondary">Recovered penalty dues</span>
      </div>
      <div className="rounded-lg border border-border bg-surface-highlight p-3">
        <span className="text-xs text-text-secondary">{t('kpiAvgOverstayMins')}</span>
        <p className="mt-1 text-2xl font-bold text-text-primary">32m</p>
        <span className="text-xs text-text-secondary">Per detected incident</span>
      </div>
      <div className="rounded-lg border border-border bg-surface-highlight p-3">
        <span className="text-xs text-text-secondary">{t('kpiGhostRate')}</span>
        <p className="mt-1 text-2xl font-bold text-warning-text">4.8%</p>
        <span className="text-xs text-text-secondary">Shift transition leak</span>
      </div>
    </div>
  );
}

export default AdminShiftsGapAuditSummary;

