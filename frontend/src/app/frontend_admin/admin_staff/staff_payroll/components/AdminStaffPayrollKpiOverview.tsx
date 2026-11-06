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

const BRANCH_OPTIONS = [
  { id: 'all', fallback: 'All Branches' },
  { id: 'BR-001', fallback: 'Downtown Central' },
  { id: 'BR-002', fallback: 'Westside Branch' },
  { id: 'BR-003', fallback: 'North Hub' },
];

export function AdminStaffPayrollKpiOverview({ model }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const { filters, setSelectedBranchId, setSelectedMonth, setStatusFilter, setSearchQuery, kpis } = model;

  const progressPercent = kpis.totalPayrollAmount > 0
    ? Math.round((kpis.disbursedAmount / kpis.totalPayrollAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Wallet size={16} />
            <span className="text-xs font-medium">{t('KPI_TOTAL_PAYROLL')}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-text-primary">
            ₹{kpis.totalPayrollAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-success-text">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium">{t('KPI_DISBURSED_AMOUNT')}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-success-text">
            ₹{kpis.disbursedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-warning-text">
            <Clock size={16} />
            <span className="text-xs font-medium">{t('KPI_PENDING_AMOUNT')}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-warning-text">
            ₹{kpis.pendingAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users size={16} />
            <span className="text-xs font-medium">{t('KPI_TOTAL_STAFF')}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-text-primary">{kpis.totalStaffCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-danger-text">
            <TrendingDown size={16} />
            <span className="text-xs font-medium">{t('KPI_TOTAL_DEDUCTIONS')}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-danger-text">
            ₹{kpis.totalDeductions.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-medium">{t('KPI_PAYOUT_PROGRESS')}</span>
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

      {/* Controls Bar: Branch Quick Pills + Month Selector */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Branch Quick Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary">{t('BRANCH_SELECTOR_LABEL')}:</span>
          {BRANCH_OPTIONS.map((b) => {
            const isActive = filters.selectedBranchId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranchId(b.id)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <Building2 size={13} />
                {b.fallback}
              </button>
            );
          })}
        </div>

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

