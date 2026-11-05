'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import { MANAGER_ATTENDANCE_DAILY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.url_config';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import { ManagerAttendanceDailyFloorTurnoverQueue } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_widgets/ManagerAttendanceDailyFloorTurnoverQueue';
import type {
  AttStatus,
  Student,
  ManagerAttendanceDailyTimeField,
} from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';
import { ManagerAttendanceDailyKpis } from './ManagerAttendanceDailyKpis';
import { ManagerAttendanceDailyToolbar } from './ManagerAttendanceDailyToolbar';
import { ManagerAttendanceDailyTable } from './ManagerAttendanceDailyTable';

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

  const setStatus = (studentId: string, status: AttStatus) =>
    setStudents((p) => p.map((s) => (s.id === studentId ? { ...s, status } : s)));

  const setField = (studentId: string, field: ManagerAttendanceDailyTimeField, val: string) =>
    setStudents((p) => p.map((s) => (s.id === studentId ? { ...s, [field]: val } : s)));

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
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-success-bg text-success border border-border">
                <CheckCircle2 size={12} />
                Daily Attendance Register
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-surface-highlight text-secondary border border-border">
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
          className="mt-4 rounded-xl border border-border bg-warning-bg p-3 text-xs text-warning leading-relaxed"
          role="status"
          data-testid="manager-engagement-attendance-contract-warning"
        >
          {tManagerUi('sample_attendance_only_status_edits_are_an_in_page_previ_f63093')}
        </p>
      </div>

      <ManagerAttendanceDailyToolbar
        date={date}
        setDate={setDate}
        todayStr={todayStr}
        yesterdayStr={yesterdayStr}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shift={shift}
        setShift={setShift}
        present={present}
        absent={absent}
        late={late}
        startItem={startItem}
        endItem={endItem}
        totalRows={totalRows}
        dateLabel={dateLabel}
        onExportCsv={handleExportCsv}
        onResetPage={() => setPage(0)}
      />

      <ManagerAttendanceDailyKpis
        filtered={filtered}
        dateLabel={dateLabel}
        shift={shift}
        shiftLabel={shiftLabel}
        present={present}
        absent={absent}
        late={late}
        marked={marked}
      />

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
          <span className="rounded-full bg-danger-bg text-danger border border-border px-2 py-0.5 text-xs font-bold">
            3
          </span>
        </button>
      </div>

      {activeTab === 'turnover' ? (
        <ManagerAttendanceDailyFloorTurnoverQueue />
      ) : (
        <>
          <ManagerAttendanceDailyTable
            filtered={filtered}
            paginatedStudents={paginatedStudents}
            shift={shift}
            shiftLabel={shiftLabel}
            dateLabel={dateLabel}
            totalRows={totalRows}
            startItem={startItem}
            endItem={endItem}
            pageSize={pageSize}
            setPageSize={setPageSize}
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            effectivePage={effectivePage}
            onStatusChange={setStatus}
            onFieldChange={setField}
            onSendAlert={handleSendAlert}
          />

          {/* ── Sticky Save Bar ── */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-md flex items-center justify-between gap-4">
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
