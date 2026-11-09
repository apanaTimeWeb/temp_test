'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useManagerSecurityDepositsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/useManagerFinanceSecurityDepositsUrlFilters';
import { useManagerSecurityDepositsFormatting } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsFormattingHook';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { MANAGER_FINANCE_SAMPLE_DEPOSITS } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import type { ManagerFinanceSecurityDepositsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsComponentTypes';
import ManagerFinanceSecurityDepositsRefundModal from './ManagerFinanceSecurityDepositsRefundModal';
import ManagerFinanceSecurityDepositsDeductionModal from './ManagerFinanceSecurityDepositsDeductionModal';
import ManagerFinanceSecurityDepositsTable from './ManagerFinanceSecurityDepositsTable';
import ManagerFinanceSecurityDepositsTimeHorizonBar, { type ManagerDepositsTimeHorizon } from './ManagerFinanceSecurityDepositsTimeHorizonBar';
import ManagerFinanceSecurityDepositsKpis from './ManagerFinanceSecurityDepositsKpis';

const URL_FILTERS = { status: { defaultValue: 'all', allowedValues: ['all', 'held', 'refunded', 'forfeited'] } as const };
type DepositSortField = 'studentName' | 'depositAmount' | 'status' | 'collectedBy' | 'collectedDate' | 'deductionAmount' | 'refundedDate';

export default function ManagerFinanceSecurityDepositsPage(_routeQuery: ManagerFinanceSecurityDepositsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_security_deposits.ui');
  const { formatCurrency } = useManagerSecurityDepositsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerSecurityDepositsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status;

  const [depositsList, setDepositsList] = useState<ManagerFinanceSecurityDepositsSampleDeposit[]>(MANAGER_FINANCE_SAMPLE_DEPOSITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeHorizon, setTimeHorizon] = useState<ManagerDepositsTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<DepositSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [refundTarget, setRefundTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [refundMode, setRefundMode] = useState<'cash' | 'upi'>('upi');
  const [refundRef, setRefundRef] = useState('');
  const [deductionTarget, setDeductionTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('150');
  const [deductionReason, setDeductionReason] = useState('Locker Key Lost');

  const toggleSort = (field: DepositSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else { setSortField(null); setSortDirection('asc'); }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const timeFilteredDeposits = useMemo(() => {
    if (timeHorizon === 'all') return depositsList;
    const now = new Date();
    return depositsList.filter((d) => {
      const recDate = new Date(d.collectedDate);
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
  }, [depositsList, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Time';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFilteredDeposits.filter((d) => {
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchSearch = !q || d.studentName.toLowerCase().includes(q) || d.smartId.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [timeFilteredDeposits, statusFilter, searchQuery]);

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

  const renderSortableHeader = (field: DepositSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`py-3 px-4 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" /> : <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
          ) : (
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const confirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    setDepositsList((prev) => prev.map((item) => item.id === refundTarget.id ? { ...item, status: 'refunded', refundedDate: new Date().toISOString().slice(0, 10) } : item));
    const netRefund = refundTarget.depositAmount - (refundTarget.deductionAmount || 0);
    setToastMessage(`Refund of ₹${netRefund} processed for ${refundTarget.studentName} via ${refundMode.toUpperCase()}!`);
    setRefundTarget(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const confirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductionTarget) return;
    const amt = Number(deductionAmount) || 0;
    setDepositsList((prev) => prev.map((item) => item.id === deductionTarget.id ? { ...item, deductionAmount: (item.deductionAmount || 0) + amt, deductionReason: deductionReason.trim() || 'Penalty' } : item));
    setToastMessage(`Deduction of ₹${amt} logged for ${deductionTarget.studentName} (${deductionReason})!`);
    setDeductionTarget(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('security_deposits')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_student_security_deposit_records')}</p>
      </div>

      <ManagerFinanceSecurityDepositsTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      <ManagerFinanceSecurityDepositsKpis deposits={timeFilteredDeposits} timeHorizonLabel={timeHorizonLabel} />

      <div className="p-3 rounded-xl bg-muted border border-border text-xs text-secondary flex items-center justify-between" role="status">
        <span>Sample security deposit records loaded for preview under active contract.</span>
        <button type="button" disabled className="mgr-btn-outline text-xs opacity-50 cursor-not-allowed">Export Unavailable</button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student or Smart ID..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          />
        </div>
        <select
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer min-w-[130px]"
          value={statusFilter}
          onChange={(e) => { setUrlFilter('status', e.target.value); setPage(0); }}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="held">{tManagerUi('held')}</option>
          <option value="refunded">{tManagerUi('refunded')}</option>
          <option value="forfeited">{tManagerUi('forfeited')}</option>
        </select>
        {(statusFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setUrlFilter('status', 'all');
              setPage(0);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
          >
            <X size={12} /> Reset
          </button>
        )}
      </div>

      <ManagerFinanceSecurityDepositsTable
        filtered={filtered}
        paginated={paginated}
        formatCurrency={formatCurrency}
        renderSortableHeader={renderSortableHeader}
        onOpenRefund={(d) => setRefundTarget(d)}
        onOpenDeduct={(d) => { setDeductionTarget(d); setDeductionAmount('150'); setDeductionReason('Locker Key Lost'); }}
        startItem={startItem}
        endItem={endItem}
        totalRows={totalRows}
        effectivePage={effectivePage}
        pageCount={pageCount}
        onPrevPage={() => setPage(effectivePage - 1)}
        onNextPage={() => setPage(effectivePage + 1)}
        labels={{
          student: tManagerUi('student'),
          depositInr: tManagerUi('deposit_inr'),
          status: tManagerUi('status'),
          collectedBy: tManagerUi('collected_by'),
          collectedDate: tManagerUi('collected_date'),
          deductionInr: tManagerUi('deduction_inr'),
          deductionReason: tManagerUi('deduction_reason'),
          refundedDate: tManagerUi('refunded_date'),
          actions: tManagerUi('actions'),
          noDeposits: tManagerUi('no_security_deposits_found'),
        }}
        translateStatus={(s) => tManagerUi(s)}
      />

      <ManagerFinanceSecurityDepositsRefundModal
        refundTarget={refundTarget}
        onClose={() => setRefundTarget(null)}
        refundMode={refundMode}
        onRefundModeChange={setRefundMode}
        refundRef={refundRef}
        onRefundRefChange={setRefundRef}
        onConfirmRefund={confirmRefund}
      />

      <ManagerFinanceSecurityDepositsDeductionModal
        deductionTarget={deductionTarget}
        onClose={() => setDeductionTarget(null)}
        deductionReason={deductionReason}
        onDeductionReasonChange={setDeductionReason}
        deductionAmount={deductionAmount}
        onDeductionAmountChange={setDeductionAmount}
        onConfirmDeduction={confirmDeduction}
      />
    </div>
  );
}
