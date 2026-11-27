'use client';

import ManagerFinanceSecurityDepositsDeductionModal from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsDeductionModal';
import ManagerFinanceSecurityDepositsHeader from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsHeader';
import { ManagerFinanceSecurityDepositsKpis } from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsKpis';
import ManagerFinanceSecurityDepositsRefundModal from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsRefundModal';
import ManagerFinanceSecurityDepositsTable from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsTable';
import ManagerFinanceSecurityDepositsTimeHorizonBar, {
  type ManagerDepositsTimeHorizon,
} from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsTimeHorizonBar';
import {
  MANAGER_FINANCE_SAMPLE_DEPOSITS,
  type ManagerFinanceSecurityDepositsSampleDeposit,
} from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { useManagerSecurityDepositsFormatting } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsFormattingHook';
import { useManagerSecurityDepositsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/useManagerFinanceSecurityDepositsUrlFilters';
import type { ManagerFinanceSecurityDepositsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsComponentTypes';
import {
  exportSecurityDepositsCsv,
  formatDepositInr,
} from '@/app/frontend_manager/manager_finance/finance_security_deposits/utils/ManagerFinanceSecurityDepositsHelpers';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

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
  const pageSize = 10;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<DepositSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [refundTarget, setRefundTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [refundMode, setRefundMode] = useState<'cash' | 'upi'>('upi');
  const [refundRef, setRefundRef] = useState('');
  const [deductionTarget, setDeductionTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('150');
  const [deductionReason, setDeductionReason] = useState('Locker Key Lost');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
      if (timeHorizon === 'this_week') { const diff = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24); return diff >= 0 && diff <= 7; }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
      }
      return true;
    });
  }, [depositsList, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    if (timeHorizon === 'today') return 'Today';
    if (timeHorizon === 'this_week') return 'This Week';
    if (timeHorizon === 'this_month') return 'This Month';
    if (timeHorizon === 'custom') return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
    return 'All Time';
  }, [timeHorizon, customStartDate, customEndDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return timeFilteredDeposits.filter((d) => (statusFilter === 'all' || d.status === statusFilter) && (!q || d.studentName.toLowerCase().includes(q) || d.smartId.toLowerCase().includes(q)));
  }, [timeFilteredDeposits, statusFilter, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" aria-hidden="true" />
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
    showToast(`Refund of ${formatDepositInr(netRefund)} processed for ${refundTarget.studentName} via ${refundMode.toUpperCase()}!`);
    setRefundTarget(null);
  };

  const confirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductionTarget) return;
    const amt = Number(deductionAmount) || 0;
    setDepositsList((prev) => prev.map((item) => item.id === deductionTarget.id ? { ...item, deductionAmount: (item.deductionAmount || 0) + amt, deductionReason: deductionReason.trim() || 'Penalty' } : item));
    showToast(`Deduction of ${formatDepositInr(amt)} logged for ${deductionTarget.studentName} (${deductionReason})!`);
    setDeductionTarget(null);
  };

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <ManagerFinanceSecurityDepositsHeader
        title={tManagerUi('security_deposits')}
        subtitle={tManagerUi('review_student_security_deposit_records')}
        onExportCsv={() => { exportSecurityDepositsCsv(filtered); showToast(`Exported ${filtered.length} deposit records to CSV.`); }}
        onPrint={() => { if (typeof window !== 'undefined') window.print(); showToast('Security deposits summary report sent to printer / PDF.'); }}
      />

      <ManagerFinanceSecurityDepositsTimeHorizonBar timeHorizon={timeHorizon} onChangeTimeHorizon={setTimeHorizon} customStartDate={customStartDate} onCustomStartDateChange={setCustomStartDate} customEndDate={customEndDate} onCustomEndDateChange={setCustomEndDate} activeCount={filtered.length} />
      <ManagerFinanceSecurityDepositsKpis deposits={timeFilteredDeposits} timeHorizonLabel={timeHorizonLabel} />

      <div className="hidden" role="status">
        <span>Sample security deposit records loaded for preview under active contract.</span>
        <button type="button" disabled className="mgr-btn-outline text-xs opacity-50 cursor-not-allowed">Export Unavailable</button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input maxLength={30} id="security-deposits-search-input" name="searchQuery" type="search" placeholder="Search student or Smart ID..." aria-label="Search student or Smart ID" className="mgr-input !pl-10 !pr-9 text-xs w-full focus-visible:ring-2 focus-visible:ring-primary outline-none" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} />
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); setPage(0); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded-full hover:bg-surface-hover motion-safe:transition-colors" title="Clear search" aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <select id="security-deposits-status-filter" name="statusFilter" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none" value={statusFilter} onChange={(e) => { setUrlFilter('status', e.target.value); setPage(0); }} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="held">{tManagerUi('held')}</option>
          <option value="refunded">{tManagerUi('refunded')}</option>
          <option value="forfeited">{tManagerUi('forfeited')}</option>
        </select>
        {(statusFilter !== 'all' || searchQuery.trim() !== '') && (
          <button type="button" onClick={() => { setSearchQuery(''); setUrlFilter('status', 'all'); setPage(0); }} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer focus-visible:ring-2 focus-visible:ring-primary shadow-xs outline-none motion-safe:transition-colors">
            <X size={13} /> Reset Filters
          </button>
        )}
      </div>

      <ManagerFinanceSecurityDepositsTable
        filtered={filtered} paginated={paginated} formatCurrency={formatCurrency} renderSortableHeader={renderSortableHeader}
        onOpenRefund={(d) => setRefundTarget(d)} onOpenDeduct={(d) => { setDeductionTarget(d); setDeductionAmount('150'); setDeductionReason('Locker Key Lost'); }}
        startItem={totalRows === 0 ? 0 : effectivePage * pageSize + 1} endItem={Math.min((effectivePage + 1) * pageSize, totalRows)} totalRows={totalRows}
        effectivePage={effectivePage} pageCount={pageCount} onPrevPage={() => setPage(effectivePage - 1)} onNextPage={() => setPage(effectivePage + 1)}
        labels={{ student: tManagerUi('student'), depositInr: tManagerUi('deposit_inr'), status: tManagerUi('status'), collectedBy: tManagerUi('collected_by'), collectedDate: tManagerUi('collected_date'), deductionInr: tManagerUi('deduction_inr'), deductionReason: tManagerUi('deduction_reason'), refundedDate: tManagerUi('refunded_date'), actions: tManagerUi('actions'), noDeposits: tManagerUi('no_security_deposits_found') }}
        translateStatus={(s) => tManagerUi(s)}
      />

      <ManagerFinanceSecurityDepositsRefundModal refundTarget={refundTarget} onClose={() => setRefundTarget(null)} refundMode={refundMode} onRefundModeChange={setRefundMode} refundRef={refundRef} onRefundRefChange={setRefundRef} onConfirmRefund={confirmRefund} />
      <ManagerFinanceSecurityDepositsDeductionModal deductionTarget={deductionTarget} onClose={() => setDeductionTarget(null)} deductionReason={deductionReason} onDeductionReasonChange={setDeductionReason} deductionAmount={deductionAmount} onDeductionAmountChange={setDeductionAmount} onConfirmDeduction={confirmDeduction} />
    </div>
  );
}
