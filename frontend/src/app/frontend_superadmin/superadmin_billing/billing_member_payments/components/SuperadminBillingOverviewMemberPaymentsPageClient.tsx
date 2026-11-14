'use client';
import SuperadminBillingOverviewMemberPaymentsEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsEmptyState';
/** Responsibility: Superadmin Finance Payments Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberPaymentsPageClient -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBillingOverviewMemberPaymentsSemanticTable from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsSemanticTable';

import { useSuperadminBillingOverviewMemberPaymentsUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsUrlFilter';

import { useLocale, useTranslations } from 'next-intl';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config";
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsSemanticTable';
type ICellRendererParams = SemanticCellParams<Payment>;
import { useState } from 'react';
import { useSuperadminBillingOverviewMemberPaymentsQuery } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsQueries';
import { useRouter } from 'next/navigation';

import { displayValue } from '@/lib/display_value';
import { superadminFinanceFormatCurrency, formatDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/utils/SuperadminBillingOverviewMemberPaymentsFormatters';
import { Receipt, Trash2, FileText } from 'lucide-react';


import type { SuperadminMemberPayment as Payment } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types';
import { SUPERADMIN_FINANCE_PAYMENTS_PAGE_CLIENT_MODE_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/constants/superadmin_billing_member_payments.constants';

const PAYMENT_SKELETON_KEYS = Array.from({ length: 6 }, (_, position) => `payment-skeleton-${position + 1}`);






/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberPaymentsPageClient`.
 * Owns local UI state for `modeFilter`, `showDeleted`.
 * Reads module-owned query state and must keep loading, error, empty, and retry behavior distinct where the query exposes those states.
 */
export default function SuperadminBillingOverviewMemberPaymentsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const router = useRouter();
  const [modeFilter, setModeFilter] = useSuperadminBillingOverviewMemberPaymentsUrlFilter('paymentMode', 'all');
  const [showDeleted, setShowDeleted] = useState(false);
  const paymentsQuery = useSuperadminBillingOverviewMemberPaymentsQuery();
  const loadError = paymentsQuery.isError ? tCopy('COPY.PAYMENT_RECORDS_COULD_NOT_BE_LOADED_RETRY_AFTER_VERIFYING_HOST_API_CONFIGURATION') : '';
  const allPayments: Payment[] = paymentsQuery.data ?? [];

  const visible = allPayments.filter((p) => {
    const modeMatch = modeFilter === 'all' || p.mode === modeFilter;
    const deletedMatch = showDeleted || p.status !== 'deleted';
    return modeMatch && deletedMatch;
  });

  const colDefs = [
    { 
      field: 'receiptNumber', 
      headerName: tCopy("COPY.TABLE_COLUMN_RECEIPT"), 
      width: 150,
      cellRenderer: (params: ICellRendererParams) => (
        <span className={`fin-mono font-medium ${params.data.status === 'deleted' ? 'line-through opacity-50' : ''}`}>
          {displayValue(params.value)}
        </span>
      )
    },
    { 
      field: 'date', 
      headerName: tCopy("COPY.DATE"), 
      width: 120,
      valueFormatter: (p: ICellRendererParams) => displayValue(p.value == null ? null : formatDate(typeof p.value === 'string' ? p.value : String(p.value), locale))
    },
    { 
      field: 'studentName', 
      headerName: tCopy("COPY.STUDENT"), 
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: ICellRendererParams) => (
        <div className={`py-1 ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}>
          <div className="fin-cell-name">{displayValue(params.value)}</div>
          <div className="fin-cell-subtext">{displayValue(params.data.smartId)}</div>
        </div>
      )
    },
    { 
      field: 'amountMinor', 
      headerName: tCopy("COPY.AMOUNT"), 
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      valueFormatter: (p: ICellRendererParams) => p.value == null ? displayValue(null) : tCopy('COPY.FINANCIAL_DETAIL_ONLY')
    },
    { 
      field: 'mode', 
      headerName: tCopy("COPY.MODE"), 
      width: 110,
      cellRenderer: (params: ICellRendererParams) => (
        <div className={`h-full flex items-center ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}>
          <span className={SUPERADMIN_FINANCE_PAYMENTS_PAGE_CLIENT_MODE_BADGE[String(params.value ?? '')] || 'fin-badge fin-badge--neutral'}>{tCopy(params.value === 'cash' ? 'COPY.CASH' : params.value === 'upi' ? 'COPY.UPI' : params.value === 'card' ? 'COPY.CARD' : params.value === 'bank' ? 'COPY.BANK_TRANSFER' : 'COPY.UNKNOWN_STATUS')}</span>
        </div>
      )
    },
    { field: 'txnId', headerName: tCopy("COPY.TABLE_COLUMN_TXN_ID"), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="fin-mono">{displayValue(p.value)}</span> },
    { 
      field: 'lateFeeMinor', 
      headerName: tCopy("COPY.LATE_FEE"), 
      width: 110,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: ICellRendererParams) => (
        <span className={Number(p.value ?? 0) > 0 ? 'fin-text-warning' : 'fin-text-muted'}>
          {p.value == null ? displayValue(null) : superadminFinanceFormatCurrency(typeof p.value === 'number' ? p.value : Number(p.value), p.data.currencyCode, locale)}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: tCopy("COPY.STATUS"), 
      width: 130,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex flex-col justify-center py-1">
          {params.value === 'valid' ? (
            <span className="fin-badge fin-badge--success self-start">{tCopy("COPY.VALID")}</span>
          ) : params.value === 'deleted' ? (
            <span className="fin-badge fin-badge--neutral self-start">{tCopy("COPY.VOID")}</span>
          ) : (
            <span className="fin-badge fin-badge--neutral self-start">{tCopy('COPY.UNKNOWN_STATUS')}</span>
          )}
          {(params.value === 'deleted') && params.data.deletionReason && (
            <div className="fin-cell-subtext mt-1 text-xs leading-tight" title={params.data.deletionReason}>
              {params.data.deletionReason.length > 15 ? params.data.deletionReason.substring(0, 15) + '...' : params.data.deletionReason}
            </div>
          )}
        </div>
      )
    },
    {
      headerName: tCopy("COPY.ACTIONS"),
      width: 140,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => {
        if (params.data.status !== 'valid') return null;
        return (
          <div className="flex items-center gap-2 h-full">
            <button type="button"
              className="fin-badge fin-badge--neutral cursor-pointer hover:border-focus"
              onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS.RECEIPT_DETAIL_PAGE(String(params.data.id)))}
              title={tCopy("COPY.VIEW_RECEIPT")}
              aria-label={tCopy("COPY.VIEW_RECEIPT")}
             data-testid={`superadmin-finance-finance-payments-view-receipt-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
              <Receipt size={18} />
            </button>
            <button type="button"
              className="fin-badge fin-badge--neutral cursor-pointer hover:border-focus"
              onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_MODULE_URLS.INVOICE_DETAIL_PAGE(String(params.data.id)))}
              title={tCopy("COPY.VIEW_INVOICE")}
              aria-label={tCopy("COPY.VIEW_INVOICE")}
             data-testid={`superadmin-finance-finance-payments-view-invoice-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
              <FileText size={18} />
            </button>
            <button type="button"
              className="fin-badge fin-badge--danger cursor-not-allowed opacity-50"
              disabled
              aria-label={tCopy("COPY.PAYMENT_VOID_UNAVAILABLE_ARIA_LABEL", { receipt: params.data.receiptNumber })}
              title={tCopy("COPY.PAYMENT_VOID_UNAVAILABLE_NO_APPROVED_API_CONTRACT_IS_SUPPLIED")}
             data-testid={`superadmin-finance-finance-payments-payment-void-unavailable-aria-label-3-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">{tCopy("COPY.PAYMENT_HISTORY")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.COMPLETE_PAYMENT_LEDGER_WITH_AUDIT_TRAIL")}</p>
      </div>

      <div className="fin-filter-bar">
        <select aria-label={tCopy("COPY.MODE_FILTER")} className="fin-select w-40" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} data-testid="superadmin-finance-finance-payments-mode-filter-4">
          <option value="all">{tCopy("COPY.ALL_MODES")}</option>
          <option value="cash">{tCopy("COPY.CASH")}</option>
          <option value="upi">{tCopy("COPY.UPI")}</option>
          <option value="card">{tCopy("COPY.CARD")}</option>
          <option value="bank">{tCopy("COPY.BANK_TRANSFER")}</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={tCopy("COPY.SHOW_DELETED_PAYMENTS")}
            aria-pressed={showDeleted}
            className={`fin-switch ${showDeleted ? 'fin-switch--on' : 'fin-switch--off'}`}
            onClick={() => setShowDeleted((v) => !v)}
           data-testid="superadmin-finance-finance-payments-show-deleted-payments-5">
            <span className="fin-switch__thumb" />
          </button>
          <span className="fin-text-muted">{tCopy("COPY.SHOW_DELETED")}</span>
        </div>
        <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_DATA_EXPORT_PERMISSION_CONTRACT_IS_SUPPLIED")} className="fin-badge fin-badge--neutral ml-auto opacity-60 cursor-not-allowed" data-testid="superadmin-finance-finance-payments-unavailable-no-verified-data-export-permission-contract-is-supplied-6">{tCopy("COPY.EXPORT_UNAVAILABLE")}</button>
      </div>

      <div className="fin-card p-4">
        {paymentsQuery.isPending && (
          <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
            <p className="fin-text-muted">{tCopy("COPY.LOADING_PAYMENT_RECORDS")}</p>
            {PAYMENT_SKELETON_KEYS.map((skeletonKey) => (
              <div key={skeletonKey} className="h-12 rounded-lg bg-surface-highlight motion-safe:animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            ))}
          </div>
        )}
        {paymentsQuery.isError && (
          <div className="fin-empty-state" role="alert">
            <p>{loadError}</p>
            <button type="button" className="fin-badge fin-badge--neutral mt-3" onClick={() => void paymentsQuery.refetch()} data-testid="superadmin-finance-finance-payments-retry-payment-records-7">
              {tCopy("COPY.RETRY")}
            </button>
          </div>
        )}
        {!paymentsQuery.isPending && !paymentsQuery.isError && visible.length === 0 && (
          <div className="fin-empty-state" role="status">
            {allPayments.length === 0 ? <SuperadminBillingOverviewMemberPaymentsEmptyState /> : <SuperadminBillingOverviewMemberPaymentsEmptyState filtered />}
          </div>
        )}
        {!paymentsQuery.isPending && !paymentsQuery.isError && visible.length > 0 && (
          <div className="mgr-table-wrapper h-125">
            <SuperadminBillingOverviewMemberPaymentsSemanticTable
              rowData={visible}
              columnDefs={colDefs}
              rowHeight={56}
              headerHeight={48}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
            />
          </div>
        )}
      </div>


    </div>
  );
}
