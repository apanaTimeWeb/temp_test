'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useManagerPaymentPromisesFormatting } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesFormattingHook';
import { CheckCircle, CalendarPlus, Eye, Search, X, Edit3, IndianRupee, MessageSquare } from 'lucide-react';
import { MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES, type ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import { MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/constants/ManagerFinancePaymentPromisesPaymentPromiseConstants';
import { ManagerFinancePaymentPromisesEmptyState } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_empty_states/ManagerFinancePaymentPromisesEmptyState';
import type { ManagerFinancePaymentPromisesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';

export default function ManagerFinancePaymentPromisesPage(_routeQuery: ManagerFinancePaymentPromisesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_payment_promises.ui');
  const { formatCurrency, formatDate } = useManagerPaymentPromisesFormatting();
  
  const [promisesList, setPromisesList] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample[]>(
    MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Edit / Details Modal State
  const [selectedPromise, setSelectedPromise] = useState<ManagerFinancePaymentPromisesPaymentPromiseSample | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return promisesList.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = !q || p.studentName.toLowerCase().includes(q) || p.smartId.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [promisesList, statusFilter, searchQuery]);

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
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
        <h1 className="fin-page-title">{tManagerUi('payment_promises')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

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

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('promised_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('expected_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('days_until_since_due')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('times_changed')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <ManagerFinancePaymentPromisesEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">🤝</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_payment_promises_recorded')}</p>
                  </ManagerFinancePaymentPromisesEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12"
                >
                  <td className="py-3 px-4">
                    <div className="fin-cell-name font-semibold">{p.studentName}</div>
                    <div className="fin-cell-subtext font-mono">{p.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(p.promisedAmount)}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(p.expectedDate)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        p.daysUntilDue < 0
                          ? 'fin-text-danger font-semibold'
                          : p.daysUntilDue <= 3
                          ? 'fin-text-warning'
                          : 'fin-text-body'
                      }
                    >
                      {p.daysUntilDue < 0
                        ? tManagerUi('days_overdue_count', { count: Math.abs(p.daysUntilDue) })
                        : tManagerUi('days_count', { count: p.daysUntilDue })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.timesChanged >= 3 ? (
                      <span className="fin-badge fin-badge--danger">{p.timesChanged}x changed</span>
                    ) : p.timesChanged > 0 ? (
                      <span className="fin-badge fin-badge--warning">{p.timesChanged}x changed</span>
                    ) : (
                      <span className="fin-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE[p.status] || 'fin-badge fin-badge--neutral'}>
                      {tManagerUi(p.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.status !== 'fulfilled' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMarkPaid(p)}
                          className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 flex items-center gap-1"
                          title="Mark payment promise as cleared"
                        >
                          <CheckCircle size={11} /> Mark Paid
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="fin-badge fin-badge--warning cursor-pointer hover:opacity-90 flex items-center gap-1"
                          title="Edit promise amount or extend expected date"
                        >
                          <CalendarPlus size={11} /> Edit / Extend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="fin-badge fin-badge--neutral cursor-pointer hover:opacity-90 flex items-center gap-1"
                          title="View commitment details"
                        >
                          <Eye size={11} /> Details
                        </button>
                      </div>
                    ) : (
                      <span className="fin-cell-subtext text-success font-medium">
                        ✓ {tManagerUi('paid_on')} {p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} promises
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={effectivePage === 0}
                onClick={() => setPage(effectivePage - 1)}
                className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => setPage(effectivePage + 1)}
                className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit / View Promise Modal */}
      {selectedPromise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-primary" />
                <h2 className="text-base font-bold text-primary">Edit Payment Commitment</h2>
              </div>
              <button type="button" onClick={() => setSelectedPromise(null)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePromise} className="space-y-3.5">
              <div className="p-3 bg-floating/60 rounded-xl border border-border">
                <p className="text-xs text-secondary">Student Name</p>
                <p className="text-sm font-bold text-primary">{selectedPromise.studentName}</p>
                <p className="text-xs font-mono text-secondary mt-0.5">{selectedPromise.smartId}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Promised Amount (INR) *</label>
                <div className="relative">
                  <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="number"
                    required
                    className="mgr-input pl-8 text-xs font-mono font-bold"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Revised Expected Payment Date *</label>
                <input
                  type="date"
                  required
                  className="mgr-input text-xs"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Remarks & Student Reason</label>
                <textarea
                  rows={2}
                  className="mgr-input text-xs resize-none"
                  placeholder="e.g. Student requested 5-day grace period due to semester exam fee..."
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setSelectedPromise(null)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
                  <CheckCircle size={14} /> Save Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
