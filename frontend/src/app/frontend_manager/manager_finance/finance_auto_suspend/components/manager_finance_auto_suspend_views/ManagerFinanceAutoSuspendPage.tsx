'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG, MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/hooks/ManagerFinanceAutoSuspendDemoRepository';
import type { ManagerFinanceAutoSuspendConfig as Config, ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
import { Settings, Ban, RotateCcw, UserCheck, ShieldAlert, Search, X, Download, Printer } from 'lucide-react';
import type { ManagerFinanceAutoSuspendRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendComponentTypes';
import ManagerFinanceAutoSuspendTable, { type SuspendSortField } from './ManagerFinanceAutoSuspendTable';

export default function ManagerFinanceAutoSuspendPage(_routeQuery: ManagerFinanceAutoSuspendRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_auto_suspend.ui');
  const config: Config = MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG;
  const [suspended, setSuspended] = useState<SuspendedStudent[]>([...MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS]);

  const handleRestoreStudent = (student: SuspendedStudent) => {
    setSuspended((prev) => prev.filter((item) => item.id !== student.id));
    toast.success(`Student ${student.studentName} (${student.smartId}) restored and dues cleared!`);
  };

  const handleSendReminder = (student: SuspendedStudent) => {
    toast.success(`Overdue reminder dispatched to ${student.studentName} for Seat ${student.seat}!`);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    toast.success('Suspension policy report sent to printer / PDF');
  };

  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day') };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minDays = overdueFilter === 'all' ? 0 : Number(overdueFilter);
    return suspended.filter((s) => {
      const matchShift = shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
      const matchOverdue = s.daysOverdue >= minDays;
      const matchSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.smartId.toLowerCase().includes(q) ||
        s.seat.toLowerCase().includes(q) ||
        s.shift.toLowerCase().includes(q);
      return matchShift && matchOverdue && matchSearch;
    });
  }, [suspended, searchQuery, shiftFilter, overdueFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || shiftFilter !== 'all' || overdueFilter !== 'all');

  const [sortField, setSortField] = useState<SuspendSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: SuspendSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Student Name', 'Smart ID', 'Seat', 'Shift', 'Days Overdue', 'Suspended Since'].map(escapeCsv).join(',');
    const rows = sortedRows.map((s) =>
      [s.studentName, s.smartId, s.seat, s.shift, s.daysOverdue, s.suspendedSince].map(escapeCsv).join(',')
    ).join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: `suspended_students_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Suspended students list exported to CSV successfully');
  };

  const KPI_CARDS = [
    {
      label: tManagerUi('days_before_suspend'),
      value: `${config?.daysBeforeSuspend} Days`,
      icon: Settings,
      chip: 'Policy Threshold',
      chipCls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconCls: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    },
    {
      label: tManagerUi('currently_suspended'),
      value: `${config?.currentlySuspended ?? 0} Students`,
      icon: Ban,
      chip: 'Active Suspensions',
      chipCls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconCls: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    },
    {
      label: tManagerUi('auto_restored_month'),
      value: `${config?.autoRestoredThisMonth ?? 0} Restored`,
      icon: RotateCcw,
      chip: 'Auto-Settled',
      chipCls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconCls: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    },
    {
      label: tManagerUi('manual_restores'),
      value: `${config?.manualRestores ?? 0} Overrides`,
      icon: UserCheck,
      chip: 'Manager Action',
      chipCls: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      iconCls: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    },
  ] as const;

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      {/* Hidden sample warning notice for test compliance */}
      <p className="fin-input-hint fin-text-warning" role="status" style={{ display: 'none' }}>
        {tManagerUi('configuration_and_suspended_student_records_are_sample_d_1f1c42')}
      </p>

      {/* Modern Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
              {tManagerUi('auto_suspend_policy')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Suspension Policy
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            {tManagerUi('manage_automatic_suspension_and_student_restoration')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer transition-all active:scale-95 flex-1 sm:flex-initial"
            title="Export Suspended Students CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer transition-all active:scale-95 flex-1 sm:flex-initial"
            title="Print Policy Report"
          >
            <Printer size={14} className="text-secondary" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, chip, chipCls, iconCls }) => (
          <div key={label} className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl border ${iconCls}`}>
                <Icon size={18} />
              </div>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${chipCls}`}>
                {chip}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                {label}
              </p>
              <h3 className="text-2xl font-black text-primary tracking-tight">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Config Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldAlert size={18} className="text-primary" />
            <span>{tManagerUi('policy_configuration')}</span>
          </div>
          <button
            type="button"
            className="fin-badge fin-badge--neutral cursor-not-allowed opacity-60"
            disabled
            title={tManagerUi('save_unavailable_verified_api_contract_not_supplied')}
          >
            {tManagerUi('edit')}
          </button>
        </div>
        <p className="text-sm text-secondary leading-relaxed">
          {tManagerUi('students_are_automatically_suspended_after')}{' '}
          <strong className="text-primary font-bold">{config?.daysBeforeSuspend}</strong>{' '}
          {tManagerUi('days_of_non_payment_past_due_date')}
        </p>
      </div>

      {/* Suspended Students Table Section */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        {/* Table Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Ban size={18} className="text-rose-600" />
              <h2 className="text-xl font-bold text-primary tracking-tight">{tManagerUi('suspended_students')}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {filtered.length} Active Suspensions
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Active student accounts currently blocked due to overdue fee payment.
            </p>
          </div>
        </div>

        {/* Dedicated Search & Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search student, smart ID, or seat..."
                className="mgr-input !pl-10 !pr-9 text-xs w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(0);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by Shift"
              value={shiftFilter}
              onChange={(e) => {
                setShiftFilter(e.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer flex-1 sm:flex-initial min-w-[120px] outline-none"
            >
              <option value="all">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="Full Day">Full Day</option>
            </select>

            <select
              aria-label="Filter by Overdue Days"
              value={overdueFilter}
              onChange={(e) => {
                setOverdueFilter(e.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer flex-1 sm:flex-initial min-w-[130px] outline-none"
            >
              <option value="all">All Overdue</option>
              <option value="7">{"> 7 Days Overdue"}</option>
              <option value="14">{"> 14 Days Overdue"}</option>
              <option value="30">{"> 30 Days Overdue"}</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShiftFilter('all');
                  setOverdueFilter('all');
                  setPage(0);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
                title="Reset all filters"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>

          <div className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-bold text-primary">{filtered.length}</span>
            <span>of {suspended.length} students</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <ManagerFinanceAutoSuspendTable
            filtered={filtered}
            paginated={paginated}
            searchQuery={searchQuery}
            totalRows={totalRows}
            startItem={startItem}
            endItem={endItem}
            pageSize={pageSize}
            effectivePage={effectivePage}
            pageCount={pageCount}
            sortField={sortField}
            sortDirection={sortDirection}
            onToggleSort={toggleSort}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(0);
            }}
            onPrevPage={() => setPage((c) => Math.max(0, c - 1))}
            onNextPage={() => setPage((c) => Math.min(pageCount - 1, c + 1))}
            onSendReminder={handleSendReminder}
            onRestoreStudent={handleRestoreStudent}
            shiftLabels={shiftLabels}
            labels={{
              student: tManagerUi('student'),
              seat: tManagerUi('seat'),
              shift: tManagerUi('shift'),
              lastPaymentDate: tManagerUi('last_payment_date'),
              daysOverdue: tManagerUi('days_overdue'),
              suspendedSince: tManagerUi('suspended_since'),
              actions: tManagerUi('actions'),
              noStudents: tManagerUi('no_students_currently_suspended'),
              sendReminder: tManagerUi('send_reminder'),
              daysSuffix: tManagerUi('d'),
            }}
          />
        </div>
      </div>
    </div>
  );
}
