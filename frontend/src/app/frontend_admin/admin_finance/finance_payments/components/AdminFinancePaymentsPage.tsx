'use client';
// RESPONSIBILITY: AdminFinancePaymentsPage component owned by admin_finance; responsibility folder: components.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinancePaymentsQuery from '@/app/frontend_admin/admin_finance/finance_payments/hooks/useAdminFinancePaymentsQuery';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminFinancePaymentApiRecord } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { ADMIN_FINANCE_PAYMENTS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.url_config';
import { buildAdminFinancePaymentsCsv } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsCsvUtils';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';


const ADMIN_FINANCE_MODE_BADGE: Record<AdminFinancePayment['mode'], string> = {
  cash: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-cash-bg text-pay-cash border-border',
  upi: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-upi-bg text-pay-upi border-border',
  card: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-card-bg text-pay-card border-border',
  bank: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-bank-bg text-pay-bank border-border',
  unknown: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border',
};

function mapAdminFinancePayment(record: AdminFinancePaymentApiRecord): AdminFinancePayment {
  const normalizedStatus = record.status?.trim().toLowerCase();
  const status: AdminFinancePayment['status'] = normalizedStatus === 'completed' || normalizedStatus === 'valid' || normalizedStatus === 'paid'
    ? 'valid'
    : normalizedStatus === 'deleted' || normalizedStatus === 'void' || normalizedStatus === 'reversed'
      ? 'deleted'
      : 'unknown';
  return {
    id: record.id,
    receiptNumber: record.receiptNumber ?? '—',
    date: record.date,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    amount: record.amount,
    currencyCode: record.currencyCode,
    amountUnit: record.amountUnit,
    mode: record.mode ?? 'unknown',
    txnId: record.txnId,
    lateFee: record.lateFee,
    receivedBy: record.receivedBy ?? '—',
    status,
    deletionReason: record.deletionReason,
  };
}

export function AdminFinancePaymentsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-finance-admin-finance-payments-page-1-page', 0);

  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const router = useRouter();
  const [modeFilter, setModeFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinancePayment['mode']>('modeFilter', 'all', { validValues: ['all', 'cash', 'upi', 'card', 'bank', 'unknown'] });
  const [showDeleted, setShowDeleted] = useState(false);
  const paymentsQuery = useAdminFinancePaymentsQuery();
  const allPayments = useMemo(() => (paymentsQuery.data ?? []).map(mapAdminFinancePayment), [paymentsQuery.data]);
  const isPending = paymentsQuery.isPending;
  const loadError = paymentsQuery.isError ? t('PAYMENT_LOAD_ERROR') : null;

  const visible = useMemo(() => allPayments.filter((payment) => {
    const modeMatch = modeFilter === 'all' || payment.mode === modeFilter;
    const deletedMatch = showDeleted || payment.status !== 'deleted';
    return modeMatch && deletedMatch;
  }), [allPayments, modeFilter, showDeleted]);

  const handleExport = () => {
    const csv = buildAdminFinancePaymentsCsv(visible, { receipt: t('CSV_RECEIPT'), date: t('CSV_DATE'), student: t('CSV_STUDENT'), smartId: t('CSV_SMART_ID'), amount: t('CSV_AMOUNT'), currency: t('CSV_CURRENCY'), amountUnit: t('CSV_AMOUNT_UNIT'), mode: t('CSV_MODE'), lateFee: t('CSV_LATE_FEE'), receivedBy: t('CSV_RECEIVED_BY'), status: t('CSV_STATUS') });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'admin-finance-payments.csv';
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    toast.success(t('CSV_DOWNLOADED'), { id: 'admin_finance-finance_payments-components-AdminFinancePaymentsPage-toast-98-1' });
  };

  const columns = useMemo<readonly DataGridColumn<AdminFinancePayment>[]>(() => [
    { field: 'receiptNumber', headerName: t('RECEIPT_NUMBER'), width: 150, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={`font-mono text-caption text-text-secondary font-medium ${params.data.status === 'deleted' ? 'line-through opacity-50' : ''}`}>{String(params.value ?? '—')}</span> },
    { field: 'date', headerName: t('DATE'), width: 120, sortable: true, valueFormatter: (params: DataGridCellParams<AdminFinancePayment>) => formatDate(String(params.value ?? '')) },
    { field: 'studentName', headerName: t('STUDENT'), flex: 1, minWidth: 180, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <div className={`py-1 ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}><div className="text-body font-semibold text-text-primary">{String(params.value ?? '—')}</div><div className="text-caption text-text-secondary">{params.data.smartId}</div></div> },
    { field: 'amount', headerName: t('AMOUNT'), width: 120, sortable: true, valueFormatter: (params: DataGridCellParams<AdminFinancePayment>) => formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit) },
    { field: 'mode', headerName: t('MODE'), width: 110, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={ADMIN_FINANCE_MODE_BADGE[params.data.mode]}>{params.data.mode === 'cash' ? t('CASH') : params.data.mode === 'upi' ? t('UPI') : params.data.mode === 'card' ? t('CARD') : params.data.mode === 'bank' ? t('BANK_TRANSFER') : t('UNKNOWN')}</span> },
    { field: 'txnId', headerName: t('TXN_ID'), width: 130, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className="font-mono text-caption text-text-secondary">{String(params.value ?? '—')}</span> },
    { field: 'lateFee', headerName: t('LATE_FEE'), width: 110, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => { const amount = typeof params.value === 'number' ? params.value : null; return <span className={amount !== null && amount > 0 ? 'text-warning-text' : 'text-text-secondary'}>{amount === null ? '—' : formatAdminFinanceApiAmount(amount, params.data.currencyCode, params.data.amountUnit)}</span>; } },
    { field: 'status', headerName: t('STATUS'), width: 130, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${params.data.status === 'valid' ? 'bg-success-bg text-success-text border-success-bg' : 'bg-card text-text-secondary border-border'}`}>{params.data.status === 'valid' ? t('VALID') : params.data.status === 'deleted' ? t('DELETED') : t('UNKNOWN')}</span> },
    { headerName: t('ACTIONS'), width: 140, sortable: false, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => params.data.status === 'valid' ? <div className="flex items-center gap-2"><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => router.push(ADMIN_FINANCE_PAYMENTS_ROUTES.RECEIPT(params.data.id))} aria-label={t('VIEW_RECEIPT', { number: params.data.receiptNumber })}><Receipt size={18} strokeWidth={2} /></button><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => router.push(ADMIN_FINANCE_PAYMENTS_ROUTES.INVOICE(params.data.id))} aria-label={t('VIEW_INVOICE', { number: params.data.receiptNumber })}><FileText size={18} strokeWidth={2} /></button></div> : null },
  ], [router, t]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-page-title font-bold text-text-primary">{t('PAYMENT_TITLE')}</h1><p className="mt-1 text-body text-text-secondary">{t('PAYMENT_SUBTITLE')}</p></div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="finance-payment-mode">{t('FILTER_PAYMENT_MODE')}</label>
        <select id="finance-payment-mode" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" value={modeFilter} onChange={(event) => setModeFilter(event.target.value as 'all' | AdminFinancePayment['mode'])}>
          <option value="all">{t('ALL_MODES')}</option><option value="cash">{t('CASH')}</option><option value="upi">{t('UPI')}</option><option value="card">{t('CARD')}</option><option value="bank">{t('BANK_TRANSFER')}</option><option value="unknown">{t('UNKNOWN_UNAVAILABLE')}</option>
        </select>
        <label className="flex items-center gap-2 text-text-secondary"><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} />{t('SHOW_DELETED')}</label>
        <button type="button" className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleExport} disabled={isPending || Boolean(loadError)} aria-label={t('EXPORT_ARIA')}>{t('EXPORT_CSV')}</button>
      </div>
      {loadError ? <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center" role="alert"><p className="text-section-title font-semibold text-text-primary">{t('PAYMENT_UNABLE')}</p><p className="text-caption text-text-secondary">{loadError}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover mt-3" onClick={() => void paymentsQuery.refetch()} disabled={paymentsQuery.isFetching}>{t('RETRY')}</button></div> : isPending ? <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" role="status" aria-label={t('LOADING_PAYMENTS')}><div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-96 w-full" /></div> : <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4">
        <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-96" aria-busy={false}>
          <DataGrid rowData={visible} columnDefs={columns} rowHeight={56} pagination pageSize={25} emptyMessage={t('PAYMENT_EMPTY')}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>
        </div>
        <p className="text-caption text-text-secondary mt-2">{t('MOBILE_PAYMENT_NOTE')}</p>
      </div>}
    </div>
  );
}
