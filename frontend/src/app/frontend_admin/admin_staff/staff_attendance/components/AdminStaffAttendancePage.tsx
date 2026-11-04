'use client';

import { useTranslations } from 'next-intl';
import { Toaster } from 'sonner';
import { useAdminStaffAttendance } from '@/app/frontend_admin/admin_staff/staff_attendance/hooks/useAdminStaffAttendance';
import { AdminStaffAttendanceOverviewSection } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceOverviewSection';
import { AdminStaffAttendanceLogTable } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceLogTable';
import { AdminStaffAttendanceRosterSection } from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceRosterSection';
import {
  AdminStaffAttendanceMarkModal,
  AdminStaffAttendanceInspectModal,
} from '@/app/frontend_admin/admin_staff/staff_attendance/components/AdminStaffAttendanceMarkModal';

export function AdminStaffAttendancePage() {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const model = useAdminStaffAttendance();

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {t('PAGE_TITLE')}
        </h1>
        <p className="text-sm text-text-secondary">
          {t('PAGE_SUBTITLE')}
        </p>
      </div>

      {/* KPIs & Controls */}
      <AdminStaffAttendanceOverviewSection model={model} />

      {/* Main Content: Logs vs Roster */}
      {model.filters.tab === 'logs' ? (
        <AdminStaffAttendanceLogTable
          records={model.records}
          onInspect={model.setInspectingRecord}
          onRegularize={model.setRegularizingRecord}
        />
      ) : (
        <AdminStaffAttendanceRosterSection slots={model.rosterSlots} />
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

