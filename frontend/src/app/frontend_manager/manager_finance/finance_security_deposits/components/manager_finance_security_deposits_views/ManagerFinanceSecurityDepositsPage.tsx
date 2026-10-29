'use client';
import { useTranslations } from 'next-intl';
import { useManagerSecurityDepositsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/useManagerFinanceSecurityDepositsUrlFilters';

import { useManagerSecurityDepositsFormatting } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsFormattingHook';

// RESPONSIBILITY: Entry page for the manager_security_deposits module.
// DATA FLOW: Next.js Router -> Page -> Components


// RESPONSIBILITY: Entry page for the manager_security_deposits module.
// DATA FLOW: Next.js Router -> Page -> Components
import { Undo2, Minus } from 'lucide-react';

const URL_FILTERS = { status: { defaultValue: 'all', allowedValues: ['all', 'held', 'refunded', 'forfeited'] } as const };

const STATUS_BADGE: Record<string, string> = {
  held:      'fin-badge fin-badge--info',
  refunded:  'fin-badge fin-badge--success',
  forfeited: 'fin-badge fin-badge--danger',
};

import { MANAGER_FINANCE_SAMPLE_DEPOSITS } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { ManagerFinanceSecurityDepositsEmptyState } from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_empty_states/ManagerFinanceSecurityDepositsEmptyState';
import type { ManagerFinanceSecurityDepositsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsComponentTypes';



export default function ManagerFinanceSecurityDepositsPage(_routeQuery: ManagerFinanceSecurityDepositsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_security_deposits.ui');
  const { formatCurrency } = useManagerSecurityDepositsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerSecurityDepositsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status;
  const deposits: ManagerFinanceSecurityDepositsSampleDeposit[] = MANAGER_FINANCE_SAMPLE_DEPOSITS;

  const filtered = deposits.filter((d) => statusFilter === 'all' || d.status === statusFilter);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('security_deposits')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_student_security_deposit_records')}</p><p className="fin-input-hint fin-text-warning" data-testid="manager-finance-deposits-contract-warning" role="status">{tManagerUi('sample_records_are_shown_for_layout_review_only_refund_a_79f310')}</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setUrlFilter('status', e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="held">{tManagerUi('held')}</option>
          <option value="refunded">{tManagerUi('refunded')}</option>
          <option value="forfeited">{tManagerUi('forfeited')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('deposit_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('collected_by_898bb0')}</th>
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
                    <div className="fin-empty-state__icon">💼</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_security_deposits_recorded')}</p>
                  </ManagerFinanceSecurityDepositsEmptyState>
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{d.studentName}</div>
                    <div className="fin-cell-subtext">{d.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(d.depositAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[d.status] || 'fin-badge fin-badge--neutral'}>{tManagerUi(d.status)}</span>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{d.collectedBy}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.collectedDate}</td>
                  <td className={`py-3 px-4 text-right ${d.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {d.deductionAmount > 0 ? formatCurrency(d.deductionAmount) : '—'}
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.deductionReason || '—'}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.refundedDate || '—'}</td>
                  <td className="py-3 px-4">
                    {d.status === 'held' && (
                      <div className="flex items-center justify-end gap-2">
                        <button type="button"
                          className="fin-badge fin-badge--success cursor-not-allowed"
                          disabled
                          title={tManagerUi('refund_unavailable_verified_api_contract_not_supplied')}
                        >
                          <Undo2 size={11} /> {tManagerUi('process_refund')}
                        </button>
                        <button type="button"
                          className="fin-badge fin-badge--warning cursor-not-allowed"
                          disabled
                          title={tManagerUi('deduction_unavailable_verified_api_contract_not_supplied')}
                        >
                          <Minus size={11} /> {tManagerUi('add_deduction')}
                        </button>
                      </div>
                    )}
                    {d.status === 'refunded' && d.refundedDate && (
                      <span className="fin-cell-subtext">{tManagerUi('refunded')} {d.refundedDate}</span>
                    )}
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
