'use client';

import { PAYROLL_MONTHS } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';
import type { AdminStaffPayrollModel } from '@/app/frontend_admin/admin_staff/staff_payroll/types/AdminStaffPayrollTypes';
import { Calendar, CheckCircle2, Clock, Search, TrendingDown, Users, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  model: AdminStaffPayrollModel;
}

export function AdminStaffPayrollKpiOverview({ model }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const { filters, setSelectedMonth, setSearchQuery, kpis } = model;
  const progressPercent = kpis.totalPayrollAmount > 0 ? Math.round((kpis.disbursedAmount / kpis.totalPayrollAmount) * 100) : 0;

  const cards = [
    { label: t('KPI_TOTAL_PAYROLL'), value: `₹${kpis.totalPayrollAmount.toLocaleString('en-IN')}`, sub: 'Total Gross Budget', border: 'border-info', iconBg: 'border-info bg-info-bg text-info-text', valueColor: 'text-text-primary', Icon: Wallet },
    { label: t('KPI_DISBURSED_AMOUNT'), value: `₹${kpis.disbursedAmount.toLocaleString('en-IN')}`, sub: 'Processed & Paid', border: 'border-success', iconBg: 'border-success bg-success-bg text-success-text', valueColor: 'text-success-text', Icon: CheckCircle2 },
    { label: t('KPI_PENDING_AMOUNT'), value: `₹${kpis.pendingAmount.toLocaleString('en-IN')}`, sub: 'Awaiting Authorization', border: 'border-warning', iconBg: 'border-warning bg-warning-bg text-warning-text', valueColor: 'text-warning-text', Icon: Clock },
    { label: t('KPI_TOTAL_STAFF'), value: kpis.totalStaffCount, sub: 'Payroll Employees', border: 'border-primary', iconBg: 'border-primary bg-info-bg text-primary-text', valueColor: 'text-text-primary', Icon: Users },
    { label: t('KPI_TOTAL_DEDUCTIONS'), value: `₹${kpis.totalDeductions.toLocaleString('en-IN')}`, sub: 'Unpaid & Advance', border: 'border-danger', iconBg: 'border-danger bg-danger-bg text-danger-text', valueColor: 'text-danger-text', Icon: TrendingDown },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, sub, border, iconBg, valueColor, Icon }) => (
          <div key={label} className={`group relative overflow-hidden rounded-2xl border ${border} bg-card p-4 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl`}>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
              <div className={`p-2 rounded-xl border ${iconBg}`}>
                <Icon size={15} strokeWidth={2.2} />
              </div>
            </div>
            <p className={`relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight tabular-nums ${valueColor}`}>{value}</p>
            <span className="relative z-10 mt-2 block border-t border-border pt-1.5 text-[11px] font-medium text-text-secondary">{sub}</span>
          </div>
        ))}

        <div className="group relative overflow-hidden rounded-2xl border border-info bg-card p-4 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-semibold uppercase tracking-wider">{t('KPI_PAYOUT_PROGRESS')}</span>
            <span className="font-bold text-info-text">{progressPercent}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full bg-success motion-safe:transition-all motion-safe:duration-500 admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(progressPercent)))}`}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('KPI_PAYOUT_PROGRESS')}
            />
          </div>
          <span className="mt-2 block text-[11px] text-text-secondary">Completion rate</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 mr-1">
            <Calendar size={14} />
            {t('FILTER_PERIOD')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PAYROLL_MONTHS.map((m) => {
              const isSelected = filters.selectedMonth === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMonth(m.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium motion-safe:transition-all ${
                    isSelected ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface text-text-secondary hover:bg-card-hover'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            maxLength={100}
            type="text"
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-input py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
export default AdminStaffPayrollKpiOverview;
