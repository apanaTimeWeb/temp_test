'use client';

import { AdminFinanceSecurityDepositsDeductionModal } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsDeductionModal';
import { AdminFinanceSecurityDepositsKpis } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsKpis';
import { AdminFinanceSecurityDepositsRefundModal } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsRefundModal';
import { AdminFinanceSecurityDepositsTable } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsTable';
import { AdminFinanceSecurityDepositsTimeHorizonBar } from '@/app/frontend_admin/admin_finance/finance_security_deposits/components/AdminFinanceSecurityDepositsTimeHorizonBar';
import { ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS } from '@/app/frontend_admin/admin_finance/finance_security_deposits/config/admin_finance_security_deposits.demo_data';
import type {
  AdminDepositsTimeHorizon,
  AdminFinanceSecurityDeposit,
  DepositSortField,
  SecurityDepositStatus,
} from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import {
  exportSecurityDepositsCsv,
  filterAndSortSecurityDeposits,
  filterDepositsByTimeHorizon,
  getTimeHorizonLabel,
} from '@/app/frontend_admin/admin_finance/finance_security_deposits/utils/adminFinanceSecurityDepositsExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { Download, Printer, RotateCcw, Search, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function AdminFinanceSecurityDepositsPage() {
  useTranslations('ADMIN_FINANCE_SECURITY_DEPOSITS');
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const [depositsList, setDepositsList] = useState<AdminFinanceSecurityDeposit[]>([...ADMIN_FINANCE_DEMO_SECURITY_DEPOSITS]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SecurityDepositStatus>('all');
  const [timeHorizon, setTimeHorizon] = useState<AdminDepositsTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<DepositSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [refundTarget, setRefundTarget] = useState<AdminFinanceSecurityDeposit | null>(null);
  const [refundMode, setRefundMode] = useState<'cash' | 'upi' | 'bank'>('upi');
  const [refundRef, setRefundRef] = useState('');
  const [deductionTarget, setDeductionTarget] = useState<AdminFinanceSecurityDeposit | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('150');
  const [deductionReason, setDeductionReason] = useState('Locker Key Lost');

  const timeFilteredDeposits = useMemo(
    () => filterDepositsByTimeHorizon(depositsList, timeHorizon, customStartDate, customEndDate),
    [depositsList, timeHorizon, customStartDate, customEndDate]
  );
  const timeHorizonLabel = useMemo(
    () => getTimeHorizonLabel(timeHorizon, customStartDate, customEndDate),
    [timeHorizon, customStartDate, customEndDate]
  );
  const { filtered, sortedRows } = useMemo(
    () => filterAndSortSecurityDeposits(timeFilteredDeposits, { isAllBranches, selectedBranch, statusFilter, searchQuery, sortField, sortDirection }),
    [timeFilteredDeposits, isAllBranches, selectedBranch, statusFilter, searchQuery, sortField, sortDirection]
  );

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || statusFilter !== 'all' || timeHorizon !== 'all');
  const resetFilters = () => {
    setSearchQuery(''); setStatusFilter('all'); setTimeHorizon('all');
    setCustomStartDate(''); setCustomEndDate(''); setPage(0);
  };
  const toggleSort = (field: DepositSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    const netRefund = Math.max(0, refundTarget.depositAmount - (refundTarget.deductionAmount || 0));
    setDepositsList((prev) => prev.map((item) => item.id === refundTarget.id ? { ...item, status: 'refunded', refundedDate: new Date().toISOString().slice(0, 10) } : item));
    toast.success(`Exit clearance complete! Refund of ₹${netRefund.toLocaleString('en-IN')} disbursed for ${refundTarget.studentName} via ${refundMode.toUpperCase()}.`, { id: 'security-deposit-refund-complete' });
    setRefundTarget(null);
    setRefundRef('');
  };

  const handleConfirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductionTarget) return;
    const amt = Number(deductionAmount) || 0;
    setDepositsList((prev) => prev.map((item) => item.id === deductionTarget.id ? { ...item, deductionAmount: (item.deductionAmount || 0) + amt, deductionReason: deductionReason.trim() || 'Penalty' } : item));
    toast.success(`Deduction of ₹${amt.toLocaleString('en-IN')} applied to ${deductionTarget.studentName} (${deductionReason}).`, { id: 'security-deposit-deduction-applied' });
    setDeductionTarget(null);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    toast.success('Security deposits ledger sent to printer / PDF', { id: 'security-deposits-print' });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">Security Deposits Ledger</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-bg text-success-text border border-success">
              <span className="w-2 h-2 rounded-full bg-success motion-safe:animate-pulse" />
              Active Escrow Vault
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Monitor caution money balances, process exit clearances, and track damage penalty deductions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button type="button" onClick={() => exportSecurityDepositsCsv(sortedRows)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-border-focus text-text-secondary hover:text-text-primary border border-border shadow-card cursor-pointer motion-safe:transition-all motion-safe:active:scale-95 flex-1 sm:flex-initial" title="Export Deposits Ledger CSV">
            <Download size={14} className="text-text-secondary" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button type="button" onClick={handlePrint} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-border-focus text-text-secondary hover:text-text-primary border border-border shadow-card cursor-pointer motion-safe:transition-all motion-safe:active:scale-95 flex-1 sm:flex-initial" title="Print Policy Report">
            <Printer size={14} className="text-text-secondary" aria-hidden="true" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <AdminFinanceSecurityDepositsTimeHorizonBar timeHorizon={timeHorizon} onChangeTimeHorizon={(h) => { setTimeHorizon(h); setPage(0); }} customStartDate={customStartDate} onCustomStartDateChange={setCustomStartDate} customEndDate={customEndDate} onCustomEndDateChange={setCustomEndDate} activeCount={filtered.length} />

      <AdminFinanceSecurityDepositsKpis deposits={timeFilteredDeposits} timeHorizonLabel={timeHorizonLabel} />

      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <ShieldCheck size={18} className="text-primary" aria-hidden="true" />
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Student Caution Money Records</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-subtle text-primary border border-border-focus">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {filtered.length} Deposits Found
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">Active student caution money held in library escrow across all branches.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true" />
            <input maxLength={100} type="text" aria-label="Search security deposits" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} placeholder="Search student, Smart ID, phone, seat..." className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {searchQuery && (
              <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>

          <select aria-label="Filter deposit status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as 'all' | SecurityDepositStatus); setPage(0); }} className="px-3 py-2 rounded-xl text-xs border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="held">Held in Escrow</option>
            <option value="refunded">Refunded (Disbursed)</option>
            <option value="forfeited">Forfeited</option>
          </select>

          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-danger-text bg-danger-bg hover:opacity-90 border border-danger cursor-pointer motion-safe:transition-opacity">
              <RotateCcw size={12} aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <AdminFinanceSecurityDepositsTable
          filtered={filtered}
          paginated={paginated}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onOpenRefund={(d) => { setRefundTarget(d); setRefundRef(''); }}
          onOpenDeduct={(d) => { setDeductionTarget(d); setDeductionAmount('150'); setDeductionReason('Locker Key Lost'); }}
          startItem={startItem}
          endItem={endItem}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
          effectivePage={effectivePage}
          pageCount={pageCount}
          onPrevPage={() => setPage((p) => Math.max(0, p - 1))}
          onNextPage={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          labels={{ student: 'Student Details', seatBranch: 'Seat & Branch', deposit: 'Deposit Amount', status: 'Status', collectedBy: 'Collected By', collectedDate: 'Collected Date', deduction: 'Deductions', refundedDate: 'Refund Date / Net', actions: 'Actions', noDeposits: 'No security deposit records found matching filters.' }}
        />
      </div>

      <AdminFinanceSecurityDepositsRefundModal refundTarget={refundTarget} onClose={() => setRefundTarget(null)} refundMode={refundMode} onRefundModeChange={setRefundMode} refundRef={refundRef} onRefundRefChange={setRefundRef} onConfirmRefund={handleConfirmRefund} />
      <AdminFinanceSecurityDepositsDeductionModal deductionTarget={deductionTarget} onClose={() => setDeductionTarget(null)} deductionReason={deductionReason} onDeductionReasonChange={setDeductionReason} deductionAmount={deductionAmount} onDeductionAmountChange={setDeductionAmount} onConfirmDeduction={handleConfirmDeduction} />
    </div>
  );
}
export default AdminFinanceSecurityDepositsPage;
