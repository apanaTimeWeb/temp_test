'use client';

import { useTranslations } from 'next-intl';
import {
  Users,
  CheckCircle2,
  Clock,
  UserX,
  CalendarCheck,
  Building2,
  Search,
  Filter,
} from 'lucide-react';
import type { AdminStaffAttendanceModel } from '@/app/frontend_admin/admin_staff/staff_attendance/types/AdminStaffAttendanceTypes';

interface Props {
  model: AdminStaffAttendanceModel;
}

const BRANCH_OPTIONS = [
  { id: 'all', labelKey: 'ALL_BRANCHES', fallback: 'All Branches' },
  { id: 'BR-001', labelKey: 'BR_001', fallback: 'Downtown Central' },
  { id: 'BR-002', labelKey: 'BR_002', fallback: 'Westside Branch' },
  { id: 'BR-003', labelKey: 'BR_003', fallback: 'North Hub' },
];

export function AdminStaffAttendanceOverviewSection({ model }: Props) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const { filters, setTab, setSelectedBranchId, setStatusFilter, setSelectedShift, setSearchQuery, kpis } = model;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_TOTAL_STAFF')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-bg text-info-text">
              <Users size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{kpis.totalStaff}</p>
          <span className="text-xs text-text-muted">Total Roster Base</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_PRESENT')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-bg text-success-text">
              <CheckCircle2 size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{kpis.presentCount}</p>
          <span className="text-xs text-text-muted">Punched & On Floor</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_LATE')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-bg text-warning-text">
              <Clock size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{kpis.lateCount}</p>
          <span className="text-xs text-text-muted">{">"} 15 min punch-in</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_ABSENT')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger-bg text-danger-text">
              <UserX size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{kpis.absentCount}</p>
          <span className="text-xs text-text-muted">Unreported absence</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_ON_LEAVE')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-bg text-info-text">
              <CalendarCheck size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{kpis.onLeaveCount}</p>
          <span className="text-xs text-text-muted">Approved leaves</span>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('KPI_ATTENDANCE_RATE')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <Building2 size={15} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-primary">{kpis.attendanceRatePercent}%</p>
          <span className="text-xs text-text-muted">Present vs Expected</span>
        </div>
      </div>

      {/* Controls Bar: Branch Switcher Pills + Tab Switcher */}
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

        {/* View Tabs */}
        <div className="flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filters.tab === 'logs' ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TAB_LOGS')}
          </button>
          <button
            type="button"
            onClick={() => setTab('roster')}
            className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filters.tab === 'roster' ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TAB_ROSTER')}
          </button>
          <button
            type="button"
            onClick={() => setTab('leaves')}
            className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filters.tab === 'leaves' ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TAB_LEAVES')}
          </button>
        </div>
      </div>

      {/* Filter Row: Search + Status + Shift */}
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

        {filters.tab === 'logs' && (
          <div className="flex items-center gap-2">
            <select
              value={filters.statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-11 rounded-lg border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="all">{t('ALL_STATUSES')}</option>
              <option value="PRESENT">{t('STATUS_PRESENT')}</option>
              <option value="LATE">{t('STATUS_LATE')}</option>
              <option value="ABSENT">{t('STATUS_ABSENT')}</option>
              <option value="ON_LEAVE">{t('STATUS_ON_LEAVE')}</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <select
            value={filters.selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="min-h-11 rounded-lg border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">{t('ALL_SHIFTS')}</option>
            <option value="MORNING">{t('SHIFT_MORNING')}</option>
            <option value="EVENING">{t('SHIFT_EVENING')}</option>
            <option value="NIGHT">{t('SHIFT_NIGHT')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdminStaffAttendanceOverviewSection;

