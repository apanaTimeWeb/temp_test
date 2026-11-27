'use client';

import { AdminFinanceAutoSuspendKioskModal } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendKioskModal';
import { AdminFinanceAutoSuspendKpiGrid } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendKpiGrid';
import { AdminFinanceAutoSuspendTable } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendTable';
import { AdminFinanceAutoSuspendWhatsAppModal } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendWhatsAppModal';
import {
  ADMIN_FINANCE_DEFAULT_AUTO_SUSPEND_CONFIG,
  ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS,
} from '@/app/frontend_admin/admin_finance/finance_auto_suspend/config/admin_finance_auto_suspend.demo_data';
import type {
  AdminFinanceAutoSuspendConfig,
  AdminFinanceAutoSuspendSuspendedStudent,
  SuspendSortField,
} from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import { exportAutoSuspendCsv } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/utils/adminFinanceAutoSuspendExport';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { Ban, Download, Printer, QrCode, RotateCcw, Search, ShieldAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const SHIFT_LABELS: Record<string, string> = {
  Morning: 'Morning',
  Afternoon: 'Afternoon',
  Evening: 'Evening',
  Night: 'Night',
  'Full Day': 'Full Day',
};

export function AdminFinanceAutoSuspendPage() {
  useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const [config, setConfig] = useState<AdminFinanceAutoSuspendConfig>({ ...ADMIN_FINANCE_DEFAULT_AUTO_SUSPEND_CONFIG });
  const [suspended, setSuspended] = useState<AdminFinanceAutoSuspendSuspendedStudent[]>([...ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS]);
  const [selectedWhatsAppStudent, setSelectedWhatsAppStudent] = useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);
  const [remindedStudents, setRemindedStudents] = useState<Record<number, string>>({});
  const [isKioskModalOpen, setIsKioskModalOpen] = useState(false);
  const [kioskInitialStudent, setKioskInitialStudent] = useState<AdminFinanceAutoSuspendSuspendedStudent | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');
  const [sortField, setSortField] = useState<SuspendSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleRestoreStudent = (student: AdminFinanceAutoSuspendSuspendedStudent) => {
    setSuspended((prev) => prev.filter((item) => item.id !== student.id));
    setConfig((prev) => ({
      ...prev,
      currentlySuspended: Math.max(0, prev.currentlySuspended - 1),
      manualRestores: prev.manualRestores + 1,
    }));
    toast.success(`Student ${student.studentName} (${student.smartId}) seat access has been restored and dues cleared!`, {
      id: 'admin-auto-suspend-restore',
    });
  };

  const handleWhatsAppSentSuccess = (studentId: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRemindedStudents((prev) => ({ ...prev, [studentId]: timeStr }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    toast.success('Suspension policy report sent to printer / PDF', { id: 'admin-auto-suspend-print' });
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minDays = overdueFilter === 'all' ? 0 : Number(overdueFilter);
    return suspended.filter((s) => {
      const matchBranch = isAllBranches || !selectedBranch || !s.branch || s.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchShift = shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
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

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || shiftFilter !== 'all' || overdueFilter !== 'all');

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

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Auto-Suspend &amp; Defaulters
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-bg text-danger-text border border-danger">
              <span className="w-2 h-2 rounded-full bg-danger-text motion-safe:animate-pulse" />
              Active Turnstile Lock &amp; Fee Enforcement
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
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
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-on-primary shadow-card motion-safe:transition-colors cursor-pointer flex-1 sm:flex-initial"
            title="Simulate Entrance Gate Turnstile QR Kiosk Scanner"
          >
            <QrCode size={14} aria-hidden="true" />
            <span>Test Gate QR Kiosk</span>
          </button>
          <button
            type="button"
            onClick={() => exportAutoSuspendCsv(sortedRows)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-border-focus text-text-secondary hover:text-text-primary border border-border shadow-card cursor-pointer motion-safe:transition-colors flex-1 sm:flex-initial"
            title="Export Suspended Students CSV"
          >
            <Download size={14} className="text-text-secondary" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-border-focus text-text-secondary hover:text-text-primary border border-border shadow-card cursor-pointer motion-safe:transition-colors flex-1 sm:flex-initial"
            title="Print Policy Report"
          >
            <Printer size={14} className="text-text-secondary" aria-hidden="true" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <AdminFinanceAutoSuspendKpiGrid config={config} />

      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary-subtle text-primary border border-border-focus shrink-0">
            <ShieldAlert size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-primary">Turnstile Automation &amp; Auto-Suspend Rules</h3>
              <span className="text-[11px] font-semibold text-success-text bg-success-bg px-2 py-0.5 rounded-full border border-success">
                Cloud Sync Active
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Students are automatically suspended after <strong className="text-text-primary font-bold">{config.daysBeforeSuspend} days</strong> of non-payment past the subscription renewal due date. Turnstile gate turnstiles block Smart Card and QR code access until payments are cleared or an admin override is recorded.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-text-secondary">
            Grace Period: <strong className="text-text-primary font-bold">{config.daysBeforeSuspend} Days</strong>
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Ban size={18} className="text-danger-text" aria-hidden="true" />
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Suspended Students &amp; Defaulters List</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-bg text-danger-text border border-danger">
                <span className="w-1.5 h-1.5 rounded-full bg-danger-text" />
                {filtered.length} Defaulters
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Active student accounts currently blocked due to overdue fee payment across all branches.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true" />
            <input
              maxLength={100}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Search student, Smart ID, phone, seat..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>

          <select
            aria-label="Filter by shift"
            value={shiftFilter}
            onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl text-xs border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Full Day">Full Day</option>
          </select>

          <select
            aria-label="Filter by overdue days"
            value={overdueFilter}
            onChange={(e) => { setOverdueFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl text-xs border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Overdue Records</option>
            <option value="7">7+ Days Overdue</option>
            <option value="14">14+ Days Overdue</option>
            <option value="21">21+ Days Overdue</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-danger-text bg-danger-bg border border-danger cursor-pointer motion-safe:transition-opacity hover:opacity-90"
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

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
          onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
          onPrevPage={() => setPage((p) => Math.max(0, p - 1))}
          onNextPage={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          onSendReminder={setSelectedWhatsAppStudent}
          onRestoreStudent={handleRestoreStudent}
          onTestKioskScan={(student) => { setKioskInitialStudent(student); setIsKioskModalOpen(true); }}
          remindedStudents={remindedStudents}
          shiftLabels={SHIFT_LABELS}
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

      <AdminFinanceAutoSuspendWhatsAppModal
        isOpen={Boolean(selectedWhatsAppStudent)}
        student={selectedWhatsAppStudent}
        onClose={() => setSelectedWhatsAppStudent(null)}
        onSentSuccess={handleWhatsAppSentSuccess}
      />

      <AdminFinanceAutoSuspendKioskModal
        isOpen={isKioskModalOpen}
        onClose={() => setIsKioskModalOpen(false)}
        suspendedStudents={suspended}
        initialStudent={kioskInitialStudent}
      />
    </div>
  );
}
