'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Settings,
  Ban,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Search,
  X,
  Download,
  Printer,
  QrCode,
  Building,
} from 'lucide-react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import {
  ADMIN_FINANCE_DEFAULT_AUTO_SUSPEND_CONFIG,
  ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS,
} from '../mocks/AdminFinanceAutoSuspendDemoFixtures';
import type {
  AdminFinanceAutoSuspendConfig,
  AdminFinanceAutoSuspendSuspendedStudent,
  SuspendSortField,
} from '../types/AdminFinanceAutoSuspendTypes';
import { AdminFinanceAutoSuspendTable } from './AdminFinanceAutoSuspendTable';
import { AdminFinanceAutoSuspendWhatsAppModal } from './AdminFinanceAutoSuspendWhatsAppModal';
import { AdminFinanceAutoSuspendKioskModal } from './AdminFinanceAutoSuspendKioskModal';

export function AdminFinanceAutoSuspendPage() {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const [config, setConfig] = useState<AdminFinanceAutoSuspendConfig>({
    ...ADMIN_FINANCE_DEFAULT_AUTO_SUSPEND_CONFIG,
  });
  const [suspended, setSuspended] = useState<AdminFinanceAutoSuspendSuspendedStudent[]>([
    ...ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS,
  ]);
  const [selectedWhatsAppStudent, setSelectedWhatsAppStudent] =
    useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);
  const [remindedStudents, setRemindedStudents] = useState<Record<number, string>>({});
  const [isKioskModalOpen, setIsKioskModalOpen] = useState(false);
  const [kioskInitialStudent, setKioskInitialStudent] =
    useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<SuspendSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Restore action
  const handleRestoreStudent = (student: AdminFinanceAutoSuspendSuspendedStudent) => {
    setSuspended((prev) => prev.filter((item) => item.id !== student.id));
    setConfig((prev) => ({
      ...prev,
      currentlySuspended: Math.max(0, prev.currentlySuspended - 1),
      manualRestores: prev.manualRestores + 1,
    }));
    toast.success(
      `Student ${student.studentName} (${student.smartId}) seat access has been restored and dues cleared!`
    );
  };

  const handleOpenWhatsAppReminder = (student: AdminFinanceAutoSuspendSuspendedStudent) => {
    setSelectedWhatsAppStudent(student);
  };

  const handleWhatsAppSentSuccess = (studentId: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRemindedStudents((prev) => ({ ...prev, [studentId]: timeStr }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    toast.success('Suspension policy report sent to printer / PDF');
  };

  const shiftLabels: Record<string, string> = {
    Morning: 'Morning',
    Afternoon: 'Afternoon',
    Evening: 'Evening',
    Night: 'Night',
    'Full Day': 'Full Day',
  };

  // Filtered List
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minDays = overdueFilter === 'all' ? 0 : Number(overdueFilter);
    return suspended.filter((s) => {
      const matchBranch =
        isAllBranches ||
        !selectedBranch ||
        !s.branch ||
        s.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchShift =
        shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
      const matchOverdue = s.daysOverdue >= minDays;
      const matchSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.smartId.toLowerCase().includes(q) ||
        s.seat.toLowerCase().includes(q) ||
        s.shift.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.branch && s.branch.toLowerCase().includes(q));
      return matchBranch && matchShift && matchOverdue && matchSearch;
    });
  }, [suspended, searchQuery, shiftFilter, overdueFilter, isAllBranches, selectedBranch]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || shiftFilter !== 'all' || overdueFilter !== 'all'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setShiftFilter('all');
    setOverdueFilter('all');
    setPage(0);
  };

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
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(
    effectivePage * pageSize,
    (effectivePage + 1) * pageSize
  );
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const escapeCsv = (v: unknown) => {
    const s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s)
      ? `'"${s.replace(/"/g, '""')}"`
      : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Student Name',
      'Smart ID',
      'Seat',
      'Shift',
      'Branch',
      'Pending Dues (INR)',
      'Days Overdue',
      'Suspended Since',
      'Phone',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = sortedRows
      .map((s) =>
        [
          s.studentName,
          s.smartId,
          s.seat,
          s.shift,
          s.branch,
          s.duesAmount,
          s.daysOverdue,
          s.suspendedSince,
          s.phone || '',
        ]
          .map(escapeCsv)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: `defaulters_auto_suspended_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Suspended defaulters list exported to CSV successfully');
  };

  const KPI_CARDS = [
    {
      label: 'Days Before Suspend',
      value: `${config.daysBeforeSuspend} Days`,
      icon: Settings,
      chip: 'Policy Threshold',
      chipCls: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      iconCls: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
      cardBg:
        'border-sky-500/30 bg-gradient-to-br from-sky-950/70 via-card to-sky-900/40 shadow-xs hover:border-sky-400/50',
      stroke: '#38bdf8',
      valColor: 'text-primary',
    },
    {
      label: 'Currently Suspended',
      value: `${config.currentlySuspended} Students`,
      icon: Ban,
      chip: 'Active Suspensions',
      chipCls: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      iconCls: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
      cardBg:
        'border-rose-500/30 bg-gradient-to-br from-rose-950/70 via-card to-rose-900/40 shadow-xs hover:border-rose-400/50',
      stroke: '#f87171',
      valColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      label: 'Auto-Restored (Month)',
      value: `${config.autoRestoredThisMonth} Restored`,
      icon: RotateCcw,
      chip: 'Auto-Settled',
      chipCls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      iconCls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      cardBg:
        'border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-card to-emerald-900/40 shadow-xs hover:border-emerald-400/50',
      stroke: '#34d399',
      valColor: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Manual Overrides',
      value: `${config.manualRestores} Overrides`,
      icon: UserCheck,
      chip: 'Admin Action',
      chipCls: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      iconCls: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
      cardBg:
        'border-purple-500/30 bg-gradient-to-br from-purple-950/70 via-card to-purple-900/40 shadow-xs hover:border-purple-400/50',
      stroke: '#c084fc',
      valColor: 'text-purple-500 dark:text-purple-400',
    },
  ] as const;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Modern Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
              Auto-Suspend & Defaulters
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Active Turnstile Lock & Fee Enforcement
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Track fee overdue accounts, inspect automated turnstile barrier locks, and dispatch WhatsApp reminders.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            data-testid="open-gate-kiosk-simulator-btn"
            onClick={() => {
              setKioskInitialStudent(suspended[0] || null);
              setIsKioskModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
            title="Simulate Entrance Gate Turnstile QR Kiosk Scanner"
          >
            <QrCode size={14} />
            <span>Test Gate QR Kiosk</span>
          </button>
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
        {KPI_CARDS.map(
          ({
            label,
            value,
            icon: Icon,
            chip,
            chipCls,
            iconCls,
            cardBg,
            stroke,
            valColor,
          }) => (
            <div
              key={label}
              className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg flex flex-col justify-between ${cardBg}`}
            >
              <svg
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
                viewBox="0 0 150 45"
              >
                <path
                  d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 shadow-xs ${iconCls}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${chipCls}`}
                  >
                    {chip}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valColor}`}>
                    {value}
                  </h3>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Policy Configuration Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-primary">
                Turnstile Automation & Auto-Suspend Rules
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Cloud Sync Active
              </span>
            </div>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              Students are automatically suspended after{' '}
              <strong className="text-primary font-bold">{config.daysBeforeSuspend} days</strong> of
              non-payment past the subscription renewal due date. Turnstile gate turnstiles block Smart Card and QR code access until payments are cleared or an admin override is recorded.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-secondary">
            Grace Period: <strong className="text-primary font-bold">{config.daysBeforeSuspend} Days</strong>
          </span>
        </div>
      </div>

      {/* Defaulters Table Section */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        {/* Table Title and Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Ban size={18} className="text-rose-600" />
              <h2 className="text-xl font-bold text-primary tracking-tight">
                Suspended Students & Defaulters List
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {filtered.length} Defaulters
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Active student accounts currently blocked due to overdue fee payment across all branches.
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search student, Smart ID, phone, seat..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Shift Filter Dropdown */}
          <select
            value={shiftFilter}
            onChange={(e) => {
              setShiftFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl text-xs border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Full Day">Full Day</option>
          </select>

          {/* Overdue Days Filter */}
          <select
            value={overdueFilter}
            onChange={(e) => {
              setOverdueFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl text-xs border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Overdue Records</option>
            <option value="7">7+ Days Overdue</option>
            <option value="14">14+ Days Overdue</option>
            <option value="21">21+ Days Overdue</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Table Component */}
        <AdminFinanceAutoSuspendTable
          filtered={filtered}
          paginated={paginated}
          totalRows={totalRows}
          startItem={startItem}
          endItem={endItem}
          pageSize={pageSize}
          effectivePage={effectivePage}
          pageCount={pageCount}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          onPrevPage={() => setPage((p) => Math.max(0, p - 1))}
          onNextPage={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          onSendReminder={handleOpenWhatsAppReminder}
          onRestoreStudent={handleRestoreStudent}
          onTestKioskScan={(student) => {
            setKioskInitialStudent(student);
            setIsKioskModalOpen(true);
          }}
          remindedStudents={remindedStudents}
          shiftLabels={shiftLabels}
          labels={{
            student: 'Student Details',
            seat: 'Seat & Shift',
            shift: 'Shift',
            branch: 'Branch',
            dues: 'Pending Dues',
            daysOverdue: 'Overdue Duration',
            suspendedSince: 'Suspended Since',
            actions: 'Actions',
            noStudents: 'No suspended students found matching filters.',
          }}
        />
      </div>

      {/* WhatsApp Modal */}
      <AdminFinanceAutoSuspendWhatsAppModal
        isOpen={Boolean(selectedWhatsAppStudent)}
        student={selectedWhatsAppStudent}
        onClose={() => setSelectedWhatsAppStudent(null)}
        onSentSuccess={handleWhatsAppSentSuccess}
      />

      {/* Gate Turnstile Kiosk Simulator Modal */}
      <AdminFinanceAutoSuspendKioskModal
        isOpen={isKioskModalOpen}
        onClose={() => setIsKioskModalOpen(false)}
        suspendedStudents={suspended}
        initialStudent={kioskInitialStudent}
      />
    </div>
  );
}
