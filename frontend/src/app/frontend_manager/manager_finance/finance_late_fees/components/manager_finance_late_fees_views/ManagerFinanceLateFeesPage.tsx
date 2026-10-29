'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useManagerLateFeesFormatting } from '@/app/frontend_manager/manager_finance/finance_late_fees/hooks/ManagerFinanceLateFeesFormattingHook';

// RESPONSIBILITY: Entry page for the manager_late_fees module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_late_fees module.
// DATA FLOW: Next.js Router -> Page -> Components
import { Settings, AlertTriangle, MessageSquare } from 'lucide-react';

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

  const totalRows = overdue.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = overdue.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('late_fees')}</h1>
        <p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('configuration_and_overdue_records_are_sample_data_saving_129dd2')}</p>
        <p className="fin-page-subtitle">{tManagerUi('configure_late_fee_policies_and_view_overdue_students')}</p>
      </div>

      {/* Config Card */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <Settings size={18} className="fin-icon-muted" />
            {tManagerUi('late_fee_settings')}
          </div>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('save_unavailable_verified_api_contract_not_supplied')}>
            {tManagerUi('edit')}
          </button>
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
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <AlertTriangle size={18} className="fin-text-warning" />
          <span className="fin-text-body font-semibold">{tManagerUi('overdue_students')}</span>
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
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
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
                        data-testid="manager-finance-late-fee-sample-preview-disabled"
                        disabled
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        title={tManagerUi('sample_fee_preview_unavailable_until_authoritative_student_and_finance_contracts_are_supplied')}
                      >
                        {tManagerUi('fee_preview_unavailable')}
                      </button>
                      <button
                        type="button"
                        data-testid="manager-finance-late-fee-sample-reminder-disabled"
                        disabled
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        title={tManagerUi('reminder_unavailable_sample_contact_data_and_a_verified_467462')}
                      >
                        <MessageSquare size={13} /> {tManagerUi('reminder_unavailable')}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-finance-late-fees" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-finance-late-fees"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="mgr-btn-ghost mgr-btn-sm"
                  disabled={effectivePage <= 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Previous
                </button>
                <span className="text-xs text-secondary px-1">
                  Page {effectivePage + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  className="mgr-btn-ghost mgr-btn-sm"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
