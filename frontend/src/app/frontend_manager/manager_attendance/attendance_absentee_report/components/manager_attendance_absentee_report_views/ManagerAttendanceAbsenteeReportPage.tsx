'use client';

import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import ManagerAttendanceAbsenteeReportNativeTable from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';
import { useManagerAbsenteeReportDemoData } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/useManagerAttendanceAbsenteeReportDemoData';
import { useState, useMemo } from 'react';
import {
  Send,
  Search,
  MessageSquare,
  Printer,
  Download,
  RotateCcw,
  X,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { createManagerAbsenteeReportAbsenteeColumns } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportColumns';
import ManagerAttendanceAbsenteeTimeHorizonBar, {
  type ManagerAbsenteeTimeHorizon,
} from './ManagerAttendanceAbsenteeTimeHorizonBar';
import { ManagerAttendanceAbsenteeBulkWhatsAppModal } from './ManagerAttendanceAbsenteeBulkWhatsAppModal';
import { ManagerAttendanceAbsenteeDetailsModal } from './ManagerAttendanceAbsenteeDetailsModal';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '../../hooks/ManagerAttendanceAbsenteeReportDemoRepository';

const SHIFT_OPTIONS = [
  { id: 'All', label: 'All Shifts' },
  { id: 'Morning', label: 'Morning' },
  { id: 'Afternoon', label: 'Afternoon' },
  { id: 'Evening', label: 'Evening' },
  { id: 'Night', label: 'Night' },
  { id: 'Full Day', label: 'Full Day' },
];

const THRESHOLD_OPTIONS = [
  { id: '3', label: '3+ Days' },
  { id: '5', label: '5+ Days' },
  { id: '7', label: '7+ Days Critical' },
  { id: 'all', label: 'Show All' },
];

const ALERT_STATUS_OPTIONS = [
  { id: 'all', label: 'All Statuses' },
  { id: 'pending', label: 'Pending Alert' },
  { id: 'notified', label: 'Notified' },
] as const;

export default function ManagerAttendanceAbsenteeReportPage({
  view,
  id,
  name,
  phone,
  smartId,
}: ManagerAttendanceAbsenteeReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_absentee_report.ui');
  const locale = useLocale();

  const initialRows = useManagerAbsenteeReportDemoData();

  // Distribute sample dates relative to current date so all time horizons yield meaningful demo records
  const initialRowsWithDates: ManagerAttendanceAbsenteeReportSampleAbsentee[] = useMemo(() => {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return initialRows.map((r, idx) => {
      const d = new Date(today);
      if (idx === 0) {
        d.setDate(d.getDate() - 1);
      } else if (idx === 1) {
        d.setDate(d.getDate() - 3);
      } else if (idx === 2) {
        d.setDate(d.getDate() - 5);
      } else if (idx === 3) {
        d.setDate(d.getDate() - 8);
      } else {
        d.setDate(d.getDate() - 14);
      }
      return { ...r, lastSeen: fmt(d) };
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
    setRowsList((prev) => prev.map((r) => (r.smartId === item.smartId ? { ...r, notified: true } : r)));
    if (selectedAbsentee && selectedAbsentee.smartId === item.smartId) {
      setSelectedAbsentee({ ...selectedAbsentee, notified: true });
    }
    toast.success(`WhatsApp notice dispatched for ${item.name}`);
  };

  const handleMarkExcused = (smartId: string, reason: string) => {
    setRowsList((prev) =>
      prev.map((r) => (r.smartId === smartId ? { ...r, excused: true, leaveReason: reason } : r))
    );
    if (selectedAbsentee && selectedAbsentee.smartId === smartId) {
      setSelectedAbsentee({ ...selectedAbsentee, excused: true, leaveReason: reason });
    }
    toast.success(`Absence for ${smartId} marked as Excused Leave (${reason})`);
  };

  const handleRevokeExcused = (smartId: string) => {
    setRowsList((prev) =>
      prev.map((r) => (r.smartId === smartId ? { ...r, excused: false, leaveReason: undefined } : r))
    );
    if (selectedAbsentee && selectedAbsentee.smartId === smartId) {
      setSelectedAbsentee({ ...selectedAbsentee, excused: false, leaveReason: undefined });
    }
    toast.info(`Excused status revoked for ${smartId}`);
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
        alertStatusFilter === 'all' ||
        (alertStatusFilter === 'notified' ? r.notified : !r.notified);
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.smartId.toLowerCase().includes(q) ||
        (r.parentPhone && r.parentPhone.includes(q)) ||
        (r.parentEmail && r.parentEmail.toLowerCase().includes(q));
      return matchThr && matchShift && matchAlertStatus && matchQ;
    });
  }, [timeFilteredRows, threshold, shift, alertStatusFilter, searchQuery]);

  const critical = filtered.filter((r) => r.daysAbsent >= 7);
  const moderate = filtered.filter((r) => r.daysAbsent >= 3 && r.daysAbsent < 7);
  const notifiedCount = filtered.filter((r) => r.notified).length;

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
      shift !== 'All' ||
      threshold !== '3' ||
      timeHorizon !== 'all' ||
      alertStatusFilter !== 'all' ||
      customStartDate !== '' ||
      customEndDate !== ''
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setShift('All');
    setThreshold('3');
    setTimeHorizon('all');
    setAlertStatusFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    toast.info('Absentee filters reset to default.');
  };

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Student Name',
      'Smart ID',
      'Shift',
      'Days Absent',
      'Last Seen',
      'Parent Phone',
      'Parent Email',
      'Alert Status',
      'Excused Status',
      'Leave Reason',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = filtered
      .map((item) =>
        [
          item.name,
          item.smartId,
          item.shift,
          item.daysAbsent,
          item.lastSeen,
          item.parentPhone,
          item.parentEmail,
          item.notified ? 'Notified' : 'Pending Alert',
          item.excused ? 'Excused Leave' : 'Unexcused',
          item.leaveReason || '',
        ]
          .map(escapeCsv)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `absentee_report_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Absentee report exported to CSV successfully');
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
      {/* ── Clean Executive Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              {tManagerUi('absentee_report_23bf56')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-bold border border-border">
              {filtered.length} Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {tManagerUi('students_with_consecutive_absences_requiring_attention')}
          </p>
        </div>

        {/* Action Buttons: Print Report, Export CSV, Bulk WhatsApp Alerts */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Print Absentee Report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Export Absentee Report as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBulkWhatsAppOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            title="Launch bulk WhatsApp alerts queue for absentees"
          >
            <MessageSquare size={14} />
            <span>Bulk WhatsApp Alerts ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* ── Global Time Horizon Filter Bar with Glowing Halos ── */}
      <ManagerAttendanceAbsenteeTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      {/* ── Clean Executive KPI Cards (No [All Time] clutter, Non-toggle Display Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Absentees */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {tManagerUi('total_absentees')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-indigo-400 font-mono">
              {filtered.length}
            </div>
            <p className="mt-1 text-xs text-secondary">
              Above {threshold === 'all' ? '0' : threshold} days unexcused absence
            </p>
          </div>
        </div>

        {/* Critical (7+ Days) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {tManagerUi('critical_7_days')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-rose-400 font-mono">
              {critical.length}
            </div>
            <p className="mt-1 text-xs text-secondary">Immediate seat re-allocation risk</p>
          </div>
        </div>

        {/* Moderate (3-6 Days) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {tManagerUi('moderate_3_6_days')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-amber-400 font-mono">
              {moderate.length}
            </div>
            <p className="mt-1 text-xs text-secondary">Active attendance monitoring</p>
          </div>
        </div>

        {/* Parents Notified */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs cursor-default select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {tManagerUi('parents_notified')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
              {notifiedCount}
            </div>
            <p className="mt-1 text-xs text-secondary">Of {filtered.length} total filtered absentees</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Non-overlapping Search, Shift Filter & Thresholds ── */}
      <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
        {/* Top Row: Shift Pills & Alert Status Filter with Glowing Halos */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-secondary shrink-0 mr-1">Shift:</span>
            {SHIFT_OPTIONS.map((opt) => {
              const isActive = shift === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setShift(opt.id)}
                  style={
                    isActive
                      ? {
                          boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
                          backgroundColor: '#6366f1',
                          borderColor: '#818cf8',
                          color: '#ffffff',
                        }
                      : undefined
                  }
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border shadow-sm font-bold'
                      : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none shrink-0">
            <span className="text-xs font-semibold text-secondary shrink-0 mr-1">Alert:</span>
            {ALERT_STATUS_OPTIONS.map((opt) => {
              const isActive = alertStatusFilter === opt.id;
              const glowColor =
                opt.id === 'pending'
                  ? 'rgba(245, 158, 11, 0.45)'
                  : opt.id === 'notified'
                  ? 'rgba(16, 185, 129, 0.45)'
                  : 'rgba(99, 102, 241, 0.45)';
              const bgActive =
                opt.id === 'pending'
                  ? '#d97706'
                  : opt.id === 'notified'
                  ? '#059669'
                  : '#6366f1';
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAlertStatusFilter(opt.id)}
                  style={
                    isActive
                      ? {
                          boxShadow: `0 0 16px ${glowColor}`,
                          backgroundColor: bgActive,
                          borderColor: bgActive,
                          color: '#ffffff',
                        }
                      : undefined
                  }
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border shadow-sm font-bold'
                      : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
                title="Reset all active filters"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Non-Overlapping Search & Threshold Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Guaranteed Non-Overlapping Search Box with Z-10 Icon and Clear Button */}
          <div className="relative flex-1 min-w-[240px] flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student name, smart ID, phone, or email..."
              style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
              className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors cursor-pointer z-10"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Threshold Segmented Options & Badges */}
          <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
            <div className="flex items-center gap-1.5">
              <label htmlFor="absentee-threshold-select" className="text-xs text-secondary whitespace-nowrap">
                Threshold:
              </label>
              <select
                id="absentee-threshold-select"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {THRESHOLD_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                {critical.length} Critical
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {moderate.length} Moderate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Native Table Ledger ── */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-base font-semibold text-primary mb-1">
              {tManagerUi('no_absentees_above_threshold')}
            </p>
            <p className="text-xs text-secondary max-w-md">
              {tManagerUi('all_students_have_great_attendance_above_the_selected_th_12de3c')}
            </p>
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
              labels={{
                previous: tManagerUi('previous_page'),
                next: tManagerUi('next_page'),
              }}
            />
          </div>
        )}
      </div>

      {/* ── Single Absentee Details Modal ── */}
      <ManagerAttendanceAbsenteeDetailsModal
        isOpen={Boolean(selectedAbsentee)}
        absentee={selectedAbsentee}
        onClose={() => setSelectedAbsentee(null)}
        onSendWhatsApp={handleAlertWhatsApp}
        onMarkExcused={handleMarkExcused}
        onRevokeExcused={handleRevokeExcused}
      />

      {/* ── Bulk WhatsApp Notice Modal ── */}
      <ManagerAttendanceAbsenteeBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        absentees={filtered}
        onComplete={() => {
          setIsBulkWhatsAppOpen(false);
          setRowsList((prev) =>
            prev.map((r) => (filtered.some((f) => f.smartId === r.smartId) ? { ...r, notified: true } : r))
          );
          toast.success('Bulk WhatsApp alerts queued successfully!');
        }}
      />
    </div>
  );
}
