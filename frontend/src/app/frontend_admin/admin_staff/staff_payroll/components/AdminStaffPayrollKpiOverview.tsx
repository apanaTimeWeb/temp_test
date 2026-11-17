'use client';

import { useTranslations } from 'next-intl';
import {
  Wallet,
  CheckCircle2,
  Clock,
  Users,
  TrendingDown,
  Building2,
  Calendar,
  Search,
} from 'lucide-react';
import type { AdminStaffPayrollModel } from '@/app/frontend_admin/admin_staff/staff_payroll/types/AdminStaffPayrollTypes';
import { PAYROLL_MONTHS } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';

interface Props {
  model: AdminStaffPayrollModel;
}

export function AdminStaffPayrollKpiOverview({ model }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const { filters, setSelectedMonth, setStatusFilter, setSearchQuery, kpis } = model;

  const progressPercent = kpis.totalPayrollAmount > 0
    ? Math.round((kpis.disbursedAmount / kpis.totalPayrollAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_TOTAL_PAYROLL')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            ₹{kpis.totalPayrollAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-text-muted">Total Gross Budget</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_DISBURSED_AMOUNT')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-bg text-success-text">
              <CheckCircle2 size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            ₹{kpis.disbursedAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-text-muted">Processed & Paid</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_PENDING_AMOUNT')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-bg text-warning-text">
              <Clock size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            ₹{kpis.pendingAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-text-muted">Awaiting Authorization</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_TOTAL_STAFF')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-bg text-info-text">
              <Users size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{kpis.totalStaffCount}</p>
          <span className="text-xs text-text-muted">Payroll Employees</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_TOTAL_DEDUCTIONS')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger-bg text-danger-text">
              <TrendingDown size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            ₹{kpis.totalDeductions.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-text-muted">Unpaid & Advance</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-semibold uppercase tracking-wider">{t('KPI_PAYOUT_PROGRESS')}</span>
            <span className="font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full bg-primary transition-all duration-300 admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(progressPercent)))}`}
            />
          </div>
          <p className="mt-2 text-[11px] text-text-disabled">
            {kpis.disbursedStaffCount} of {kpis.totalStaffCount} paid
          </p>
        </div>
      </div>

      {/* Controls Bar: Month Selector */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-end">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-secondary" />
          <span className="text-xs font-semibold text-text-secondary">{t('MONTH_SELECTOR_LABEL')}:</span>
          <select
            value={filters.selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="min-h-9 rounded-lg border border-border bg-input px-3 text-xs font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {PAYROLL_MONTHS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Status Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('SEARCH_PLACEHOLDER')}
            className="min-h-11 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-11 rounded-lg border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">{t('ALL_STATUSES')}</option>
            <option value="DISBURSED">{t('STATUS_DISBURSED')}</option>
            <option value="PENDING">{t('STATUS_PENDING')}</option>
            <option value="ON_HOLD">{t('STATUS_ON_HOLD')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdminStaffPayrollKpiOverview;

