'use client';
import { useTranslations } from 'next-intl';

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
            <tr className="fin-table-header-row">
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
              overdue.map((s) => (
                <tr key={s.studentId} className="fin-table-hover-row fin-table-row">
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
                        disabled
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        data-testid="manager-finance-late-fee-sample-preview-disabled"
                        title={tManagerUi('sample_fee_preview_unavailable_until_authoritative_student_and_finance_contracts_are_supplied')}
                      >
                        {tManagerUi('fee_preview_unavailable')}
                      </button>
                      <button
                        type="button"
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        disabled
                        title={tManagerUi('reminder_unavailable_sample_contact_data_and_a_verified_467462')}
                        data-testid="manager-finance-late-fee-sample-reminder-disabled"
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
      </div>
    </div>
  );
}
