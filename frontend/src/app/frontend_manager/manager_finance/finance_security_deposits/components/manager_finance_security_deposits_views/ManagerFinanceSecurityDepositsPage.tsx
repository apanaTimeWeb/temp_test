'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useManagerSecurityDepositsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/useManagerFinanceSecurityDepositsUrlFilters';
import { useManagerSecurityDepositsFormatting } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsFormattingHook';
import { Undo2, Minus, Search, X, CheckCircle, IndianRupee, AlertCircle } from 'lucide-react';
import { MANAGER_FINANCE_SAMPLE_DEPOSITS } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { ManagerFinanceSecurityDepositsEmptyState } from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_empty_states/ManagerFinanceSecurityDepositsEmptyState';
import type { ManagerFinanceSecurityDepositsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsComponentTypes';

const URL_FILTERS = { status: { defaultValue: 'all', allowedValues: ['all', 'held', 'refunded', 'forfeited'] } as const };

const STATUS_BADGE: Record<string, string> = {
  held: 'fin-badge fin-badge--info',
  refunded: 'fin-badge fin-badge--success',
  forfeited: 'fin-badge fin-badge--danger',
};

export default function ManagerFinanceSecurityDepositsPage(_routeQuery: ManagerFinanceSecurityDepositsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_security_deposits.ui');
  const { formatCurrency } = useManagerSecurityDepositsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerSecurityDepositsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status;

  const [depositsList, setDepositsList] = useState<ManagerFinanceSecurityDepositsSampleDeposit[]>(
    MANAGER_FINANCE_SAMPLE_DEPOSITS
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [refundTarget, setRefundTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [refundMode, setRefundMode] = useState<'cash' | 'upi'>('upi');
  const [refundRef, setRefundRef] = useState('');

  const [deductionTarget, setDeductionTarget] = useState<ManagerFinanceSecurityDepositsSampleDeposit | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('150');
  const [deductionReason, setDeductionReason] = useState('Locker Key Lost');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return depositsList.filter((d) => {
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchSearch = !q || d.studentName.toLowerCase().includes(q) || d.smartId.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [depositsList, statusFilter, searchQuery]);

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const confirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;

    setDepositsList((prev) =>
      prev.map((item) => {
        if (item.id === refundTarget.id) {
          return {
            ...item,
            status: 'refunded',
            refundedDate: new Date().toISOString().slice(0, 10),
          };
        }
        return item;
      })
    );

    const netRefund = refundTarget.depositAmount - (refundTarget.deductionAmount || 0);
    setToastMessage(`Refund of ₹${netRefund} processed for ${refundTarget.studentName} via ${refundMode.toUpperCase()}!`);
    setRefundTarget(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const confirmDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductionTarget) return;

    const amt = Number(deductionAmount) || 0;
    setDepositsList((prev) =>
      prev.map((item) => {
        if (item.id === deductionTarget.id) {
          return {
            ...item,
            deductionAmount: (item.deductionAmount || 0) + amt,
            deductionReason: deductionReason.trim() || 'Penalty',
          };
        }
        return item;
      })
    );

    setToastMessage(`Deduction of ₹${amt} logged for ${deductionTarget.studentName} (${deductionReason})!`);
    setDeductionTarget(null);
    setTimeout(() => setToastMessage(null), 4000);
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
        <h1 className="fin-page-title">{tManagerUi('security_deposits')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_student_security_deposit_records')}</p>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student or Smart ID..."
            className="mgr-input pl-9 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          className="fin-select w-40 text-xs"
          value={statusFilter}
          onChange={(e) => {
            setUrlFilter('status', e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="held">{tManagerUi('held')}</option>
          <option value="refunded">{tManagerUi('refunded')}</option>
          <option value="forfeited">{tManagerUi('forfeited')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('deposit_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('collected_by')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('collected_date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('deduction_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('deduction_reason')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('refunded_date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <ManagerFinanceSecurityDepositsEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">🔒</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_security_deposits_found')}</p>
                  </ManagerFinanceSecurityDepositsEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((d) => (
                <tr
                  key={d.id}
                  className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12"
                >
                  <td className="py-3 px-4">
                    <div className="fin-cell-name font-semibold">{d.studentName}</div>
                    <div className="fin-cell-subtext font-mono">{d.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(d.depositAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[d.status] || 'fin-badge fin-badge--neutral'}>{tManagerUi(d.status)}</span>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{d.collectedBy}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.collectedDate}</td>
                  <td className={`py-3 px-4 text-right font-medium ${d.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {d.deductionAmount > 0 ? formatCurrency(d.deductionAmount) : '—'}
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.deductionReason || '—'}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.refundedDate || '—'}</td>
                  <td className="py-3 px-4">
                    {d.status === 'held' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRefundTarget(d)}
                          className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 flex items-center gap-1"
                          title="Process deposit return to student"
                        >
                          <Undo2 size={11} /> Refund
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeductionTarget(d);
                            setDeductionAmount('150');
                            setDeductionReason('Locker Key Lost');
                          }}
                          className="fin-badge fin-badge--warning cursor-pointer hover:opacity-90 flex items-center gap-1"
                          title="Add penalty or damage deduction"
                        >
                          <Minus size={11} /> Deduct
                        </button>
                      </div>
                    )}
                    {d.status === 'refunded' && (
                      <span className="fin-cell-subtext text-success font-medium">✓ Refunded {d.refundedDate}</span>
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
              Showing {startItem}–{endItem} of {totalRows} deposit records
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

      {/* Process Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Undo2 size={18} className="text-success" />
                <h2 className="text-base font-bold text-primary">Process Security Deposit Refund</h2>
              </div>
              <button type="button" onClick={() => setRefundTarget(null)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={confirmRefund} className="space-y-3.5">
              <div className="p-3 bg-floating/60 rounded-xl border border-border space-y-1">
                <p className="text-xs text-secondary">Student Name</p>
                <p className="text-sm font-bold text-primary">{refundTarget.studentName} ({refundTarget.smartId})</p>
                <div className="flex justify-between text-xs pt-1 border-t border-border mt-1">
                  <span className="text-secondary">Gross Deposit Held:</span>
                  <span className="font-semibold text-primary">₹{refundTarget.depositAmount}</span>
                </div>
                {refundTarget.deductionAmount > 0 && (
                  <div className="flex justify-between text-xs text-danger">
                    <span>Less Deductions ({refundTarget.deductionReason}):</span>
                    <span>- ₹{refundTarget.deductionAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-success pt-1 border-t border-border">
                  <span>Net Refund Payable:</span>
                  <span>₹{refundTarget.depositAmount - (refundTarget.deductionAmount || 0)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Refund Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundMode('upi')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      refundMode === 'upi' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                    }`}
                  >
                    UPI Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundMode('cash')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      refundMode === 'cash' ? 'bg-primary text-on-primary border-primary' : 'bg-card text-secondary border-border'
                    }`}
                  >
                    Cash from Counter
                  </button>
                </div>
              </div>

              {refundMode === 'upi' && (
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">UPI Transaction Reference</label>
                  <input
                    type="text"
                    className="mgr-input text-xs font-mono"
                    placeholder="e.g. UPI/2026/987123"
                    value={refundRef}
                    onChange={(e) => setRefundRef(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setRefundTarget(null)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
                  <CheckCircle size={14} /> Confirm & Release Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Deduction Modal */}
      {deductionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Minus size={18} className="text-danger" />
                <h2 className="text-base font-bold text-primary">Add Deposit Deduction</h2>
              </div>
              <button type="button" onClick={() => setDeductionTarget(null)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={confirmDeduction} className="space-y-3.5">
              <div className="p-3 bg-floating/60 rounded-xl border border-border">
                <p className="text-xs text-secondary">Student Name</p>
                <p className="text-sm font-bold text-primary">{deductionTarget.studentName} ({deductionTarget.smartId})</p>
                <p className="text-xs text-secondary mt-1">Available Deposit: <strong>₹{deductionTarget.depositAmount - (deductionTarget.deductionAmount || 0)}</strong></p>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Deduction Reason *</label>
                <select
                  className="mgr-select text-xs"
                  value={deductionReason}
                  onChange={(e) => {
                    const r = e.target.value;
                    setDeductionReason(r);
                    if (r === 'Locker Key Lost') setDeductionAmount('150');
                    if (r === 'Desk or Chair Damage') setDeductionAmount('300');
                    if (r === 'Lost Library RFID Smart ID') setDeductionAmount('100');
                  }}
                >
                  <option value="Locker Key Lost">Locker Key Lost (₹150)</option>
                  <option value="Desk or Chair Damage">Desk or Chair Damage (₹300)</option>
                  <option value="Lost Library RFID Smart ID">Lost Library RFID Smart ID (₹100)</option>
                  <option value="Unpaid Late Overstay Fee">Unpaid Late Overstay Fee</option>
                  <option value="Other">Other Specific Deduction</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Deduction Amount (INR) *</label>
                <div className="relative">
                  <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="number"
                    required
                    className="mgr-input pl-8 text-xs font-mono font-bold"
                    value={deductionAmount}
                    onChange={(e) => setDeductionAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setDeductionTarget(null)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5 bg-danger hover:bg-danger/90">
                  <CheckCircle size={14} /> Apply Deduction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
