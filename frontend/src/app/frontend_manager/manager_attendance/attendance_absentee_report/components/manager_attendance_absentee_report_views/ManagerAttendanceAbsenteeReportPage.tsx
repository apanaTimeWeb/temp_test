'use client';
import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import { useLocale, useTranslations } from 'next-intl';
import ManagerAttendanceAbsenteeReportNativeTable from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';
import { MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/config/manager_attendance_absentee_report.url_config';
import { useManagerAbsenteeReportDemoData } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/useManagerAttendanceAbsenteeReportDemoData';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Send, Search, MessageSquare } from 'lucide-react';
import { createManagerAbsenteeReportAbsenteeColumns } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportColumns';
import ManagerAttendanceAbsenteeTimeHorizonBar, { type ManagerAbsenteeTimeHorizon } from './ManagerAttendanceAbsenteeTimeHorizonBar';
import { ManagerAttendanceAbsenteeBulkWhatsAppModal } from './ManagerAttendanceAbsenteeBulkWhatsAppModal';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '../../hooks/ManagerAttendanceAbsenteeReportDemoRepository';

export default function ManagerAttendanceAbsenteeReportPage({ view, id, name, phone, smartId }: ManagerAttendanceAbsenteeReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_absentee_report.ui');
  const locale = useLocale();
  const initialRows = useManagerAbsenteeReportDemoData();
  const [rowsList, setRowsList] = useState(initialRows);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState<ManagerAbsenteeTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [threshold, setThreshold] = useState('3');
  const [shift, setShift] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: tManagerUi('afternoon'),
    Evening: tManagerUi('evening'),
    Night: tManagerUi('night'),
    'Full Day': tManagerUi('full_day'),
  };

  const handleAlertWhatsApp = (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => {
    let cleanPhone = (item.parentPhone || '9876543210').replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Dear Parent / Student, this is an official attendance notice from Central Library. ${item.name} (${item.smartId}, ${item.shift} Shift) has been absent for ${item.daysAbsent} consecutive days. Last attended date: ${item.lastSeen}. Kindly ensure regular study attendance. — Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    setRowsList((prev) => prev.map((r) => r.smartId === item.smartId ? { ...r, notified: true } : r));
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

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Absentees';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const thr = threshold === 'all' ? 0 : parseInt(threshold);
    return timeFilteredRows.filter((r) => {
      const matchThr = r.daysAbsent >= thr;
      const matchShift = shift === 'All' || r.shift === shift;
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.smartId.toLowerCase().includes(q) ||
        (r.parentPhone && r.parentPhone.includes(q)) ||
        (r.parentEmail && r.parentEmail.toLowerCase().includes(q));
      return matchThr && matchShift && matchQ;
    });
  }, [timeFilteredRows, threshold, shift, searchQuery]);

  const critical = filtered.filter((r) => r.daysAbsent >= 7);
  const moderate = filtered.filter((r) => r.daysAbsent >= 3 && r.daysAbsent < 7);

  const badgeClass = (d: number) => (d >= 7 ? 'eng-badge--danger' : 'eng-badge--warning');

  const colDefs = createManagerAbsenteeReportAbsenteeColumns(
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
    handleAlertWhatsApp
  );

  return (
    <div className="eng-page" data-route-view={view} data-route-id={id}>
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>{tManagerUi('absentee_report')}</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">{tManagerUi('absentee_report_23bf56')}</h1>
            <p className="eng-page-subtitle">{tManagerUi('students_with_consecutive_absences_requiring_attention')}</p>
            <p className="eng-input-hint eng-text-warning" data-testid="manager-engagement-absentee-contract-warning" role="status">
              {tManagerUi('student_contact_rows_are_sample_data_individual_and_bulk_64dbd3')}
            </p>
          </div>
          <div className="eng-page-actions">
            <button
              type="button"
              onClick={() => setIsBulkWhatsAppOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              title="Launch bulk WhatsApp alerts queue for absentees"
            >
              <MessageSquare size={14} />
              <span>Bulk WhatsApp Alerts ({filtered.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Time Horizon Filter Bar */}
      <ManagerAttendanceAbsenteeTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      {/* ── KPI Stats ── */}
      <div className="eng-stats-row">
        <div className="eng-stat-card">
          <div className="flex items-center justify-between">
            <span className="eng-stat-label">{tManagerUi('total_absentees')}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <div className="eng-stat-value">{filtered.length}</div>
          <div className="eng-stat-sub">{tManagerUi('above')} {threshold === 'all' ? '0' : threshold} {tManagerUi('day_threshold')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="flex items-center justify-between">
            <span className="eng-stat-label">{tManagerUi('critical_7_days')}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <div className="eng-stat-value eng-stat-value--danger">{critical.length}</div>
          <div className="eng-stat-sub">{tManagerUi('immediate_action_needed')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="flex items-center justify-between">
            <span className="eng-stat-label">{tManagerUi('moderate_3_6_days')}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <div className="eng-stat-value eng-stat-value--warning">{moderate.length}</div>
          <div className="eng-stat-sub">{tManagerUi('monitoring_required')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="flex items-center justify-between">
            <span className="eng-stat-label">{tManagerUi('parents_notified')}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-success border border-border">
              [{timeHorizonLabel}]
            </span>
          </div>
          <div className="eng-stat-value eng-stat-value--success">{filtered.filter((r) => r.notified).length}</div>
          <div className="eng-stat-sub">{tManagerUi('of')} {filtered.length} {tManagerUi('total')}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="eng-card eng-card--flush eng-mb-6 p-4 border-b border-border">
        <div className="eng-filter-bar flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search student, smart ID, or phone..."
                className="eng-input pl-8 text-xs w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="eng-filter-field flex flex-col">
              <label htmlFor="manager-engagement-absentee-threshold" className="eng-label mb-1 text-xs font-semibold text-secondary">{tManagerUi('days_threshold')}</label>
              <select id="manager-engagement-absentee-threshold" className="eng-select eng-filter-select py-1 px-2 border rounded" value={threshold} onChange={(e) => setThreshold(e.target.value)}>
                <option value="3">{tManagerUi('label_3_days')}</option>
                <option value="5">{tManagerUi('label_5_days')}</option>
                <option value="7">{tManagerUi('label_7_days_critical')}</option>
                <option value="all">{tManagerUi('show_all')}</option>
              </select>
            </div>
            <div className="eng-filter-field flex flex-col">
              <label htmlFor="manager-engagement-absentee-shift" className="eng-label mb-1 text-xs font-semibold text-secondary">{tManagerUi('shift')}</label>
              <select id="manager-engagement-absentee-shift" className="eng-select eng-filter-select py-1 px-2 border rounded" value={shift} onChange={(e) => setShift(e.target.value)}>
                <option value="All">{tManagerUi('all')}</option>
                <option value="Morning">{tManagerUi('morning')}</option>
                <option value="Afternoon">{tManagerUi('afternoon')}</option>
                <option value="Evening">{tManagerUi('evening')}</option>
                <option value="Night">{tManagerUi('night')}</option>
                <option value="Full Day">{tManagerUi('full_day')}</option>
              </select>
            </div>
          </div>
          <div className="eng-filter-badges flex gap-2">
            <span className="eng-badge eng-badge--danger px-2 py-1 rounded-full text-xs">{critical.length} {tManagerUi('critical')}</span>
            <span className="eng-badge eng-badge--warning px-2 py-1 rounded-full text-xs">{moderate.length} {tManagerUi('moderate')}</span>
            <span className="eng-badge eng-badge--success px-2 py-1 rounded-full text-xs">{filtered.filter((r) => r.notified).length} {tManagerUi('notified')}</span>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="eng-card eng-card--flush p-4">
        {filtered.length === 0 ? (
          <div className="eng-empty py-12 flex flex-col items-center justify-center text-center">
            <div className="eng-empty-icon text-4xl mb-4">🎉</div>
            <p className="eng-empty-title text-lg font-semibold text-primary mb-1">{tManagerUi('no_absentees_above_threshold')}</p>
            <p className="eng-empty-sub text-sm text-secondary">{tManagerUi('all_students_have_great_attendance_above_the_selected_th_12de3c')}</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-112">
            <ManagerAttendanceAbsenteeReportNativeTable getRowKey={(row) => row.id} rows={filtered} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
          </div>
        )}
      </div>

      <ManagerAttendanceAbsenteeBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        absentees={filtered}
        onComplete={() => {
          setIsBulkWhatsAppOpen(false);
          setRowsList((prev) => prev.map((r) => filtered.some((f) => f.smartId === r.smartId) ? { ...r, notified: true } : r));
        }}
      />
    </div>
  );
}
