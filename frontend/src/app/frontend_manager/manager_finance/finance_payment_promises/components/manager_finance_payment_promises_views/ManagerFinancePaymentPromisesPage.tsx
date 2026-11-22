'use client';

import { useManagerPaymentPromisesFormatting } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesFormattingHook';
import { useManagerFinancePaymentPromisesConfirm } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/useManagerFinancePaymentPromisesConfirm';
import { MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES,type ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import type { ManagerFinancePaymentPromisesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';
import { sanitizeManagerPaymentPromisesCsvCell } from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesCsv';
import { BellRing,Download,Plus,Printer,Search,X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo,useState } from 'react';
import { ManagerFinancePaymentPromisesAddModal } from './ManagerFinancePaymentPromisesAddModal';
import ManagerFinancePaymentPromisesEditModal from './ManagerFinancePaymentPromisesEditModal';
import { ManagerFinancePaymentPromisesKpis } from './ManagerFinancePaymentPromisesKpis';
import ManagerFinancePaymentPromisesTable,{ type PromiseSortField } from './ManagerFinancePaymentPromisesTable';
import ManagerFinancePaymentPromisesTimeHorizonBar,{ type ManagerPromisesTimeHorizon } from './ManagerFinancePaymentPromisesTimeHorizonBar';

export default function ManagerFinancePaymentPromisesPage(_routeQuery: ManagerFinancePaymentPromisesRouteQueryProps) {
  const router = useRouter();
  const tManagerUi = useTranslations('manager.manager_payment_promises.ui');
  const { formatCurrency, formatDate } = useManagerPaymentPromisesFormatting();
  // Formats Finance-facing dates: formatDate(p.expectedDate) and p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'
  const { confirm, dialog: confirmDialog } = useManagerFinancePaymentPromisesConfirm();

  const [promisesList, setPromisesList] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample[]>(
    MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(() => _routeQuery.name || _routeQuery.smartId || _routeQuery.phone || '');
  const [timeHorizon, setTimeHorizon] = useState<ManagerPromisesTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const todayDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const dueTodayPromises = useMemo(
    () => promisesList.filter((p) => p.status !== 'fulfilled' && (p.expectedDate === todayDateStr || p.daysUntilDue <= 0)),
    [promisesList, todayDateStr]
  );
  const dueTodayTotal = useMemo(
    () => dueTodayPromises.reduce((sum, p) => sum + p.promisedAmount, 0),
    [dueTodayPromises]
  );

  const handleCollectThisAmount = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const majorAmount = promise.promisedAmount / 100;
    const phoneParam = promise.phone ? `&phone=${encodeURIComponent(promise.phone)}` : '';
    const targetUrl = `/frontend_manager/manager_finance/finance_collect_fee?id=${promise.id}&name=${encodeURIComponent(promise.studentName)}&smartId=${encodeURIComponent(promise.smartId)}&amount=${majorAmount}&promiseId=${promise.id}${phoneParam}`;
    router.push(targetUrl);
  };
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit / Details Modal State
  const [selectedPromise, setSelectedPromise] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample | null>(null);
  const [editModalMode, setEditModalMode] = useState<'edit' | 'details'>('edit');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const timeHorizonLabel = useMemo(() => {
    const map: Record<ManagerPromisesTimeHorizon, string> = {
      today: 'Today', this_week: 'This Week', this_month: 'This Month', custom: 'Custom Range', all: 'All Time'
    };
    return map[timeHorizon] || 'All Time';
  }, [timeHorizon]);

  const horizonFiltered = useMemo(() => {
    return promisesList.filter((p) => {
      if (timeHorizon === 'all') return true;
      if (timeHorizon === 'today') {
        const todayStr = new Date().toISOString().slice(0, 10);
        return p.expectedDate === todayStr || (p.daysUntilDue === 0 && p.status !== 'fulfilled');
      }
      if (timeHorizon === 'this_week') {
        return (p.daysUntilDue >= 0 && p.daysUntilDue <= 7) || (p.status === 'overdue' && p.daysUntilDue >= -7);
      }
      if (timeHorizon === 'this_month') {
        return (p.daysUntilDue >= 0 && p.daysUntilDue <= 30) || (p.status === 'overdue' && p.daysUntilDue >= -30);
      }
      if (timeHorizon === 'custom') {
        if (!customStartDate && !customEndDate) return true;
        if (customStartDate && p.expectedDate < customStartDate) return false;
        if (customEndDate && p.expectedDate > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [promisesList, timeHorizon, customStartDate, customEndDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return horizonFiltered.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = !q || p.studentName.toLowerCase().includes(q) || p.smartId.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [horizonFiltered, statusFilter, searchQuery]);

  const [sortField, setSortField] = useState<PromiseSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: PromiseSortField) => {
    setPage(0);
    setSortField(field);
    setSortDirection((prev) => (sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
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

  const handleMarkPaid = async (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const formattedAmt = formatCurrency(promise.promisedAmount);
    const ok = await confirm(
      `Mark payment commitment for ${promise.studentName} (${formattedAmt}) as fulfilled / paid?`,
      'Cancel', 'Confirm Mark Paid'
    );
    if (!ok) return;

    setPromisesList((prev) =>
      prev.map((item) => (item.id === promise.id ? {
        ...item, status: 'fulfilled', fulfilledDate: new Date().toISOString().slice(0, 10), daysUntilDue: 0
      } : item))
    );
    setFeedbackToast(`Promise marked as PAID for ${promise.studentName} (${formattedAmt})!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleOpenEdit = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setSelectedPromise(promise);
    setEditModalMode('edit');
    setEditAmount(String(promise.promisedAmount >= 1000 ? Math.round(promise.promisedAmount / 100) : promise.promisedAmount));
    setEditDate(promise.expectedDate);
    setEditRemarks(promise.remarks || '');
  };

  const handleOpenView = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setSelectedPromise(promise);
    setEditModalMode('details');
    setEditAmount(String(promise.promisedAmount >= 1000 ? Math.round(promise.promisedAmount / 100) : promise.promisedAmount));
    setEditDate(promise.expectedDate);
    setEditRemarks(promise.remarks || '');
  };

  const handleSavePromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromise) return;

    const updatedAmount = (Number(editAmount) || 0) * 100 || selectedPromise.promisedAmount;
    setPromisesList((prev) =>
      prev.map((item) => (item.id === selectedPromise.id ? {
        ...item,
        promisedAmount: updatedAmount,
        expectedDate: editDate || item.expectedDate,
        remarks: editRemarks,
        timesChanged: item.timesChanged + 1,
      } : item))
    );
    setFeedbackToast(`Payment promise updated successfully for ${selectedPromise.studentName}!`);
    setSelectedPromise(null);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['Student Name', 'Smart ID', 'Phone', 'Promised Amount (INR)', 'Expected Date', 'Days Until Due', 'Status', 'Times Changed', 'Fulfilled Date', 'Remarks'];
    const csvLines = [headers.join(',')];
    for (const p of filtered) {
      csvLines.push([
        sanitizeManagerPaymentPromisesCsvCell(p.studentName),
        sanitizeManagerPaymentPromisesCsvCell(p.smartId),
        sanitizeManagerPaymentPromisesCsvCell(p.phone),
        sanitizeManagerPaymentPromisesCsvCell(String(p.promisedAmount >= 1000 ? Math.round(p.promisedAmount / 100) : p.promisedAmount)),
        sanitizeManagerPaymentPromisesCsvCell(p.expectedDate),
        sanitizeManagerPaymentPromisesCsvCell(String(p.daysUntilDue)),
        sanitizeManagerPaymentPromisesCsvCell(p.status),
        sanitizeManagerPaymentPromisesCsvCell(String(p.timesChanged)),
        sanitizeManagerPaymentPromisesCsvCell(p.fulfilledDate || '—'),
        sanitizeManagerPaymentPromisesCsvCell(p.remarks || ''),
      ].join(','));
    }
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_promises_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setFeedbackToast(`Exported ${filtered.length} payment promises to CSV.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
    setFeedbackToast('Payment promises summary report sent to printer / PDF.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleWhatsAppPromise = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const rawPhone = promise.phone || '9876543210';
    let digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;
    const majorAmount = promise.promisedAmount >= 1000 ? Math.round(promise.promisedAmount / 100) : promise.promisedAmount;
    const msg = encodeURIComponent(
      `Hello ${promise.studentName}, gentle reminder from Library regarding your committed fee payment of ₹${majorAmount.toLocaleString('en-IN')} due on ${promise.expectedDate}. Please clear dues to maintain seat access. Thank you!`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    setFeedbackToast(`WhatsApp reminder opened for ${promise.studentName}`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleCallPromise = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const rawPhone = promise.phone || '9876543210';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleAddNewPromise = (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setPromisesList([p, ...promisesList]);
    setFeedbackToast(`Payment commitment recorded for ${p.studentName} (${formatCurrency(p.promisedAmount)}) due on ${p.expectedDate}!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="fin-page-title">{tManagerUi('payment_promises')}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Promises Desk
            </span>
          </div>
          <p className="fin-page-subtitle">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
            title="Export filtered payment promises to CSV spreadsheet"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
            title="Print or Save as PDF"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <Plus size={14} /> Record Payment Promise
          </button>
        </div>
      </div>

      {dueTodayPromises.length > 0 && (
        <div
          className="p-4 rounded-xl border-2 border-rose-500/40 bg-rose-500/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse"
          data-testid="manager-finance-due-date-alert-banner"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <BellRing size={20} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <span>Critical Due Date Alert</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-600 text-white font-bold">
                  {dueTodayPromises.length} Promises Due Today / Overdue
                </span>
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Total <strong className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(dueTodayTotal)}</strong> committed by students for payment on or before today. Collect now to prevent unauthorized study access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="manager-finance-filter-due-today-btn"
              onClick={() => setTimeHorizon('today')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Filter Due Today ({dueTodayPromises.length})</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'none' }} role="status">
        <span>Sample payment promise records displayed under current contract preview.</span>
        <button type="button" disabled className="mgr-btn-outline text-xs opacity-50 cursor-not-allowed">
          Direct Sync Unavailable
        </button>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      <ManagerFinancePaymentPromisesTimeHorizonBar
        timeHorizon={timeHorizon} onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate} onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate} onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      <ManagerFinancePaymentPromisesKpis
        promises={horizonFiltered} timeHorizonLabel={timeHorizonLabel} formatCurrency={formatCurrency}
      />

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            id="promises-search-input" name="searchQuery" type="text"
            placeholder="Search student name or Smart ID..."
            className="mgr-input !pl-10 !pr-9 text-xs w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setPage(0); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <select
          id="promises-status-filter" name="statusFilter"
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[140px] outline-none"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="fulfilled">{tManagerUi('fulfilled')}</option>
          <option value="overdue">{tManagerUi('overdue')}</option>
        </select>
        {(statusFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPage(0); }}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      <ManagerFinancePaymentPromisesTable
        filtered={filtered} paginated={paginated} formatCurrency={formatCurrency} formatDate={formatDate}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={toggleSort}
        onMarkPaid={handleMarkPaid} onCollectAmount={handleCollectThisAmount}
        onWhatsAppPromise={handleWhatsAppPromise}
        onCallPromise={handleCallPromise} onOpenEdit={handleOpenEdit} onOpenView={handleOpenView}
        startItem={startItem} endItem={endItem} totalRows={totalRows}
        effectivePage={effectivePage} pageCount={pageCount}
        onPrevPage={() => setPage(effectivePage - 1)} onNextPage={() => setPage(effectivePage + 1)}
        labels={{
          student: tManagerUi('student'),
          promisedInr: tManagerUi('promised_inr'),
          expectedDate: tManagerUi('expected_date'),
          daysUntilSinceDue: tManagerUi('days_until_since_due'),
          timesChanged: tManagerUi('times_changed'),
          status: tManagerUi('status'),
          actions: tManagerUi('actions'),
          noPromises: tManagerUi('no_payment_promises_recorded'),
          paidOn: tManagerUi('paid_on'),
          daysOverdueCount: (count) => tManagerUi('days_overdue_count', { count }),
          daysCount: (count) => tManagerUi('days_count', { count }),
          translateStatus: (s) => tManagerUi(s),
        }}
      />

      <ManagerFinancePaymentPromisesEditModal
        promise={selectedPromise}
        mode={editModalMode}
        formatCurrency={formatCurrency}
        onClose={() => setSelectedPromise(null)}
        editAmount={editAmount}
        onEditAmountChange={setEditAmount}
        editDate={editDate}
        onEditDateChange={setEditDate}
        editRemarks={editRemarks}
        onEditRemarksChange={setEditRemarks}
        onSavePromise={handleSavePromise}
        onSwitchToEdit={() => setEditModalMode('edit')}
      />

      <ManagerFinancePaymentPromisesAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPromise={handleAddNewPromise}
      />

      {confirmDialog}
    </div>
  );
}
