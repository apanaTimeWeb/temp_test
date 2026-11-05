'use client';
import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import { useTranslations } from 'next-intl';

import { MANAGER_ATTENDANCE_DAILY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.url_config';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import { ManagerAttendanceDailyStudentRow } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyStudentRow';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Save,
  Search,
  Download,
  Calendar,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ManagerAttendanceDailyEmptyState } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_empty_states/ManagerAttendanceDailyEmptyState';
import { ManagerAttendanceDailyFloorTurnoverQueue } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyFloorTurnoverQueue';
import type {
  AttStatus,
  Student,
  ManagerAttendanceDailyTimeField,
} from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';

const INIT_STUDENTS: Student[] = MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE.map((student) => ({ ...student }));

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// RESPONSIBILITY: Render the attendance_daily feature view while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAttendanceDailyPage({
  view,
  id,
  name,
  phone,
  smartId,
}: ManagerAttendanceDailyMainProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');
  const todayStr = toLocalDateInputValue(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = toLocalDateInputValue(yesterdayDate);

  const [activeTab, setActiveTab] = useState<'roster' | 'turnover'>('roster');
  const [date, setDate] = useState(() => todayStr);
  const [shift, setShift] = useState('All');
  const [students, setStudents] = useState<Student[]>(INIT_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isSyncing, setIsSyncing] = useState(false);

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: tManagerUi('afternoon'),
    Evening: tManagerUi('evening'),
  };
  const shiftLabel = (value: string) => (value === 'All' ? tManagerUi('all') : shiftLabels[value] ?? value);

  const handleSyncAttendance = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Biometric turnstile entry logs synchronized');
    }, 600);
  };

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

  const marked = filtered.filter((s) => s.status !== null).length;
  const present = filtered.filter((s) => s.status === 'present').length;
  const absent = filtered.filter((s) => s.status === 'absent').length;
  const late = filtered.filter((s) => s.status === 'late').length;

  const setStatus = (id: string, status: AttStatus) =>
    setStudents((p) => p.map((s) => (s.id === id ? { ...s, status } : s)));

  const setField = (id: string, field: ManagerAttendanceDailyTimeField, val: string) =>
    setStudents((p) => p.map((s) => (s.id === id ? { ...s, [field]: val } : s)));

  const handleSendAlert = (student: Student) => {
    toast.success(
      `Absentee warning notice dispatched to ${student.name} (${student.smartId}) for ${student.consecutiveAbsent} consecutive days!`
    );
  };

  const dateLabel = useMemo(() => {
    if (date === todayStr) return 'Today';
    if (date === yesterdayStr) return 'Yesterday';
    return date;
  }, [date, todayStr, yesterdayStr]);

  const handleExportCsv = () => {
    const headers = `Attendance Register Export - Date: ${dateLabel}\nSmart ID,Name,Shift,Status,In Time,Out Time\n`;
    const rows = filtered
      .map(
        (s) =>
          `"${s.smartId}","${s.name}","${s.shift}","${s.status ?? 'unmarked'}","${s.inTime || ''}","${s.outTime || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `attendance_register_${dateLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Attendance register exported to CSV');
  };

  const handleSaveAttendance = () => {
    toast.success(`Attendance for ${dateLabel} (${marked} students recorded) saved successfully.`);
  };

  return (
    <div
      className="eng-page space-y-6"
      data-route-view={view}
      data-route-id={id}
      data-route-name={name}
      data-route-phone={phone}
      data-route-smart-id={smartId}
    >
      {/* ── Executive ERP Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Link
                href={MANAGER_ATTENDANCE_DAILY_ROUTES.attendance}
                className="font-semibold text-primary uppercase tracking-wider hover:underline"
              >
                {tManagerUi('engagement')}
              </Link>
              <ChevronRight size={12} className="text-secondary" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={12} />
                Daily Attendance Register
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-secondary border border-border">
                📍 Central Branch
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {tManagerUi('daily_attendance')}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
                {filtered.length} Students • Date: {dateLabel}
              </span>
            </div>

            <p className="text-sm text-secondary">
              {tManagerUi('mark_attendance_for_all_enrolled_students_by_shift')} • Date: {dateLabel}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncAttendance}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
              title="Sync Biometric Turnstiles"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Turnstiles'}</span>
            </button>
          </div>
        </div>

        {/* Warning hint */}
        <p
          className="mt-4 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-warning leading-relaxed"
          role="status"
          data-testid="manager-engagement-attendance-contract-warning"
        >
          {tManagerUi('sample_attendance_only_status_edits_are_an_in_page_previ_f63093')}
        </p>
      </div>

      {/* ── Specific Date Navigator Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Register Roll Date:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Selectors: Today | Yesterday */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => {
                setDate(todayStr);
                setPage(0);
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                date === todayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setDate(yesterdayStr);
                setPage(0);
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                date === yesterdayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Yesterday
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
            <input
              id="rbg4-managerengagementattendancepage-103"
              type="date"
              className="px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-semibold text-primary outline-none focus:border-primary cursor-pointer"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setPage(0);
              }}
              aria-label={tManagerUi('date')}
            />
          </div>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('total_students')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-primary">{filtered.length}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{dateLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">
              {shiftLabel(shift)} shift ({dateLabel})
            </p>
          </div>
        </div>

        {/* Present */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('present')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {present}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-emerald-600 dark:text-emerald-400 border border-border">
                [{dateLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">
              {filtered.length ? Math.round((present / filtered.length) * 100) : 0}
              {tManagerUi('rate')} attendance rate ({dateLabel})
            </p>
          </div>
        </div>

        {/* Absent */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('absent')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <UserX size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {absent}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-rose-600 dark:text-rose-400 border border-border">
                [{dateLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">
              {filtered.filter((s) => s.consecutiveAbsent >= 3).length} {tManagerUi('need_alerts')} ({dateLabel})
            </p>
          </div>
        </div>

        {/* Late */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('late')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{late}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-amber-600 dark:text-amber-400 border border-border">
                [{dateLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">
              {marked}/{filtered.length} {tManagerUi('marked')} ({dateLabel})
            </p>
          </div>
        </div>
      </div>

      {/* ── View Mode Tabs ── */}
      <div className="flex items-center gap-3 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'roster'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          {tManagerUi('roster_tab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('turnover')}
          className={`flex items-center gap-1.5 pb-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'turnover'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          <span>{tManagerUi('turnover_queue_tab')}</span>
          <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-xs font-bold">
            3
          </span>
        </button>
      </div>

      {activeTab === 'turnover' ? (
        <ManagerAttendanceDailyFloorTurnoverQueue />
      ) : (
        <>
          {/* ── Filters & Search Toolbar ── */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    id="daily-att-search"
                    type="search"
                    placeholder="Search student name or smart ID..."
                    className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>

                {/* Shift Selector */}
                <div className="flex items-center gap-1.5">
                  <select
                    id="rbg4-managerengagementattendancepage-108"
                    className="min-h-9 py-1 px-3 bg-muted/40 border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
                    value={shift}
                    onChange={(e) => {
                      setShift(e.target.value);
                      setPage(0);
                    }}
                  >
                    <option value="All">{tManagerUi('all')}</option>
                    <option value="Morning">{tManagerUi('morning')}</option>
                    <option value="Afternoon">{tManagerUi('afternoon')}</option>
                    <option value="Evening">{tManagerUi('evening')}</option>
                  </select>
                </div>

                {/* Status Counter Badges */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {present} {tManagerUi('present')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {absent} {tManagerUi('absent')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {late} {tManagerUi('late')}
                  </span>
                  <span className="text-xs font-semibold text-secondary px-1 shrink-0">
                    Showing {startItem}-{endItem} of {totalRows} students ({dateLabel})
                  </span>
                </div>
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
                title="Export Attendance Register as CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* ── Student List ── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <ManagerAttendanceDailyEmptyState className="py-12 text-center">
                  <div className="text-3xl mb-2" aria-hidden="true">
                    📅
                  </div>
                  <p className="font-semibold text-primary text-sm">
                    No students found for {shiftLabel(shift)} shift on {dateLabel}.
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {tManagerUi('try_selecting_a_different_shift_or_date')}
                  </p>
                </ManagerAttendanceDailyEmptyState>
              ) : (
                paginatedStudents.map((student) => (
                  <ManagerAttendanceDailyStudentRow
                    key={student.id}
                    student={student}
                    onStatusChange={setStatus}
                    onFieldChange={setField}
                    onSendAlert={handleSendAlert}
                  />
                ))
              )}
            </div>

            {totalRows > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-secondary bg-muted/10">
                <span>
                  Showing {startItem}–{endItem} of {totalRows} student records
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="daily-att-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                      Rows per page:
                    </label>
                    <select
                      id="daily-att-rows-per-page"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                      }}
                      className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary outline-none"
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
                      className="px-3 py-1 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-medium">
                      Page {effectivePage + 1} of {pageCount}
                    </span>
                    <button
                      type="button"
                      disabled={effectivePage >= pageCount - 1}
                      onClick={() => setPage(effectivePage + 1)}
                      className="px-3 py-1 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky Save Bar ── */}
          <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-md p-4 shadow-md flex items-center justify-between gap-4">
            <p className="text-xs text-secondary">
              <strong className="text-primary font-bold">{marked}</strong> {tManagerUi('of')}{' '}
              <strong className="text-primary font-bold">{filtered.length}</strong>{' '}
              {tManagerUi('in_the_local_preview_for')}{' '}
              <strong className="text-primary font-bold">{date}</strong>
            </p>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="mgr-btn-primary px-4 py-2 rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
              data-testid="manager-engagement-attendance-save"
            >
              <Save size={14} /> Save Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
}
