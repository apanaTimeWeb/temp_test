'use client';

import type { AdminStaffAttendanceModel } from '@/app/frontend_admin/admin_staff/staff_attendance/types/AdminStaffAttendanceTypes';
import {
  downloadMonthlyAttendanceRegisterCsv,
  downloadMonthlyAttendanceRegisterExcel,
  downloadStaffAttendanceCsv,
  downloadStaffAttendanceExcel,
  printStaffAttendanceRoster,
} from '@/app/frontend_admin/admin_staff/staff_attendance/utils/adminStaffAttendanceExports';
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Printer,
  Search,
  Users,
  UserX,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  model: AdminStaffAttendanceModel;
}

export function AdminStaffAttendanceOverviewSection({ model }: Props) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const { filters, setTab, setStatusFilter, setSelectedShift, setSearchQuery, kpis } = model;

  const kpiCards = [
    { label: t('KPI_TOTAL_STAFF'), value: kpis.totalStaff, sub: 'Total Roster Base', border: 'border-info', iconBg: 'border-info bg-info-bg text-info-text', valueClass: 'text-text-primary', Icon: Users },
    { label: t('KPI_PRESENT'), value: kpis.presentCount, sub: 'Punched & On Floor', border: 'border-success', iconBg: 'border-success bg-success-bg text-success-text', valueClass: 'text-success-text', Icon: CheckCircle2 },
    { label: t('KPI_LATE'), value: kpis.lateCount, sub: '> 15 min punch-in', border: 'border-warning', iconBg: 'border-warning bg-warning-bg text-warning-text', valueClass: 'text-warning-text', Icon: Clock },
    { label: t('KPI_ABSENT'), value: kpis.absentCount, sub: 'Unreported absence', border: 'border-danger', iconBg: 'border-danger bg-danger-bg text-danger-text', valueClass: 'text-danger-text', Icon: UserX },
    { label: t('KPI_ON_LEAVE'), value: kpis.onLeaveCount, sub: 'Approved leaves', border: 'border-primary', iconBg: 'border-primary bg-info-bg text-primary-text', valueClass: 'text-text-primary', Icon: CalendarCheck },
    { label: t('KPI_ATTENDANCE_RATE'), value: `${kpis.attendanceRatePercent}%`, sub: 'Present vs Expected', border: 'border-purple-text', iconBg: 'border-purple-text bg-purple-bg text-purple-text', valueClass: 'text-purple-text', Icon: Building2 },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map(({ label, value, sub, border, iconBg, valueClass, Icon }) => (
          <div key={label} className={`group relative overflow-hidden rounded-2xl border ${border} bg-card p-4 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl`}>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
              <div className={`p-2 rounded-xl border ${iconBg}`}>
                <Icon size={15} strokeWidth={2.2} />
              </div>
            </div>
            <p className={`relative z-10 mt-2 text-xl sm:text-2xl font-black tracking-tight tabular-nums ${valueClass}`}>{value}</p>
            <span className="relative z-10 mt-2 block border-t border-border pt-1.5 text-[11px] font-medium text-text-secondary">{sub}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => downloadStaffAttendanceCsv(model.records, model.filters.selectedDate)}
            disabled={model.records.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-info bg-info-bg px-3 py-1.5 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Attendance to CSV"
          >
            <Download size={14} strokeWidth={2} />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={() => downloadStaffAttendanceExcel(model.records, model.filters.selectedDate)}
            disabled={model.records.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Attendance to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={() => printStaffAttendanceRoster(model.records, model.filters.selectedDate, kpis.attendanceRatePercent)}
            disabled={model.records.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary bg-info-bg px-3 py-1.5 text-xs font-semibold text-primary-text hover:opacity-90 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Print Attendance Roster"
          >
            <Printer size={14} strokeWidth={2} />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => downloadMonthlyAttendanceRegisterCsv(model.records, model.filters.selectedDate)}
            disabled={model.records.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-info bg-info-bg px-3 py-1.5 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Full Month Attendance Register (CSV)"
          >
            <Download size={14} strokeWidth={2} />
            <span>Monthly Register (CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => downloadMonthlyAttendanceRegisterExcel(model.records, model.filters.selectedDate)}
            disabled={model.records.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-purple-text bg-purple-bg px-3 py-1.5 text-xs font-semibold text-purple-text hover:opacity-90 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Full Month Attendance Register (Excel .xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} />
            <span>Monthly Register (Excel)</span>
          </button>
        </div>

        <div className="flex rounded-lg border border-border bg-surface p-1">
          {(['logs', 'roster', 'leaves'] as const).map((tabId) => {
            const labelKey = tabId === 'logs' ? 'TAB_LOGS' : tabId === 'roster' ? 'TAB_ROSTER' : 'TAB_LEAVES';
            return (
              <button
                key={tabId}
                type="button"
                onClick={() => setTab(tabId)}
                className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold motion-safe:transition-all ${
                  filters.tab === tabId ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-text" />
          <input
            maxLength={100}
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
