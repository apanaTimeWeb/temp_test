'use client';

import { PAYROLL_MONTHS } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';
import type { AdminStaffPayrollModel } from '@/app/frontend_admin/admin_staff/staff_payroll/types/AdminStaffPayrollTypes';
import {
Calendar,
CheckCircle2,
Clock,
Search,
TrendingDown,
Users,
Wallet
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  model: AdminStaffPayrollModel;
}

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

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
        {/* Total Payroll - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-16 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d={generateSparkline('total_payroll')} fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('KPI_TOTAL_PAYROLL')}</span>
            <div className="p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <Wallet size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight text-white tabular-nums">
            ₹{kpis.totalPayrollAmount.toLocaleString('en-IN')}
          </p>
          <span className="relative z-10 mt-2 block border-t border-white/10 pt-1.5 text-[11px] font-medium text-slate-400">Total Gross Budget</span>
        </div>

        {/* Disbursed Amount - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-16 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d={generateSparkline('disbursed')} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('KPI_DISBURSED_AMOUNT')}</span>
            <div className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight text-emerald-400 tabular-nums">
            ₹{kpis.disbursedAmount.toLocaleString('en-IN')}
          </p>
          <span className="relative z-10 mt-2 block border-t border-white/10 pt-1.5 text-[11px] font-medium text-slate-400">Processed & Paid</span>
        </div>

        {/* Pending Amount - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-16 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d={generateSparkline('pending')} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('KPI_PENDING_AMOUNT')}</span>
            <div className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <Clock size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight text-amber-400 tabular-nums">
            ₹{kpis.pendingAmount.toLocaleString('en-IN')}
          </p>
          <span className="relative z-10 mt-2 block border-t border-white/10 pt-1.5 text-[11px] font-medium text-slate-400">Awaiting Authorization</span>
        </div>

        {/* Total Staff - Sky */}
        <div className="group relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 shadow-sky-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-16 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d={generateSparkline('staff')} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('KPI_TOTAL_STAFF')}</span>
            <div className="p-2 rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <Users size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight text-white tabular-nums">{kpis.totalStaffCount}</p>
          <span className="relative z-10 mt-2 block border-t border-white/10 pt-1.5 text-[11px] font-medium text-slate-400">Payroll Employees</span>
        </div>

        {/* Total Deductions - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-16 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d={generateSparkline('deductions')} fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('KPI_TOTAL_DEDUCTIONS')}</span>
            <div className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
              <TrendingDown size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight text-rose-400 tabular-nums">
            ₹{kpis.totalDeductions.toLocaleString('en-IN')}
          </p>
          <span className="relative z-10 mt-2 block border-t border-white/10 pt-1.5 text-[11px] font-medium text-slate-400">Unpaid & Advance</span>
        </div>

        {/* Payout Progress - Cyan/Violet */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-4 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold uppercase tracking-wider">{t('KPI_PAYOUT_PROGRESS')}</span>
            <span className="font-bold text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('KPI_PAYOUT_PROGRESS')}
            />
          </div>
          <span className="mt-2 block text-[11px] text-slate-400">Completion rate</span>
        </div>
      </div>

      {/* Control Bar: Months, Quick Filters, and Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        {/* Month Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5 mr-1">
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
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/50 text-text-secondary hover:bg-muted'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input maxLength={100}
            type="text"
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminStaffPayrollKpiOverview;
