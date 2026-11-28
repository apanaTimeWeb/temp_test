'use client';

import { ManagerFinancePaymentPromisesAddModal } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesAddModal';
import ManagerFinancePaymentPromisesDueBanner from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesDueBanner';
import ManagerFinancePaymentPromisesEditModal from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesEditModal';
import { ManagerFinancePaymentPromisesKpis } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesKpis';
import ManagerFinancePaymentPromisesTable, {
  type PromiseSortField,
} from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesTable';
import ManagerFinancePaymentPromisesTimeHorizonBar, {
  type ManagerPromisesTimeHorizon,
} from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesTimeHorizonBar';
import { MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDemoRepository';
import { useManagerPaymentPromisesFormatting } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesFormattingHook';
import { useManagerFinancePaymentPromisesConfirm } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/useManagerFinancePaymentPromisesConfirm';
import type { ManagerFinancePaymentPromisesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';
import {
  dispatchBulkPromiseWhatsApp,
  exportPaymentPromisesCsv,
  getPromiseMajorUnits,
  openPromiseWhatsAppReminder,
} from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesHelpers';
import { Download, Plus, Printer, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPromise, setSelectedPromise] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample | null>(null);
  const [editModalMode, setEditModalMode] = useState<'edit' | 'details'>('edit');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [sortField, setSortField] = useState<PromiseSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const showNotice = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const todayDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const dueTodayPromises = useMemo(
    () => promisesList.filter((p) => p.status !== 'fulfilled' && (p.expectedDate === todayDateStr || p.daysUntilDue <= 0)),
    [promisesList, todayDateStr]
  );
  const dueTodayTotal = useMemo(() => dueTodayPromises.reduce((sum, p) => sum + p.promisedAmount, 0), [dueTodayPromises]);

  const timeHorizonLabel = useMemo(() => {
    const map: Record<ManagerPromisesTimeHorizon, string> = {
      today: 'Today', this_week: 'This Week', this_month: 'This Month', custom: 'Custom Range', all: 'All Time',
    };
    return map[timeHorizon] || 'All Time';
  }, [timeHorizon]);

  const horizonFiltered = useMemo(() => promisesList.filter((p) => {
    if (timeHorizon === 'all') return true;
    if (timeHorizon === 'today') return p.expectedDate === todayDateStr || (p.daysUntilDue === 0 && p.status !== 'fulfilled');
    if (timeHorizon === 'this_week') return (p.daysUntilDue >= 0 && p.daysUntilDue <= 7) || (p.status === 'overdue' && p.daysUntilDue >= -7);
    if (timeHorizon === 'this_month') return (p.daysUntilDue >= 0 && p.daysUntilDue <= 30) || (p.status === 'overdue' && p.daysUntilDue >= -30);
    if (timeHorizon === 'custom') {
      if (customStartDate && p.expectedDate < customStartDate) return false;
      if (customEndDate && p.expectedDate > customEndDate) return false;
    }
    return true;
  }), [promisesList, timeHorizon, customStartDate, customEndDate, todayDateStr]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return horizonFiltered.filter((p) => (statusFilter === 'all' || p.status === statusFilter) && (!q || p.studentName.toLowerCase().includes(q) || p.smartId.toLowerCase().includes(q)));
  }, [horizonFiltered, statusFilter, searchQuery]);

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

  const handleMarkPaid = async (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const formattedAmt = formatCurrency(promise.promisedAmount);
    const ok = await confirm(`Mark payment commitment for ${promise.studentName} (${formattedAmt}) as fulfilled / paid?`, 'Cancel', 'Confirm Mark Paid');
    if (!ok) return;
    setPromisesList((prev) => prev.map((item) => item.id === promise.id ? { ...item, status: 'fulfilled', fulfilledDate: todayDateStr, daysUntilDue: 0 } : item));
    showNotice(`Promise marked as PAID for ${promise.studentName} (${formattedAmt})!`);
  };

  const openModalWith = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample, mode: 'edit' | 'details') => {
    setSelectedPromise(promise);
    setEditModalMode(mode);
    setEditAmount(String(getPromiseMajorUnits(promise.promisedAmount)));
    setEditDate(promise.expectedDate);
    setEditRemarks(promise.remarks || '');
  };

  const handleSavePromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromise) return;
    const updatedAmount = (Number(editAmount) || 0) * 100 || selectedPromise.promisedAmount;
    setPromisesList((prev) => prev.map((item) => item.id === selectedPromise.id ? { ...item, promisedAmount: updatedAmount, expectedDate: editDate || item.expectedDate, remarks: editRemarks, timesChanged: item.timesChanged + 1 } : item));
    showNotice(`Payment promise updated successfully for ${selectedPromise.studentName}!`);
    setSelectedPromise(null);
  };

  const handleCollectThisAmount = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    const phoneParam = promise.phone ? `&phone=${encodeURIComponent(promise.phone)}` : '';
    router.push(`/frontend_manager/manager_finance/finance_collect_fee?id=${promise.id}&name=${encodeURIComponent(promise.studentName)}&smartId=${encodeURIComponent(promise.smartId)}&amount=${getPromiseMajorUnits(promise.promisedAmount)}&promiseId=${promise.id}${phoneParam}`);
  };

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="fin-page-title">{tManagerUi('payment_promises')}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              Active Promises Desk
            </span>
          </div>
          <p className="fin-page-subtitle">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => { exportPaymentPromisesCsv(filtered); showNotice(`Exported ${filtered.length} payment promises to CSV.`); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none" title="Export filtered payment promises to CSV spreadsheet">
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button type="button" onClick={() => { if (typeof window !== 'undefined') window.print(); showNotice('Payment promises summary report sent to printer / PDF.'); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none" title="Print or Save as PDF">
            <Printer size={13} className="text-secondary" />
            <span>Print / PDF</span>
          </button>
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="mgr-btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none">
            <Plus size={14} /> Record Payment Promise
          </button>
        </div>
      </div>

      <ManagerFinancePaymentPromisesDueBanner
        dueCount={dueTodayPromises.length}
        formattedTotal={formatCurrency(dueTodayTotal)}
        onBulkWhatsApp={() => { dispatchBulkPromiseWhatsApp(dueTodayPromises); showNotice(`Dispatched WhatsApp fee payment reminders to ${dueTodayPromises.length} students due today`); }}
        onFilterToday={() => setTimeHorizon('today')}
      />

      <div className="hidden" role="status">
        <span>Sample payment promise records displayed under current contract preview.</span>
        <button type="button" disabled className="mgr-btn-outline text-xs opacity-50 cursor-not-allowed">Direct Sync Unavailable</button>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>{feedbackToast}</span>
        </div>
      )}

      <ManagerFinancePaymentPromisesTimeHorizonBar timeHorizon={timeHorizon} onChangeTimeHorizon={setTimeHorizon} customStartDate={customStartDate} onCustomStartDateChange={setCustomStartDate} customEndDate={customEndDate} onCustomEndDateChange={setCustomEndDate} activeCount={filtered.length} />
      <ManagerFinancePaymentPromisesKpis promises={horizonFiltered} timeHorizonLabel={timeHorizonLabel} formatCurrency={formatCurrency} />

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input maxLength={30} id="promises-search-input" name="searchQuery" type="text" placeholder="Search student name or Smart ID..." className="mgr-input !pl-10 !pr-9 text-xs w-full focus-visible:ring-2 focus-visible:ring-primary outline-none" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} />
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); setPage(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded cursor-pointer" title="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <select id="promises-status-filter" name="statusFilter" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[140px] outline-none" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="fulfilled">{tManagerUi('fulfilled')}</option>
          <option value="overdue">{tManagerUi('overdue')}</option>
        </select>
        {(statusFilter !== 'all' || searchQuery.trim() !== '') && (
          <button type="button" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPage(0); }} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:transition-colors">
            <X size={13} /> Reset
          </button>
        )}
      </div>

      <ManagerFinancePaymentPromisesTable
        filtered={filtered} paginated={paginated} formatCurrency={formatCurrency} formatDate={formatDate}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={(f) => { setPage(0); setSortField(f); setSortDirection((prev) => (sortField === f ? (prev === 'asc' ? 'desc' : 'asc') : 'asc')); }}
        onMarkPaid={handleMarkPaid} onCollectAmount={handleCollectThisAmount}
        onWhatsAppPromise={(p) => { openPromiseWhatsAppReminder(p); showNotice(`WhatsApp reminder opened for ${p.studentName}`); }}
        onCallPromise={(p) => { window.location.href = `tel:${(p.phone || '9876543210').replace(/\D/g, '')}`; }}
        onOpenEdit={(p) => openModalWith(p, 'edit')} onOpenView={(p) => openModalWith(p, 'details')}
        startItem={totalRows === 0 ? 0 : effectivePage * pageSize + 1} endItem={Math.min((effectivePage + 1) * pageSize, totalRows)} totalRows={totalRows}
        effectivePage={effectivePage} pageCount={pageCount} onPrevPage={() => setPage(effectivePage - 1)} onNextPage={() => setPage(effectivePage + 1)}
        labels={{ student: tManagerUi('student'), promisedInr: tManagerUi('promised_inr'), expectedDate: tManagerUi('expected_date'), daysUntilSinceDue: tManagerUi('days_until_since_due'), timesChanged: tManagerUi('times_changed'), status: tManagerUi('status'), actions: tManagerUi('actions'), noPromises: tManagerUi('no_payment_promises_recorded'), paidOn: tManagerUi('paid_on'), daysOverdueCount: (count) => tManagerUi('days_overdue_count', { count }), daysCount: (count) => tManagerUi('days_count', { count }), translateStatus: (s) => tManagerUi(s) }}
      />

      <ManagerFinancePaymentPromisesEditModal promise={selectedPromise} mode={editModalMode} formatCurrency={formatCurrency} onClose={() => setSelectedPromise(null)} editAmount={editAmount} onEditAmountChange={setEditAmount} editDate={editDate} onEditDateChange={setEditDate} editRemarks={editRemarks} onEditRemarksChange={setEditRemarks} onSavePromise={handleSavePromise} onSwitchToEdit={() => setEditModalMode('edit')} />
      <ManagerFinancePaymentPromisesAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddPromise={(p) => { setPromisesList([p, ...promisesList]); showNotice(`Payment commitment recorded for ${p.studentName} (${formatCurrency(p.promisedAmount)}) due on ${p.expectedDate}!`); }} />
      {confirmDialog}
    </div>
  );
}
