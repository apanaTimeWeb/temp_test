'use client';
import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import { useTranslations } from 'next-intl';

import { MANAGER_ATTENDANCE_DAILY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.url_config';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import { ManagerAttendanceDailyStudentRow } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyStudentRow.tsx';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, FileBarChart2 } from 'lucide-react';
import { ManagerAttendanceDailyEmptyState } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_empty_states/ManagerAttendanceDailyEmptyState';
import type { AttStatus, Student, ManagerAttendanceDailyTimeField } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';




const INIT_STUDENTS: Student[] = MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE.map((student) => ({ ...student }));

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// RESPONSIBILITY: Render the attendance_daily feature view while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAttendanceDailyPage({ view, id, name, phone, smartId }: ManagerAttendanceDailyMainProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');
  const date = toLocalDateInputValue(new Date());
  const [shift, setShift]       = useState('All');
  const [students, setStudents] = useState<Student[]>(INIT_STUDENTS);
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: tManagerUi('afternoon'),
    Evening: tManagerUi('evening'),
  };
  const shiftLabel = (value: string) => value === 'All' ? tManagerUi('all') : (shiftLabels[value] ?? value);

  const filtered = shift === 'All' ? students : students.filter(s => s.shift === shift);
  const marked   = filtered.filter(s => s.status !== null).length;
  const present  = filtered.filter(s => s.status === 'present').length;
  const absent   = filtered.filter(s => s.status === 'absent').length;
  const late     = filtered.filter(s => s.status === 'late').length;

  const setStatus = (id: string, status: AttStatus) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, status } : s));

  const setField = (id: string, field: ManagerAttendanceDailyTimeField, val: string) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, [field]: val } : s));


  return (
    <div className="eng-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_DAILY_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>{tManagerUi('attendance')}</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <p className="eng-input-hint eng-text-warning" role="status" data-testid="manager-engagement-attendance-contract-warning">{tManagerUi('sample_attendance_only_status_edits_are_an_in_page_previ_f63093')}</p>
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">{tManagerUi('daily_attendance')}</h1>
            <p className="eng-page-subtitle">{tManagerUi('mark_attendance_for_all_enrolled_students_by_shift')}</p>
          </div>
          <div className="eng-page-actions">
            <Link href={MANAGER_ATTENDANCE_DAILY_ROUTES.absenteeReport} className="eng-btn eng-btn--ghost eng-btn--sm">
              <FileBarChart2 size={14} /> {tManagerUi('absentee_report')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="eng-stats-row">
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('total_students')}</div>
          <div className="eng-stat-value">{filtered.length}</div>
          <div className="eng-stat-sub">{shiftLabel(shift)} {tManagerUi('shift_dbd79b')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('present')}</div>
          <div className="eng-stat-value eng-stat-value--success">{present}</div>
          <div className="eng-stat-sub">{filtered.length ? Math.round(present/filtered.length*100) : 0}{tManagerUi('rate')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('absent')}</div>
          <div className="eng-stat-value eng-stat-value--danger">{absent}</div>
          <div className="eng-stat-sub">{filtered.filter(s=>s.consecutiveAbsent>=3).length} {tManagerUi('need_alerts')}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">{tManagerUi('late')}</div>
          <div className="eng-stat-value eng-stat-value--warning">{late}</div>
          <div className="eng-stat-sub">{marked}/{filtered.length} {tManagerUi('marked')}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="eng-card eng-card--flush eng-mb-6">
        <div className="eng-filter-row">
          <div className="eng-filter-field">
            <label className="eng-label" htmlFor="rbg4-managerengagementattendancepage-103">{tManagerUi('date')}</label>
            <input id="rbg4-managerengagementattendancepage-103" type="date" className="eng-input" value={date} readOnly disabled aria-label={tManagerUi('sample_date_date_filtering_unavailable')} title={tManagerUi('date_filtering_is_unavailable_until_an_authoritative_dat_50c52e')} />
            <span className="eng-input-hint">{tManagerUi('date_filter_unavailable')}</span>
          </div>
          <div className="eng-filter-field">
            <label className="eng-label" htmlFor="rbg4-managerengagementattendancepage-108">{tManagerUi('shift')}</label>
            <select id="rbg4-managerengagementattendancepage-108" className="eng-select eng-filter-select" value={shift}
              onChange={e => setShift(e.target.value)}>
              <option value="All">{tManagerUi('all')}</option>
              <option value="Morning">{tManagerUi('morning')}</option>
              <option value="Afternoon">{tManagerUi('afternoon')}</option>
              <option value="Evening">{tManagerUi('evening')}</option>
            </select>
          </div>
          <div className="eng-filter-badges">
            <span className="eng-badge eng-badge--success">{present} {tManagerUi('present')}</span>
            <span className="eng-badge eng-badge--danger">{absent} {tManagerUi('absent')}</span>
            <span className="eng-badge eng-badge--warning">{late} {tManagerUi('late')}</span>
          </div>
        </div>
      </div>

      {/* ── Student List ── */}
      <div className="eng-card eng-card--flush">
        <div className="eng-att-list">
          {filtered.length === 0 ? (
            <ManagerAttendanceDailyEmptyState className="eng-empty">
              <div className="eng-empty-icon">📅</div>
              <p className="eng-empty-title">{tManagerUi('no_students_in_this_shift')}</p>
              <p className="eng-empty-sub">{tManagerUi('try_selecting_a_different_shift_or_date')}</p>
            </ManagerAttendanceDailyEmptyState>
          ) : filtered.map((student) => (
            <ManagerAttendanceDailyStudentRow
              key={student.id}
              student={student}
              onStatusChange={setStatus}
              onFieldChange={setField}
            />
          ))}
        </div>
      </div>

      {/* ── Sticky Save Bar ── */}
      <div className="eng-save-bar">
        <p className="eng-save-bar-info">
          <strong>{marked}</strong> {tManagerUi('of')} <strong>{filtered.length}</strong> {tManagerUi('in_the_local_preview_for')} <strong>{date}</strong>
        </p>
        <button type="button" disabled title={tManagerUi('attendance_save_unavailable_verified_host_attendance_mut_d8dff8')} className="eng-btn eng-btn--primary cursor-not-allowed" data-testid="manager-engagement-attendance-save-disabled">
          <Save size={15}/> {tManagerUi('save_unavailable')}
        </button>
      </div>
    </div>
  );
}
