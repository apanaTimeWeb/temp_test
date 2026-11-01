'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useManagerLateFeesFormatting } from '@/app/frontend_manager/manager_finance/finance_late_fees/hooks/ManagerFinanceLateFeesFormattingHook';
import { Settings, AlertTriangle, MessageSquare, X, CheckCircle, Send, IndianRupee } from 'lucide-react';
import { MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG, MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_late_fees/hooks/ManagerFinanceLateFeesDemoRepository';
import type { ManagerFinanceLateFeesLateFeeConfig, ManagerFinanceLateFeesOverdueStudent } from '@/app/frontend_manager/manager_finance/finance_late_fees/hooks/ManagerFinanceLateFeesDemoRepository';
import { ManagerFinanceLateFeesEmptyState } from '@/app/frontend_manager/manager_finance/finance_late_fees/components/manager_finance_late_fees_empty_states/ManagerFinanceLateFeesEmptyState';
import type { ManagerFinanceLateFeesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesComponentTypes';

export default function ManagerFinanceLateFeesPage(_routeQuery: ManagerFinanceLateFeesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_late_fees.ui');
  const { formatCurrency } = useManagerLateFeesFormatting();
  const config: ManagerFinanceLateFeesLateFeeConfig = MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG;
  const overdue: ManagerFinanceLateFeesOverdueStudent[] = MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [reminderTarget, setReminderTarget] = useState<ManagerFinanceLateFeesOverdueStudent | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalRows = overdue.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = overdue.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleSendReminder = () => {
    if (!reminderTarget) return;
    setToastMsg(`Payment due reminder dispatched to ${reminderTarget.studentName} via WhatsApp and SMS!`);
    setReminderTarget(null);
    setTimeout(() => setToastMsg(null), 4000);
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
        <h1 className="fin-page-title">{tManagerUi('late_fees')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('configure_late_fee_policies_and_view_overdue_students')}</p>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Config Card */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <Settings size={18} className="fin-icon-muted" />
            {tManagerUi('late_fee_settings')}
          </div>
          <span className="fin-badge fin-badge--success">Active Policy</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="fin-text-muted text-sm">{tManagerUi('grace_period')}</p>
            <p className="fin-kpi-value">{config?.gracePeriodDays} {tManagerUi('days')}</p>
          </div>
          <div>
            <p className="fin-text-muted text-sm">{tManagerUi('penalty_per_day')}</p>
            <p className="fin-kpi-value">{formatCurrency(config?.penaltyPerDay || 0)}</p>
          </div>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center justify-between p-4 fin-border-bottom">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="fin-text-warning" />
            <span className="fin-text-body font-semibold">{tManagerUi('overdue_students')}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMsg(`Dispatched broadcast reminders to all ${overdue.length} overdue students!`);
              setTimeout(() => setToastMsg(null), 4000);
            }}
            className="mgr-btn-primary text-xs flex items-center gap-1.5"
          >
            <MessageSquare size={14} /> Send Reminders to All Overdue
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('subscription_due_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('days_overdue')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('late_fee_accrued_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('total_due_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {overdue.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <ManagerFinanceLateFeesEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">✅</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_active_late_fee_charges')}</p>
                  </ManagerFinanceLateFeesEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr key={s.studentId} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name font-semibold">{s.studentName}</div>
                    <div className="fin-cell-subtext font-mono">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}{tManagerUi('d')}</span>
                  </td>
                  <td className="py-3 px-4 text-right fin-text-warning">{formatCurrency(s.accruedFee)}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-danger">{formatCurrency(s.totalDue)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReminderTarget(s)}
                        className="fin-badge fin-badge--warning cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="Send WhatsApp payment due reminder"
                      >
                        <MessageSquare size={12} /> Send Due Reminder
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {overdue.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} results
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

      {/* Reminder Dispatch Modal */}
      {reminderTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <h2 className="text-base font-bold text-primary">Dispatch Overdue Payment Notice</h2>
              </div>
              <button type="button" onClick={() => setReminderTarget(null)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 bg-floating/60 rounded-xl border border-border space-y-1">
                <p className="text-xs text-secondary">Recipient Student</p>
                <p className="text-sm font-bold text-primary">{reminderTarget.studentName} ({reminderTarget.smartId})</p>
                <div className="flex justify-between text-xs pt-1 border-t border-border mt-1">
                  <span className="text-secondary">Due Date:</span>
                  <span className="font-semibold">{reminderTarget.dueDate} ({reminderTarget.daysOverdue} days overdue)</span>
                </div>
                <div className="flex justify-between text-xs text-danger">
                  <span>Accrued Late Penalty:</span>
                  <span>{formatCurrency(reminderTarget.accruedFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-danger pt-1 border-t border-border">
                  <span>Total Amount Due:</span>
                  <span>{formatCurrency(reminderTarget.totalDue)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">WhatsApp & SMS Message Template</label>
                <div className="p-3 bg-surface-highlight rounded-xl border border-border text-xs text-secondary leading-relaxed font-mono">
                  Dear {reminderTarget.studentName}, your library subscription was due on {reminderTarget.dueDate} and is now {reminderTarget.daysOverdue} days overdue. Total payable (including late fee): {formatCurrency(reminderTarget.totalDue)}. Please pay at the counter or via UPI to keep your seat reserved.
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setReminderTarget(null)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReminder}
                  className="mgr-btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send size={14} /> Send WhatsApp Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
