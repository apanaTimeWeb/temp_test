'use client';
import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import { useTranslations } from 'next-intl';

import { MANAGER_ATTENDANCE_DAILY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.url_config';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import { ManagerAttendanceDailyStudentRow } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyStudentRow';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ManagerAttendanceDailyEmptyState } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_empty_states/ManagerAttendanceDailyEmptyState';
import { ManagerAttendanceDailyFloorTurnoverQueue } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyFloorTurnoverQueue';
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
  const [activeTab, setActiveTab] = useState<'roster' | 'turnover'>('roster');
  const [date, setDate] = useState(() => toLocalDateInputValue(new Date()));
  const [shift, setShift]       = useState('All');
  const [students, setStudents] = useState<Student[]>(INIT_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: tManagerUi('afternoon'),
    Evening: tManagerUi('evening'),
  };
  const shiftLabel = (value: string) => value === 'All' ? tManagerUi('all') : (shiftLabels[value] ?? value);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchShift = shift === 'All' || s.shift === shift;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.smartId.toLowerCase().includes(q);
      return matchShift && matchSearch;
    });
  }, [students, shift, searchQuery]);

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedStudents = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const marked   = filtered.filter(s => s.status !== null).length;
  const present  = filtered.filter(s => s.status === 'present').length;
  const absent   = filtered.filter(s => s.status === 'absent').length;
  const late     = filtered.filter(s => s.status === 'late').length;

  const setStatus = (id: string, status: AttStatus) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, status } : s));

  const setField = (id: string, field: ManagerAttendanceDailyTimeField, val: string) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, [field]: val } : s));

  const handleSendAlert = (student: Student) => {
    toast.success(`Absentee warning notice dispatched to ${student.name} (${student.smartId}) for ${student.consecutiveAbsent} consecutive days!`);
  };

  const handleExportCsv = () => {
    const headers = 'Smart ID,Name,Shift,Status,In Time,Out Time\n';
    const rows = filtered
      .map((s) => `"${s.smartId}","${s.name}","${s.shift}","${s.status ?? 'unmarked'}","${s.inTime || ''}","${s.outTime || ''}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `attendance_register_${date}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAttendance = () => {
    toast.success(`Attendance for ${date} (${marked} students recorded) saved successfully.`);
  };


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

      {/* ── View Mode Tabs ── */}
      <div className="flex items-center gap-3 border-b border-border mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`pb-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'roster'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {tManagerUi('roster_tab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('turnover')}
          className={`flex items-center gap-1.5 pb-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'turnover'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>{tManagerUi('turnover_queue_tab')}</span>
          <span className="rounded-full bg-danger-bg text-danger-text px-2 py-0.5 text-xs font-bold">
            3
          </span>
        </button>
      </div>

      {activeTab === 'turnover' ? (
        <ManagerAttendanceDailyFloorTurnoverQueue />
      ) : (
        <>
          {/* ── Filters ── */}
          <div className="eng-card eng-card--flush eng-mb-6">
            <div className="eng-filter-row">
              <div className="eng-filter-field flex-1 min-w-[220px]">
                <label className="eng-label" htmlFor="daily-att-search">Search Student</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    id="daily-att-search"
                    type="search"
                    placeholder="Search name or smart ID..."
                    className="eng-input pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>
              </div>
              <div className="eng-filter-field">
                <label className="eng-label" htmlFor="rbg4-managerengagementattendancepage-103">{tManagerUi('date')}</label>
                <input id="rbg4-managerengagementattendancepage-103" type="date" className="eng-input" value={date} onChange={(e) => setDate(e.target.value)} aria-label={tManagerUi('date')} />
              </div>
              <div className="eng-filter-field">
                <label className="eng-label" htmlFor="rbg4-managerengagementattendancepage-108">{tManagerUi('shift')}</label>
                <select id="rbg4-managerengagementattendancepage-108" className="eng-select eng-filter-select" value={shift}
                  onChange={e => {
                    setShift(e.target.value);
                    setPage(0);
                  }}>
                  <option value="All">{tManagerUi('all')}</option>
                  <option value="Morning">{tManagerUi('morning')}</option>
                  <option value="Afternoon">{tManagerUi('afternoon')}</option>
                  <option value="Evening">{tManagerUi('evening')}</option>
                </select>
              </div>
              <div className="eng-filter-badges flex items-center gap-2">
                <span className="eng-badge eng-badge--success">{present} {tManagerUi('present')}</span>
                <span className="eng-badge eng-badge--danger">{absent} {tManagerUi('absent')}</span>
                <span className="eng-badge eng-badge--warning">{late} {tManagerUi('late')}</span>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="mgr-btn-ghost flex items-center gap-1.5 text-xs whitespace-nowrap ml-auto"
                  title="Export Attendance Register as CSV"
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
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
              ) : paginatedStudents.map((student) => (
                <ManagerAttendanceDailyStudentRow
                  key={student.id}
                  student={student}
                  onStatusChange={setStatus}
                  onFieldChange={setField}
                  onSendAlert={handleSendAlert}
                />
              ))}
            </div>
            {totalRows > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-text-secondary">
                <span>
                  Showing {startItem}–{endItem} of {totalRows} student records
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="daily-att-rows-per-page" className="text-xs text-text-secondary whitespace-nowrap">Rows per page:</label>
                    <select
                      id="daily-att-rows-per-page"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                      }}
                      className="rounded border border-border bg-input px-2 py-1 text-xs text-text-primary"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={effectivePage === 0}
                      onClick={() => setPage(effectivePage - 1)}
                      className="eng-btn eng-btn--secondary py-1 px-3 text-xs disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs">
                      Page {effectivePage + 1} of {pageCount}
                    </span>
                    <button
                      type="button"
                      disabled={effectivePage >= pageCount - 1}
                      onClick={() => setPage(effectivePage + 1)}
                      className="eng-btn eng-btn--secondary py-1 px-3 text-xs disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky Save Bar ── */}
          <div className="eng-save-bar">
            <p className="eng-save-bar-info">
              <strong>{marked}</strong> {tManagerUi('of')} <strong>{filtered.length}</strong> {tManagerUi('in_the_local_preview_for')} <strong>{date}</strong>
            </p>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="eng-btn eng-btn--primary"
              data-testid="manager-engagement-attendance-save"
            >
              <Save size={15}/> Save Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
}
