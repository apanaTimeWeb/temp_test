'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Search,
  X,
  Download,
  Printer,
  RotateCcw,
  Building,
  Lock,
} from 'lucide-react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS } from '../mocks/AdminFinanceSecurityDepositsDemoFixtures';
import type {
  AdminFinanceSecurityDeposit,
  DepositSortField,
  AdminDepositsTimeHorizon,
  SecurityDepositStatus,
} from '../types/AdminFinanceSecurityDepositsTypes';
import { AdminFinanceSecurityDepositsTimeHorizonBar } from './AdminFinanceSecurityDepositsTimeHorizonBar';
import { AdminFinanceSecurityDepositsKpis } from './AdminFinanceSecurityDepositsKpis';
import { AdminFinanceSecurityDepositsTable } from './AdminFinanceSecurityDepositsTable';
import { AdminFinanceSecurityDepositsRefundModal } from './AdminFinanceSecurityDepositsRefundModal';
import { AdminFinanceSecurityDepositsDeductionModal } from './AdminFinanceSecurityDepositsDeductionModal';

export function AdminFinanceSecurityDepositsPage() {
  const t = useTranslations('ADMIN_FINANCE_SECURITY_DEPOSITS');
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const [depositsList, setDepositsList] = useState<AdminFinanceSecurityDeposit[]>([
    ...ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS,
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SecurityDepositStatus>('all');
  const [timeHorizon, setTimeHorizon] = useState<AdminDepositsTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<DepositSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal States
  const [refundTarget, setRefundTarget] = useState<AdminFinanceSecurityDeposit | null>(null);
  const [refundMode, setRefundMode] = useState<'cash' | 'upi' | 'bank'>('upi');
  const [refundRef, setRefundRef] = useState('');

  const [deductionTarget, setDeductionTarget] = useState<AdminFinanceSecurityDeposit | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('150');
  const [deductionReason, setDeductionReason] = useState('Locker Key Lost');

  // Time horizon filtering
  const timeFilteredDeposits = useMemo(() => {
    if (timeHorizon === 'all') return depositsList;
    const now = new Date();
    return depositsList.filter((d) => {
      const recDate = new Date(d.collectedDate);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') {
        return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      }
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') {
        return (
          recDate.getFullYear() === now.getFullYear() &&
          recDate.getMonth() === now.getMonth()
        );
      }
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [depositsList, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today':
        return 'Today';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return customStartDate && customEndDate
          ? `${customStartDate} - ${customEndDate}`
          : 'Custom Range';
      default:
        return 'All Time';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  // Combined Search, Status & Branch Filter
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFilteredDeposits.filter((d) => {
      const matchBranch =
        isAllBranches ||
        !selectedBranch ||
        !d.branch ||
        d.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchSearch =
        !q ||
        d.studentName.toLowerCase().includes(q) ||
        d.smartId.toLowerCase().includes(q) ||
        (d.seat && d.seat.toLowerCase().includes(q)) ||
        (d.phone && d.phone.includes(q)) ||
        (d.branch && d.branch.toLowerCase().includes(q));
      return matchBranch && matchStatus && matchSearch;
    });
  }, [timeFilteredDeposits, statusFilter, searchQuery, isAllBranches, selectedBranch]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || statusFilter !== 'all' || timeHorizon !== 'all'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setPage(0);
  };

  const toggleSort = (field: DepositSortField) => {
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

  // Refund Confirmation Handler
  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;

    const netRefund = Math.max(
      0,
      refundTarget.depositAmount - (refundTarget.deductionAmount || 0)
    );

    setDepositsList((prev) =>
      prev.map((item) =>
        item.id === refundTarget.id
          ? {
              ...item,
              status: 'refunded',
              refundedDate: new Date().toISOString().slice(0, 10),
            }
          : item
      )
    );

    toast.success(
      `Exit clearance complete! Refund of ₹${netRefund.toLocaleString('en-IN')} disbursed for ${refundTarget.studentName} via ${refundMode.toUpperCase()}.`
    );
    setRefundTarget(null);
    setRefundRef('');
  };

  // Deduction Confirmation Handler
  const handleConfirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductionTarget) return;

    const amt = Number(deductionAmount) || 0;
    setDepositsList((prev) =>
      prev.map((item) =>
        item.id === deductionTarget.id
          ? {
              ...item,
              deductionAmount: (item.deductionAmount || 0) + amt,
              deductionReason: deductionReason.trim() || 'Penalty',
            }
          : item
      )
    );

    toast.success(
      `Deduction of ₹${amt.toLocaleString('en-IN')} applied to ${deductionTarget.studentName} (${deductionReason}).`
    );
    setDeductionTarget(null);
  };

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
      'Branch',
      'Deposit Amount (INR)',
      'Status',
      'Collected By',
      'Collected Date',
      'Deduction Amount (INR)',
      'Deduction Reason',
      'Refunded Date',
      'Phone',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = sortedRows
      .map((d) =>
        [
          d.studentName,
          d.smartId,
          d.seat || 'N/A',
          d.branch || '',
          d.depositAmount,
          d.status,
          d.collectedBy,
          d.collectedDate,
          d.deductionAmount || 0,
          d.deductionReason || '',
          d.refundedDate || '',
          d.phone || '',
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
      download: `security_deposits_ledger_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Security deposits ledger exported to CSV successfully');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    toast.success('Security deposits ledger sent to printer / PDF');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
              Security Deposits Ledger
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Escrow Vault
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Monitor caution money balances, process exit clearances, and track damage penalty deductions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer transition-all active:scale-95 flex-1 sm:flex-initial"
            title="Export Deposits Ledger CSV"
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

      {/* Time Horizon Bar */}
      <AdminFinanceSecurityDepositsTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={(h) => {
          setTimeHorizon(h);
          setPage(0);
        }}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      {/* KPI Cards Grid */}
      <AdminFinanceSecurityDepositsKpis
        deposits={timeFilteredDeposits}
        timeHorizonLabel={timeHorizonLabel}
      />

      {/* Main Table Card */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        {/* Title and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <ShieldCheck size={18} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-primary tracking-tight">
                Student Caution Money Records
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {filtered.length} Deposits Found
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Active student caution money held in library escrow across all branches.
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

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | SecurityDepositStatus);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl text-xs border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="held">Held in Escrow</option>
            <option value="refunded">Refunded (Disbursed)</option>
            <option value="forfeited">Forfeited</option>
          </select>

          {/* Reset Filters Button */}
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
        <AdminFinanceSecurityDepositsTable
          filtered={filtered}
          paginated={paginated}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onOpenRefund={(d) => {
            setRefundTarget(d);
            setRefundRef('');
          }}
          onOpenDeduct={(d) => {
            setDeductionTarget(d);
            setDeductionAmount('150');
            setDeductionReason('Locker Key Lost');
          }}
          startItem={startItem}
          endItem={endItem}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          effectivePage={effectivePage}
          pageCount={pageCount}
          onPrevPage={() => setPage((p) => Math.max(0, p - 1))}
          onNextPage={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          labels={{
            student: 'Student Details',
            seatBranch: 'Seat & Branch',
            deposit: 'Deposit Amount',
            status: 'Status',
            collectedBy: 'Collected By',
            collectedDate: 'Collected Date',
            deduction: 'Deductions',
            refundedDate: 'Refund Date / Net',
            actions: 'Actions',
            noDeposits: 'No security deposit records found matching filters.',
          }}
        />
      </div>

      {/* Exit Clearance & Refund Modal */}
      <AdminFinanceSecurityDepositsRefundModal
        refundTarget={refundTarget}
        onClose={() => setRefundTarget(null)}
        refundMode={refundMode}
        onRefundModeChange={setRefundMode}
        refundRef={refundRef}
        onRefundRefChange={setRefundRef}
        onConfirmRefund={handleConfirmRefund}
      />

      {/* Add Deduction Modal */}
      <AdminFinanceSecurityDepositsDeductionModal
        deductionTarget={deductionTarget}
        onClose={() => setDeductionTarget(null)}
        deductionReason={deductionReason}
        onDeductionReasonChange={setDeductionReason}
        deductionAmount={deductionAmount}
        onDeductionAmountChange={setDeductionAmount}
        onConfirmDeduction={handleConfirmDeduction}
      />
    </div>
  );
}
