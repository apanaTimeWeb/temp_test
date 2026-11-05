'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Toaster } from 'sonner';
import { Calendar, Users2, ShieldCheck } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAdminStaffAttendance } from '@/app/frontend_admin/admin_staff/staff_attendance/hooks/useAdminStaffAttendance';
import { AdminStaffAttendanceOverviewSection } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceOverviewSection';
import { AdminStaffAttendanceLogTable } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceLogTable';
import {
  AdminStaffAttendanceRosterSection,
  AdminStaffAttendanceLeavesSection,
} from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceRosterSection';
import {
  AdminStaffAttendanceMarkModal,
  AdminStaffAttendanceInspectModal,
} from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceMarkModal';

export function AdminStaffAttendancePage() {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const model = useAdminStaffAttendance();

  const todayStr = '2026-11-04'; // Synced with system demo operational date
  const yesterdayStr = '2026-11-03';
  const [dateMode, setDateMode] = useState<'today' | 'yesterday' | 'custom'>('today');

  const handleDateModeChange = (mode: 'today' | 'yesterday' | 'custom', specificDate?: string) => {
    setDateMode(mode);
    if (mode === 'today') {
      model.setSelectedDate(todayStr);
    } else if (mode === 'yesterday') {
      model.setSelectedDate(yesterdayStr);
    } else if (specificDate) {
      model.setSelectedDate(specificDate);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Executive ERP Header & Specific Date Navigator */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Users2 className="h-3.5 w-3.5" />
                Staff Operations & Roster
              </span>
              <span className="text-xs text-text-muted">• Central Network Duty</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t('PAGE_TITLE')}
            </h1>
            <p className="text-sm text-text-secondary max-w-2xl">
              {t('PAGE_SUBTITLE')}
            </p>
          </div>

          {/* Specific Date Navigator */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-surface/90 p-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center rounded-lg bg-surface-muted/60 p-1 border border-border/50">
              <button
                type="button"
                onClick={() => handleDateModeChange('today')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  dateMode === 'today'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleDateModeChange('yesterday')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  dateMode === 'yesterday'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => handleDateModeChange('custom')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  dateMode === 'custom'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                Pick Date 📅
              </button>
            </div>

            {dateMode === 'custom' && (
              <input
                type="date"
                value={model.filters.selectedDate}
                onChange={(e) => handleDateModeChange('custom', e.target.value)}
                aria-label="Select custom date"
                className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}

            <div className="text-xs font-medium text-text-secondary border-l border-border/60 pl-2.5 ml-0.5">
              {model.filters.selectedDate}
              <span className="ml-1.5 text-text-muted">· {model.records.length} logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs & Controls */}
      <AdminStaffAttendanceOverviewSection model={model} />

      {/* Main Content: Logs vs Roster vs Leaves */}
      {model.filters.tab === 'logs' ? (
        <AdminStaffAttendanceLogTable
          records={model.records}
          onInspect={model.setInspectingRecord}
          onRegularize={model.setRegularizingRecord}
        />
      ) : model.filters.tab === 'roster' ? (
        <AdminStaffAttendanceRosterSection slots={model.rosterSlots} />
      ) : (
        <AdminStaffAttendanceLeavesSection
          leaveRequests={model.leaveRequests}
          onAction={model.handleLeaveAction}
        />
      )}

      {/* Modals */}
      <AdminStaffAttendanceMarkModal
        record={model.regularizingRecord}
        isOpen={model.regularizingRecord !== null}
        onClose={() => model.setRegularizingRecord(null)}
        onSubmit={model.handleRegularizeSubmit}
      />

      <AdminStaffAttendanceInspectModal
        record={model.inspectingRecord}
        isOpen={model.inspectingRecord !== null}
        onClose={() => model.setInspectingRecord(null)}
      />
    </div>
  );
}

export default AdminStaffAttendancePage;

