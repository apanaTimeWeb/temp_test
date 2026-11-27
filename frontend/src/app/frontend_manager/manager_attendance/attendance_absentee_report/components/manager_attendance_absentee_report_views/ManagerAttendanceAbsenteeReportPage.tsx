'use client';

import { createManagerAbsenteeReportAbsenteeColumns } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportColumns';
import ManagerAttendanceAbsenteeReportNativeTable from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';
import { ManagerAttendanceAbsenteeBulkWhatsAppModal } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeBulkWhatsAppModal';
import { ManagerAttendanceAbsenteeHeader } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeHeader';
import { ManagerAttendanceAbsenteeDetailsModal } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeDetailsModal';
import { ManagerAttendanceAbsenteeKpis } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeKpis';
import ManagerAttendanceAbsenteeTimeHorizonBar, { type ManagerAbsenteeTimeHorizon } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeTimeHorizonBar';
import { ManagerAttendanceAbsenteeToolbar } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeToolbar';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';
import { useManagerAbsenteeReportDemoData } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/useManagerAttendanceAbsenteeReportDemoData';
import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import { exportManagerAbsenteeReportCsv } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/utils/ManagerAttendanceAbsenteeReportCsv';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ManagerAttendanceAbsenteeReportPage({
  view,
  id,
}: ManagerAttendanceAbsenteeReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_absentee_report.ui');
  const locale = useLocale();
  const initialRows = useManagerAbsenteeReportDemoData();

  const initialRowsWithDates: ManagerAttendanceAbsenteeReportSampleAbsentee[] = useMemo(() => {
    const today = new Date();
    return initialRows.map((r, idx) => {
      const d = new Date(today);
      d.setDate(d.getDate() - ([1, 3, 5, 8][idx] ?? 14));
      return { ...r, lastSeen: d.toISOString().slice(0, 10) };
    });
  }, [initialRows]);

  const [rowsList, setRowsList] = useState(initialRowsWithDates);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);
  const [selectedAbsentee, setSelectedAbsentee] = useState<ManagerAttendanceAbsenteeReportSampleAbsentee | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<ManagerAbsenteeTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [threshold, setThreshold] = useState('3');
  const [shift, setShift] = useState('All');
  const [alertStatusFilter, setAlertStatusFilter] = useState<'all' | 'pending' | 'notified'>('all');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<'all' | 'unexcused_risk' | 'on_leave'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const shiftLabels: Record<string, string> = { Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening'), Night: tManagerUi('night'), 'Full Day': tManagerUi('full_day') };

  const handleAlertWhatsApp = (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => {
    let cleanPhone = (item.parentPhone || '9876543210').replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Dear Parent / Student, this is an official attendance notice from Central Library. ${item.name} (${item.smartId}, ${item.shift} Shift) has been absent for ${item.daysAbsent} consecutive days. Last attended date: ${item.lastSeen}. Kindly ensure regular study attendance. — Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    setRowsList((prev) => prev.map((r) => (r.smartId === item.smartId ? { ...r, notified: true } : r)));
    if (selectedAbsentee && selectedAbsentee.smartId === item.smartId) {
      setSelectedAbsentee({ ...selectedAbsentee, notified: true });
    }
    toast.success(`WhatsApp notice dispatched for ${item.name}`, {
      id: `absentee-whatsapp-${item.smartId}`,
    });
  };

  const handleMarkExcused = (studentSmartId: string, reason: string, duration?: string) => {
    setRowsList((prev) =>
      prev.map((r) =>
        r.smartId === studentSmartId ? { ...r, excused: true, leaveReason: reason, leaveDuration: duration || '10 Days' } : r
      )
    );
    if (selectedAbsentee && selectedAbsentee.smartId === studentSmartId) {
      setSelectedAbsentee({ ...selectedAbsentee, excused: true, leaveReason: reason, leaveDuration: duration || '10 Days' });
    }
    toast.success(`Absence for ${studentSmartId} marked as Excused / On Leave (${reason})`, {
      id: `absentee-excused-${studentSmartId}`,
    });
  };

  const handleRevokeExcused = (studentSmartId: string) => {
    setRowsList((prev) =>
      prev.map((r) => (r.smartId === studentSmartId ? { ...r, excused: false, leaveReason: undefined } : r))
    );
    if (selectedAbsentee && selectedAbsentee.smartId === studentSmartId) {
      setSelectedAbsentee({ ...selectedAbsentee, excused: false, leaveReason: undefined });
    }
    toast.info(`Excused status revoked for ${studentSmartId}`, {
      id: `absentee-revoke-${studentSmartId}`,
    });
  };

  const timeFilteredRows = useMemo(() => {
    if (timeHorizon === 'all') return rowsList;
    const now = new Date();
    return rowsList.filter((r) => {
      const recDate = new Date(r.lastSeen);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [rowsList, timeHorizon, customStartDate, customEndDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const thr = threshold === 'all' ? 0 : parseInt(threshold, 10);
    return timeFilteredRows.filter((r) => {
      const matchThr = r.daysAbsent >= thr;
      const matchShift = shift === 'All' || r.shift === shift;
      const matchAlertStatus =
        alertStatusFilter === 'all' || (alertStatusFilter === 'notified' ? r.notified : !r.notified);
      const matchLeaveStatus =
        leaveStatusFilter === 'all' || (leaveStatusFilter === 'unexcused_risk' ? !r.excused : Boolean(r.excused));
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.smartId.toLowerCase().includes(q) ||
        (r.parentPhone && r.parentPhone.includes(q)) ||
        (r.parentEmail && r.parentEmail.toLowerCase().includes(q));
      return matchThr && matchShift && matchAlertStatus && matchLeaveStatus && matchQ;
    });
  }, [timeFilteredRows, threshold, shift, alertStatusFilter, leaveStatusFilter, searchQuery]);

  const critical = filtered.filter((r) => r.daysAbsent >= 7 && !r.excused);
  const moderate = filtered.filter((r) => r.daysAbsent >= 3 && r.daysAbsent < 7 && !r.excused);
  const onLeaveStudents = filtered.filter((r) => Boolean(r.excused));
  const notifiedCount = filtered.filter((r) => r.notified).length;

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
      shift !== 'All' ||
      threshold !== '3' ||
      timeHorizon !== 'all' ||
      alertStatusFilter !== 'all' ||
      leaveStatusFilter !== 'all' ||
      customStartDate !== '' ||
      customEndDate !== ''
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setShift('All');
    setThreshold('3');
    setTimeHorizon('all');
    setAlertStatusFilter('all');
    setLeaveStatusFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    toast.info('Absentee filters reset to default.', { id: 'absentee-filters-reset' });
  };

  const handleExportCsv = () => {
    exportManagerAbsenteeReportCsv(filtered);
    toast.success('Absentee report exported to CSV successfully', { id: 'absentee-report-export-csv' });
  };

  const badgeClass = (d: number) => (d >= 7 ? 'eng-badge--danger' : 'eng-badge--warning');

  const colDefs = useMemo(
    () =>
      createManagerAbsenteeReportAbsenteeColumns(
        {
          student: tManagerUi('student'),
          smartId: tManagerUi('smart_id'),
          shift: tManagerUi('shift'),
          daysAbsent: tManagerUi('days_absent'),
          days: tManagerUi('days'),
          lastSeen: tManagerUi('last_seen'),
          parentContact: tManagerUi('parent_contact'),
          actions: tManagerUi('actions'),
          samplePreviouslyNotified: tManagerUi('sample_previously_notified'),
          parentAlertsUnavailable: tManagerUi('parent_alerts_unavailable_verified_messaging_integration_9cbc80'),
          alertUnavailable: tManagerUi('alert_unavailable'),
          locale,
        },
        shiftLabels,
        badgeClass,
        handleAlertWhatsApp,
        (item) => setSelectedAbsentee(item)
      ),
    [tManagerUi, locale, shiftLabels]
  );

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <ManagerAttendanceAbsenteeHeader
        title={tManagerUi('absentee_report_23bf56')}
        subtitle={tManagerUi('students_with_consecutive_absences_requiring_attention')}
        filteredCount={filtered.length}
        onPrint={() => window.print()}
        onExportCsv={handleExportCsv}
        onOpenBulkWhatsApp={() => setIsBulkWhatsAppOpen(true)}
      />

      <ManagerAttendanceAbsenteeTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      <ManagerAttendanceAbsenteeKpis
        totalFiltered={filtered.length}
        threshold={threshold}
        criticalCount={critical.length}
        moderateCount={moderate.length}
        onLeaveCount={onLeaveStudents.length}
        notifiedCount={notifiedCount}
      />

      <ManagerAttendanceAbsenteeToolbar
        shift={shift}
        onShiftChange={setShift}
        alertStatusFilter={alertStatusFilter}
        onAlertStatusChange={setAlertStatusFilter}
        leaveStatusFilter={leaveStatusFilter}
        onLeaveStatusChange={setLeaveStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        threshold={threshold}
        onThresholdChange={setThreshold}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        criticalCount={critical.length}
        moderateCount={moderate.length}
      />

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-base font-semibold text-primary mb-1">{tManagerUi('no_absentees_above_threshold')}</p>
            <p className="text-xs text-secondary max-w-md">{tManagerUi('all_students_have_great_attendance_above_the_selected_th_12de3c')}</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-3.5 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-primary hover:bg-surface-hover cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <ManagerAttendanceAbsenteeReportNativeTable
              getRowKey={(row) => row.id}
              rows={filtered}
              columns={colDefs}
              labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
            />
          </div>
        )}
      </div>

      <ManagerAttendanceAbsenteeDetailsModal
        isOpen={Boolean(selectedAbsentee)}
        absentee={selectedAbsentee}
        onClose={() => setSelectedAbsentee(null)}
        onSendWhatsApp={handleAlertWhatsApp}
        onMarkExcused={handleMarkExcused}
        onRevokeExcused={handleRevokeExcused}
      />

      <ManagerAttendanceAbsenteeBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        absentees={filtered}
        onComplete={() => {
          setIsBulkWhatsAppOpen(false);
          setRowsList((prev) =>
            prev.map((r) => (filtered.some((f) => f.smartId === r.smartId) ? { ...r, notified: true } : r))
          );
          toast.success('Bulk WhatsApp alerts queued successfully!', { id: 'absentee-bulk-whatsapp-queued' });
        }}
      />
    </div>
  );
}
