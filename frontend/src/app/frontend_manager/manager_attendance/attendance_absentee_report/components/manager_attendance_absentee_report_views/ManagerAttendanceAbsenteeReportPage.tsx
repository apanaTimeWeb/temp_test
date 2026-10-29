'use client';
import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import { useLocale, useTranslations } from 'next-intl';
import ManagerAttendanceAbsenteeReportNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';

import { MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/config/manager_attendance_absentee_report.url_config';
import { useManagerAbsenteeReportDemoData } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/useManagerAttendanceAbsenteeReportDemoData';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Send } from 'lucide-react';
import { createManagerAbsenteeReportAbsenteeColumns } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportColumns';



// RESPONSIBILITY: Render the attendance_absentee_report feature view while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAttendanceAbsenteeReportPage({ view, id, name, phone, smartId }: ManagerAttendanceAbsenteeReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_absentee_report.ui');
  const locale = useLocale();
  const rows = useManagerAbsenteeReportDemoData();
  const [threshold, setThreshold] = useState('3');
  const [shift, setShift]         = useState('All');
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening') };

  const filtered = rows.filter(r => {
    const thr = threshold === 'all' ? 0 : parseInt(threshold);
    return r.daysAbsent >= thr && (shift === 'All' || r.shift === shift);
  });

  const critical  = filtered.filter(r => r.daysAbsent >= 7);
  const moderate  = filtered.filter(r => r.daysAbsent >= 3 && r.daysAbsent < 7);

  const badgeClass = (d: number) => d >= 7 ? 'eng-badge--danger' : 'eng-badge--warning';
  
  const colDefs = createManagerAbsenteeReportAbsenteeColumns({
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
  }, shiftLabels, badgeClass);

  return (
    <div className="eng-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep"/>
        <span>{tManagerUi('absentee_report')}</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">{tManagerUi('absentee_report_23bf56')}</h1>
            <p className="eng-page-subtitle">{tManagerUi('students_with_consecutive_absences_requiring_attention')}</p>
            <p className="eng-input-hint eng-text-warning" data-testid="manager-engagement-absentee-contract-warning" role="status">{tManagerUi('student_contact_rows_are_sample_data_individual_and_bulk_64dbd3')}</p>
          </div>
          <div className="eng-page-actions">
            <button type="button" disabled title={tManagerUi('bulk_alerts_unavailable_verified_messaging_integration_c_f7eade')} className="eng-btn eng-btn--ghost cursor-not-allowed">
              <Send size={14}/> {tManagerUi('bulk_alerts_unavailable')}
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="eng-stats-row">
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('total_absentees')}</div>
          <div className="eng-stat-value">{filtered.length}</div>
          <div className="eng-stat-sub">{tManagerUi('above')} {threshold === 'all' ? '0' : threshold} {tManagerUi('day_threshold')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('critical_7_days')}</div>
          <div className="eng-stat-value eng-stat-value--danger">{critical.length}</div>
          <div className="eng-stat-sub">{tManagerUi('immediate_action_needed')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('moderate_3_6_days')}</div>
          <div className="eng-stat-value eng-stat-value--warning">{moderate.length}</div>
          <div className="eng-stat-sub">{tManagerUi('monitoring_required')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('parents_notified')}</div>
          <div className="eng-stat-value eng-stat-value--success">{filtered.filter(r=>r.notified).length}</div>
          <div className="eng-stat-sub">{tManagerUi('of')} {filtered.length} {tManagerUi('total')}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="eng-card eng-card--flush eng-mb-6 p-4 border-b border-border">
        <div className="eng-filter-bar flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <div className="eng-filter-field flex flex-col">
              <label htmlFor="manager-engagement-absentee-threshold" className="eng-label mb-1 text-xs font-semibold text-secondary">{tManagerUi('days_threshold')}</label>
              <select id="manager-engagement-absentee-threshold" className="eng-select eng-filter-select py-1 px-2 border rounded" value={threshold}
                onChange={e => setThreshold(e.target.value)}>
                <option value="3">{tManagerUi('label_3_days')}</option>
                <option value="5">{tManagerUi('label_5_days')}</option>
                <option value="7">{tManagerUi('label_7_days_critical')}</option>
                <option value="all">{tManagerUi('show_all')}</option>
              </select>
            </div>
            <div className="eng-filter-field flex flex-col">
              <label htmlFor="manager-engagement-absentee-shift" className="eng-label mb-1 text-xs font-semibold text-secondary">{tManagerUi('shift')}</label>
              <select id="manager-engagement-absentee-shift" className="eng-select eng-filter-select py-1 px-2 border rounded" value={shift}
                onChange={e => setShift(e.target.value)}>
                <option value="All">{tManagerUi('all')}</option>
                <option value="Morning">{tManagerUi('morning')}</option>
                <option value="Afternoon">{tManagerUi('afternoon')}</option>
                <option value="Evening">{tManagerUi('evening')}</option>
              </select>
            </div>
          </div>
          <div className="eng-filter-badges flex gap-2">
            <span className="eng-badge eng-badge--danger px-2 py-1 rounded-full text-xs">{critical.length} {tManagerUi('critical')}</span>
            <span className="eng-badge eng-badge--warning px-2 py-1 rounded-full text-xs">{moderate.length} {tManagerUi('moderate')}</span>
            <span className="eng-badge eng-badge--success px-2 py-1 rounded-full text-xs">{filtered.filter(r=>r.notified).length} {tManagerUi('notified')}</span>
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
    </div>
  );
}
