'use client';
import { useTranslations } from 'next-intl';
import { useManagerPaymentsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_payments/hooks/useManagerFinancePaymentsUrlFilters';
import ManagerFinancePaymentsNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_payments/components/manager_finance_payments_table_parts/ManagerFinancePaymentsNativeTable';

import { useManagerPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_payments/hooks/ManagerFinancePaymentsFormattingHook';
import { useMemo } from 'react';
import { FileText, Receipt, Trash2 } from 'lucide-react';
import { useManagerFinancePayments } from '@/app/frontend_manager/manager_finance/finance_payments/hooks/useManagerFinancePaymentsPayments';
import type { ManagerFinancePaymentsPayment, ManagerFinancePaymentsPaymentMode } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsTypes';
import { sanitizeManagerPaymentsCsvCell } from '@/app/frontend_manager/manager_finance/finance_payments/utils/ManagerFinancePaymentsCsv';
import { ManagerFinancePaymentsEmptyState } from '@/app/frontend_manager/manager_finance/finance_payments/components/manager_finance_payments_empty_states/ManagerFinancePaymentsEmptyState';
import type { ManagerFinancePaymentsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsComponentTypes';



// RESPONSIBILITY: Render the manager finance finance payments feature view and preserve route query context.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.

const URL_FILTERS = {
  mode: { defaultValue: 'all', allowedValues: ['all', 'cash', 'upi', 'card', 'bank'] },
  showDeleted: { defaultValue: 'false', allowedValues: ['false', 'true'] },
} as const;

const MODE_BADGE: Record<ManagerFinancePaymentsPaymentMode, string> = {
  cash: 'fin-badge fin-badge--cash', upi: 'fin-badge fin-badge--upi', card: 'fin-badge fin-badge--card', bank: 'fin-badge fin-badge--bank', unknown: 'fin-badge fin-badge--neutral',
};

function downloadCsv(rows: ManagerFinancePaymentsPayment[], formatAmount: (amountMinor: number, currencyCode?: string) => string): void {
  const header = ['Receipt', 'Date', 'Student', 'Smart ID', 'Amount', 'Mode', 'Transaction ID', 'Late Fee', 'Received By', 'Status'];
  const body = rows.map((row) => [row.receiptNumber ?? '', row.date, row.studentName, row.smartId, row.currency ? formatAmount(row.amount, row.currency) : '', row.mode === 'unknown' ? '' : row.mode, row.txnId ?? '', row.currency && row.lateFee !== undefined ? formatAmount(row.lateFee, row.currency) : '', row.receivedBy, row.status]);
  const csv = [header, ...body].map((line) => line.map(sanitizeManagerPaymentsCsvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'manager-finance-payments.csv'; anchor.click(); URL.revokeObjectURL(url);
}


export default function ManagerFinancePaymentsPage(_routeQuery: ManagerFinancePaymentsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_payments.ui');
  const { formatCurrency, formatDate } = useManagerPaymentsFormatting();
  const paymentsQuery = useManagerFinancePayments();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerPaymentsUrlFilters(URL_FILTERS);
  const modeFilter = urlFilters.mode as 'all' | ManagerFinancePaymentsPaymentMode;
  const showDeleted = urlFilters.showDeleted === 'true';

  const visible = useMemo(() => (paymentsQuery.data ?? []).filter((payment) => (modeFilter === 'all' || payment.mode === modeFilter) && (showDeleted || payment.status !== 'deleted')), [paymentsQuery.data, modeFilter, showDeleted]);

  const colDefs = useMemo<NativeColumn<ManagerFinancePaymentsPayment>[]>(() => [
    { field: 'receiptNumber', headerName: tManagerUi('receipt_097d66'), width: 150, cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => <span className={`fin-mono font-medium ${params.data?.status === 'deleted' ? 'line-through opacity-50' : ''}`}>{params.value || '—'}</span> },
    { field: 'date', headerName: tManagerUi('date'), width: 120, valueFormatter: (params) => formatDate(String(params.value ?? '')) },
    { field: 'studentName', headerName: tManagerUi('student'), flex: 1, minWidth: 180, cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => <div className={params.data?.status === 'deleted' ? 'opacity-50' : ''}><div className="fin-cell-name">{params.value}</div><div className="fin-cell-subtext">{params.data?.smartId}</div></div> },
    { field: 'amount', headerName: tManagerUi('amount_43dc85'), width: 130, type: 'rightAligned', valueFormatter: (params) => params.data?.currency && typeof params.value === 'number' ? formatCurrency(params.value, params.data.currency) : '—' },
    { field: 'mode', headerName: tManagerUi('mode'), width: 110, cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => <span className={MODE_BADGE[params.value as ManagerFinancePaymentsPaymentMode] ?? 'fin-badge fin-badge--neutral'}>{params.value === 'unknown' || !params.value ? tManagerUi('unknown_payment_mode') : String(params.value)}</span> },
    { field: 'txnId', headerName: tManagerUi('txn_id_8a207d'), width: 130, cellRenderer: (params) => <span className="fin-mono">{String(params.value ?? '—')}</span> },
    { field: 'lateFee', headerName: tManagerUi('late_fee'), width: 110, type: 'rightAligned', cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => params.data?.currency && typeof params.value === 'number' ? <span className={params.value > 0 ? 'fin-text-warning' : 'fin-text-muted'}>{formatCurrency(params.value, params.data.currency)}</span> : <span className="fin-text-muted">—</span> },
    { field: 'status', headerName: tManagerUi('status'), width: 120, cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => params.value === 'valid' ? <span className="fin-badge fin-badge--success">{tManagerUi('valid')}</span> : params.value === 'deleted' ? <span className="fin-badge fin-badge--neutral">{tManagerUi('deleted')}</span> : <span className="fin-badge fin-badge--neutral">{tManagerUi('unknown_status')}</span> },
    { headerName: tManagerUi('actions'), width: 145, sortable: false, filter: false, cellRenderer: (params: NativeCellParams<ManagerFinancePaymentsPayment>) => params.data?.status !== 'valid' ? null : <div className="flex items-center gap-2"><button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('no_authoritative_receipt_data_is_available')} aria-label={tManagerUi('view_receipt')}><Receipt size={14} /></button><button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('no_authoritative_invoice_data_is_available')} aria-label={tManagerUi('view_invoice')}><FileText size={14} /></button><button type="button" className="fin-badge fin-badge--danger cursor-not-allowed" disabled title={tManagerUi('void_unavailable_verified_api_contract_not_supplied')} aria-label={tManagerUi('void_payment_unavailable')}><Trash2 size={14} /></button></div> },
  ], [formatCurrency, formatDate, tManagerUi]);



  return <>
<div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div><h1 className="fin-page-title">{tManagerUi('payment_history')}</h1><p className="fin-page-subtitle">{tManagerUi('complete_payment_ledger_with_audit_trail')}</p><p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-payment-fields-warning">{tManagerUi('finance_fields_not_inferred')}</p></div>
      <div className="fin-filter-bar"><select aria-label={tManagerUi('filter_by_payment_mode')} className="fin-select w-40" value={modeFilter} onChange={(event) => setUrlFilter('mode', event.target.value)}><option value="all">{tManagerUi('all_modes')}</option><option value="cash">{tManagerUi('cash')}</option><option value="upi">{tManagerUi('upi')}</option><option value="card">{tManagerUi('card')}</option><option value="bank">{tManagerUi('bank_transfer')}</option></select><div className="flex items-center gap-2"><button type="button" aria-label={tManagerUi('show_deleted')} aria-pressed={showDeleted} className={`fin-switch ${showDeleted ? 'fin-switch--on' : 'fin-switch--off'}`} onClick={() => setUrlFilter('showDeleted', showDeleted ? 'false' : 'true')}><span className="fin-switch__thumb" aria-hidden="true" /></button><span className="fin-text-muted">{tManagerUi('show_deleted')}</span></div><button className="fin-badge fin-badge--neutral cursor-pointer ml-auto" type="button" onClick={() => downloadCsv(visible, formatCurrency)}>{tManagerUi('export_csv')}</button></div>
      <div className="fin-card p-4">
        {paymentsQuery.isPending ? <div className="fin-skeleton h-80 w-full" /> : paymentsQuery.isError ? <div className="fin-empty-state"><p className="fin-empty-state__title">{tManagerUi('unable_to_load_payments')}</p><button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => paymentsQuery.refetch()}>{tManagerUi('retry')}</button></div> : visible.length === 0 ? <ManagerFinancePaymentsEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">{tManagerUi('inr')}</div><p className="fin-empty-state__title">{tManagerUi('no_payments_found')}</p></ManagerFinancePaymentsEmptyState> : <div className="mgr-table-wrapper h-96"><ManagerFinancePaymentsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_payments_found')} rows={visible} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} /></div>}
      </div>
    </div>
  </>;
}
