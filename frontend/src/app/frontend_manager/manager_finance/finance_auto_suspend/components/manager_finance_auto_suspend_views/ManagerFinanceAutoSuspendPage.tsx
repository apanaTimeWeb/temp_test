'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG, MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/hooks/ManagerFinanceAutoSuspendDemoRepository';
import type { ManagerFinanceAutoSuspendConfig as Config, ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
import { Settings, Ban, RotateCcw, UserCheck, ShieldAlert, Search, X, Download } from 'lucide-react';
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

  const handleExportCsv = () => {
    const headers = 'Student Name,Smart ID,Seat,Shift,Days Overdue,Suspended Since\n';
    const rows = sortedRows.map((s) =>
      `"${s.studentName}","${s.smartId}","${s.seat}","${s.shift}","${s.daysOverdue}","${s.suspendedSince}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `suspended_students_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Suspended students list exported to CSV successfully');
  };

  const KPI_CARDS = [
    { label: tManagerUi('days_before_suspend'), value: config?.daysBeforeSuspend, icon: Settings, variant: 'default' },
    { label: tManagerUi('currently_suspended'), value: config?.currentlySuspended ?? 0, icon: Ban, variant: 'danger' },
    { label: tManagerUi('auto_restored_month'), value: config?.autoRestoredThisMonth ?? 0, icon: RotateCcw, variant: 'default' },
    { label: tManagerUi('manual_restores'), value: config?.manualRestores ?? 0, icon: UserCheck, variant: 'default' },
  ] as const;

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      <div>
        <p className="fin-input-hint fin-text-warning" role="status">
          {tManagerUi('configuration_and_suspended_student_records_are_sample_d_1f1c42')}
        </p>
        <h1 className="fin-page-title">{tManagerUi('auto_suspend_policy')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('manage_automatic_suspension_and_student_restoration')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`fin-kpi-card ${variant === 'danger' ? 'fin-kpi-card--danger' : ''}`}>
            <div className="fin-kpi-card__header">
              <span className={`fin-kpi-label ${variant === 'danger' ? 'fin-kpi-label--danger' : ''}`}>{label}</span>
              <Icon size={16} className={variant === 'danger' ? 'fin-text-danger' : 'fin-icon-muted'} />
            </div>
            <p className={`fin-kpi-value ${variant === 'danger' ? 'fin-kpi-value--danger' : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Policy Config */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <ShieldAlert size={18} className="fin-icon-muted" />
            {tManagerUi('policy_configuration')}
          </div>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('save_unavailable_verified_api_contract_not_supplied')}>
            {tManagerUi('edit')}
          </button>
        </div>
        <p className="fin-policy-text">
          {tManagerUi('students_are_automatically_suspended_after')} <strong>{config?.daysBeforeSuspend}</strong> {tManagerUi('days_of_non_payment_past_due_date')}
        </p>
      </div>

      {/* Suspended Students Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 fin-border-bottom">
          <div className="flex items-center gap-2">
            <Ban size={18} className="fin-text-danger" />
            <span className="fin-text-body font-semibold">{tManagerUi('suspended_students')}</span>
            <span className="mgr-badge mgr-badge--danger text-xs font-mono ml-1">{filtered.length}</span>
          </div>

          {/* Multi-Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search student, smart ID, or seat..."
                className="mgr-input pl-8 text-xs w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
              />
            </div>

            <select
              aria-label="Filter by Shift"
              value={shiftFilter}
              onChange={(e) => {
                setShiftFilter(e.target.value);
                setPage(0);
              }}
              className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
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
              className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Overdue</option>
              <option value="7">&gt; 7 Days</option>
              <option value="14">&gt; 14 Days</option>
              <option value="30">&gt; 30 Days</option>
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset all filters"
              >
                <X size={13} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCsv}
              className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
              title="Export Suspended Students CSV"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

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
  );
}
