'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useManagerPaymentPromisesFormatting } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesFormattingHook';
import { Search, Plus } from 'lucide-react';
import { MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES, type ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import type { ManagerFinancePaymentPromisesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';
import ManagerFinancePaymentPromisesEditModal from './ManagerFinancePaymentPromisesEditModal';
import { ManagerFinancePaymentPromisesAddModal } from './ManagerFinancePaymentPromisesAddModal';
import ManagerFinancePaymentPromisesTable, { type PromiseSortField } from './ManagerFinancePaymentPromisesTable';
import ManagerFinancePaymentPromisesTimeHorizonBar, { type ManagerPromisesTimeHorizon } from './ManagerFinancePaymentPromisesTimeHorizonBar';
import ManagerFinancePaymentPromisesKpis from './ManagerFinancePaymentPromisesKpis';

export default function ManagerFinancePaymentPromisesPage(_routeQuery: ManagerFinancePaymentPromisesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_payment_promises.ui');
  const { formatCurrency, formatDate } = useManagerPaymentPromisesFormatting();
  // Formats Finance-facing dates: formatDate(p.expectedDate) and p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'

  const [promisesList, setPromisesList] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample[]>(
    MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeHorizon, setTimeHorizon] = useState<ManagerPromisesTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit / Details Modal State
  const [selectedPromise, setSelectedPromise] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return 'Custom Range';
      default: return 'All Time';
    }
  }, [timeHorizon]);

  const horizonFiltered = useMemo(() => {
    return promisesList.filter((p) => {
      if (timeHorizon === 'today') {
        return p.status === 'pending' || p.status === 'overdue';
      }
      if (timeHorizon === 'this_week') {
        return p.status === 'pending' || p.status === 'overdue';
      }
      if (timeHorizon === 'this_month') {
        return true;
      }
      return true;
    });
  }, [promisesList, timeHorizon]);

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

  const handleMarkPaid = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setPromisesList((prev) =>
      prev.map((item) => {
        if (item.id === promise.id) {
          return {
            ...item,
            status: 'fulfilled',
            fulfilledDate: new Date().toISOString().slice(0, 10),
            daysUntilDue: 0,
          };
        }
        return item;
      })
    );
    setFeedbackToast(`Promise marked as PAID for ${promise.studentName} (₹${promise.promisedAmount})!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleOpenEdit = (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setSelectedPromise(promise);
    setEditAmount(String(promise.promisedAmount));
    setEditDate(promise.expectedDate);
    setEditRemarks(promise.remarks || '');
  };

  const handleSavePromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromise) return;

    setPromisesList((prev) =>
      prev.map((item) => {
        if (item.id === selectedPromise.id) {
          return {
            ...item,
            promisedAmount: Number(editAmount) || item.promisedAmount,
            expectedDate: editDate || item.expectedDate,
            remarks: editRemarks,
            timesChanged: item.timesChanged + 1,
          };
        }
        return item;
      })
    );

    setFeedbackToast(`Payment promise updated successfully for ${selectedPromise.studentName}!`);
    setSelectedPromise(null);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleAddNewPromise = (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => {
    setPromisesList([p, ...promisesList]);
    setFeedbackToast(`Payment commitment recorded for ${p.studentName} (₹${p.promisedAmount}) due on ${p.expectedDate}!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="fin-page-title">{tManagerUi('payment_promises')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="mgr-btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm"
        >
          <Plus size={14} /> Record Payment Promise
        </button>
      </div>

      <div className="p-3 rounded-xl bg-muted border border-border text-xs text-secondary flex items-center justify-between" role="status">
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

      {/* Promises Global Time Horizon Bar */}
      <ManagerFinancePaymentPromisesTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filtered.length}
      />

      {/* KPI Overview Cards */}
      <ManagerFinancePaymentPromisesKpis
        promises={horizonFiltered}
        timeHorizonLabel={timeHorizonLabel}
        formatCurrency={formatCurrency}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student name or Smart ID..."
            className="mgr-input pl-9 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          className="fin-select w-44 text-xs"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="fulfilled">{tManagerUi('fulfilled')}</option>
          <option value="overdue">{tManagerUi('overdue')}</option>
        </select>
      </div>

      <ManagerFinancePaymentPromisesTable
        filtered={filtered}
        paginated={paginated}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onMarkPaid={handleMarkPaid}
        onOpenEdit={handleOpenEdit}
        startItem={startItem}
        endItem={endItem}
        totalRows={totalRows}
        effectivePage={effectivePage}
        pageCount={pageCount}
        onPrevPage={() => setPage(effectivePage - 1)}
        onNextPage={() => setPage(effectivePage + 1)}
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
        onClose={() => setSelectedPromise(null)}
        editAmount={editAmount}
        onEditAmountChange={setEditAmount}
        editDate={editDate}
        onEditDateChange={setEditDate}
        editRemarks={editRemarks}
        onEditRemarksChange={setEditRemarks}
        onSavePromise={handleSavePromise}
      />

      <ManagerFinancePaymentPromisesAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPromise={handleAddNewPromise}
      />
    </div>
  );
}
