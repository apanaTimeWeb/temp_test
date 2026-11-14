'use client';
import SuperadminBillingOverviewMemberRefundsEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/components/SuperadminBillingOverviewMemberRefundsEmptyState';
/** Responsibility: Superadmin Finance Refunds Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberRefundsPageClient -> typed leaf-owned child components; sibling business modules are not required. */
import { useSuperadminBillingOverviewMemberRefundsUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/hooks/useSuperadminBillingOverviewMemberRefundsUrlFilter';

import { useLocale, useTranslations } from 'next-intl';
import { useSuperadminBillingOverviewMemberRefundsQuery } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/hooks/useSuperadminBillingOverviewMemberRefundsQueries';
import type { SuperadminMemberRefund as Refund } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/types/SuperadminBillingOverviewMemberRefundsPaymentTypes';

import { displayValue } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/utils/SuperadminBillingOverviewMemberRefundsDisplayValue';
import { superadminFinanceFormatCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/utils/SuperadminBillingOverviewMemberRefundsFormatters';
import { groupSuperadminMemberRefundTotalsByCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/utils/SuperadminBillingOverviewMemberRefundsRefundTotalsUtilities';

import { SUPERADMIN_FINANCE_REFUNDS_PAGE_CLIENT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/constants/SuperadminBillingOverviewMemberRefundsStaticConstants';

const REFUND_SKELETON_ROW_KEYS = Array.from({ length: 5 }, (_, position) => `refunds-skeleton-row-${position + 1}`);
const REFUND_SKELETON_CELL_KEYS = Array.from({ length: 7 }, (_, position) => `refunds-skeleton-cell-${position + 1}`);







/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberRefundsPageClient`.
 * Owns local UI state for `statusFilter`.
 * Reads module-owned query state and must keep loading, error, empty, and retry behavior distinct where the query exposes those states.
 */
export default function SuperadminBillingOverviewMemberRefundsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useSuperadminBillingOverviewMemberRefundsUrlFilter('refundStatus', 'all');
  const refundsQuery = useSuperadminBillingOverviewMemberRefundsQuery();
  const allRefunds: Refund[] = refundsQuery.data ?? [];
  
  const loadError = refundsQuery.isError ? tCopy('COPY.REFUND_RECORDS_COULD_NOT_BE_LOADED_RETRY_AFTER_VERIFYING_HOST_API_CONFIGURATION') : '';



  const filtered = allRefunds.filter((r) => statusFilter === 'all' || r.status === statusFilter);
  let totalRefundedByCurrency: Array<{ currencyCode: string; amountMinor: number }> = [];
  let totalRefundedOverflow = false;
  try {
    totalRefundedByCurrency = groupSuperadminMemberRefundTotalsByCurrency(allRefunds);
  } catch {
    totalRefundedOverflow = true;
  }
  const totalRefundedLabel = totalRefundedOverflow
    ? tCopy('COPY.VALIDATION_REFUND_TOTAL_OVERFLOW')
    : totalRefundedByCurrency.length
      ? totalRefundedByCurrency.map(({ amountMinor, currencyCode }) => superadminFinanceFormatCurrency(amountMinor, currencyCode, locale)).join(' · ')
      : '—';
  const pendingCount = allRefunds.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {(filtered?.length === 0) && <SuperadminBillingOverviewMemberRefundsEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.REFUNDS")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.MANAGE_AND_PROCESS_STUDENT_DEPOSIT_REFUND_REQUESTS")}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tCopy("COPY.TOTAL_REFUNDED")}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--success">{refundsQuery.isPending ? '—' : totalRefundedLabel}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tCopy("COPY.PENDING_2")}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--warning">{refundsQuery.isPending ? '—' : pendingCount}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tCopy("COPY.APPROVED")}</p>
          <p className="fin-stat-mini__value">{refundsQuery.isPending ? '—' : allRefunds.filter((r) => r.status === 'approved').length}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tCopy("COPY.REJECTED")}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--danger">{refundsQuery.isPending ? '—' : allRefunds.filter((r) => r.status === 'rejected').length}</p>
        </div>
      </div>

      {loadError && <p className="rounded-lg border border-border bg-danger-bg p-3 text-sm text-danger" role="alert">{loadError} <button type="button" className="underline" onClick={() => void refundsQuery.refetch()} data-testid="superadmin-finance-finance-refunds-retry-1">{tCopy("COPY.RETRY")}</button></p>}
      <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.REFUND_RECORDS_ARE_DISPLAYED_AS_RETURNED_BY_THE_HOST_API_PROCESS_D_127A1A9B")}</p>
      <div className="fin-filter-bar">
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} data-testid="superadmin-finance-finance-refunds-status-filter-2">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="pending">{tCopy("COPY.PENDING_2")}</option>
          <option value="approved">{tCopy("COPY.APPROVED")}</option>
          <option value="processed">{tCopy("COPY.PROCESSED")}</option>
          <option value="rejected">{tCopy("COPY.REJECTED")}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.REQUESTED_DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DEPOSIT_HELD")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DEDUCTION")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.NET_REFUND")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {refundsQuery.isPending ? (
              REFUND_SKELETON_ROW_KEYS.map((skeletonRowKey) => (
                <tr key={skeletonRowKey} className="fin-table-row">
                  {REFUND_SKELETON_CELL_KEYS.map((skeletonCellKey) => (
                    <td key={skeletonCellKey} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">💸</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_PENDING_REFUNDS")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{r.studentName}</div>
                    <div className="fin-cell-subtext">{displayValue(r.smartId)}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{displayValue(r.requestedDate)}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{displayValue(r.depositHeldMinor == null ? null : tCopy('COPY.FINANCIAL_DETAIL_ONLY'))}</td>
                  <td className={`py-3 px-4 text-right ${(r.deductionAmountMinor ?? 0) > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {displayValue(r.deductionAmountMinor == null ? null : r.deductionAmountMinor > 0 ? tCopy('COPY.FINANCIAL_DETAIL_ONLY') : tCopy('COPY.NONE'))}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-success">{displayValue(tCopy('COPY.FINANCIAL_DETAIL_ONLY'))}</td>
                  <td className="py-3 px-4">
                    <span className={SUPERADMIN_FINANCE_REFUNDS_PAGE_CLIENT_STATUS_BADGE[r.status] || 'fin-badge fin-badge--neutral'}>{tCopy(r.status === 'processed' ? 'COPY.PROCESSED' : r.status === 'pending' ? 'COPY.PENDING_2' : r.status === 'approved' ? 'COPY.APPROVED' : r.status === 'rejected' ? 'COPY.REJECTED' : 'COPY.UNKNOWN_STATUS')}</span>
                    {r.status === 'rejected' && r.rejectionReason && (
                      <div className="fin-cell-subtext mt-1 max-w-32 truncate">{r.rejectionReason}</div>
                    )}
                    {r.status === 'processed' && r.processedDate && (
                      <div className="fin-cell-subtext mt-1">{r.processedDate} · {r.paymentMethod}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === 'pending' && (
                        <>
                          <button type="button"
                            className="fin-badge fin-badge--neutral cursor-not-allowed opacity-60"
                            disabled
                            title={tCopy("COPY.UNAVAILABLE_NO_APPROVED_REFUND_WRITE_API_CONTRACT_IS_SUPPLIED_NO_R_3C3133C6")}
                            aria-label={tCopy("COPY.REFUND_UNAVAILABLE_ARIA_LABEL", { name: r.studentName })}
                           data-testid={`superadmin-finance-finance-refunds-unavailable-no-approved-refund-write-api-contract-is-supplied-no-r-3-c3133-c6-3-${String(r.id)}`}>
                            {tCopy("COPY.REFUND_UNAVAILABLE")}</button>
                          <button type="button"
                            className="fin-badge fin-badge--neutral cursor-not-allowed opacity-60"
                            disabled
                            title={tCopy("COPY.UNAVAILABLE_NO_APPROVED_REFUND_ADJUSTMENT_API_CONTRACT_IS_SUPPLIED_2E10437D")}
                            aria-label={tCopy("COPY.DEDUCTION_UNAVAILABLE_ARIA_LABEL", { name: r.studentName })}
                           data-testid={`superadmin-finance-finance-refunds-unavailable-no-approved-refund-adjustment-api-contract-is-supplied-2-e10437-d-4-${String(r.id)}`}>
                            {tCopy("COPY.DEDUCTION_UNAVAILABLE")}</button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button type="button"
                          className="fin-badge fin-badge--neutral cursor-not-allowed opacity-60"
                          disabled
                          title={tCopy("COPY.UNAVAILABLE_NO_APPROVED_REFUND_WRITE_API_CONTRACT_IS_SUPPLIED_NO_R_3C3133C6")}
                          aria-label={tCopy("COPY.REFUND_PROCESSING_UNAVAILABLE_ARIA_LABEL", { name: r.studentName })}
                         data-testid={`superadmin-finance-finance-refunds-unavailable-no-approved-refund-write-api-contract-is-supplied-no-r-3-c3133-c6-5-${String(r.id)}`}>
                          {tCopy("COPY.PROCESSING_UNAVAILABLE")}</button>
                      )}
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
