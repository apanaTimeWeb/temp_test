'use client';
// RESPONSIBILITY: AdminFinancePaymentsPage component owned by admin_finance; responsibility folder: components.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinancePaymentsQuery from '@/app/frontend_admin/admin_finance/finance_payments/hooks/useAdminFinancePaymentsQuery';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FileText, Receipt, Search, Calendar, Download, TrendingUp, CreditCard, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminFinancePaymentApiRecord } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
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
    branch: (record as Record<string, unknown>).branch as string | undefined,
  };
}

export function AdminFinancePaymentsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-finance-admin-finance-payments-page-1-page', 0);

  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const router = useRouter();
  const [modeFilter, setModeFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinancePayment['mode']>('modeFilter', 'all', { validValues: ['all', 'cash', 'upi', 'card', 'bank', 'unknown'] });
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const paymentsQuery = useAdminFinancePaymentsQuery();
  const allPayments = useMemo(() => (paymentsQuery.data ?? []).map(mapAdminFinancePayment), [paymentsQuery.data]);
  const isPending = paymentsQuery.isPending;
  const loadError = paymentsQuery.isError ? t('PAYMENT_LOAD_ERROR') : null;

  const visible = useMemo(() => allPayments.filter((payment) => {
    const branchMatch = isAllBranches || !selectedBranch || !payment.branch || payment.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
    const modeMatch = modeFilter === 'all' || payment.mode === modeFilter;
    const deletedMatch = showDeleted || payment.status !== 'deleted';
    const q = search.trim().toLowerCase();
    const searchMatch = !q ||
      payment.studentName.toLowerCase().includes(q) ||
      payment.smartId.toLowerCase().includes(q) ||
      payment.receiptNumber.toLowerCase().includes(q) ||
      (payment.txnId && payment.txnId.toLowerCase().includes(q));

    // Time-range filter
    let dateMatch = true;
    if (timeRange !== 'all' && payment.date) {
      const payDate = new Date(payment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') {
        const todayEnd = new Date(today); todayEnd.setHours(23, 59, 59, 999);
        dateMatch = payDate >= today && payDate <= todayEnd;
      } else if (timeRange === 'this_week') {
        const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
        dateMatch = payDate >= weekStart;
      } else if (timeRange === 'this_month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateMatch = payDate >= monthStart;
      } else if (timeRange === 'custom') {
        if (customStartDate) dateMatch = dateMatch && payDate >= new Date(customStartDate);
        if (customEndDate) { const end = new Date(customEndDate); end.setHours(23,59,59,999); dateMatch = dateMatch && payDate <= end; }
      }
    }

    return branchMatch && modeMatch && deletedMatch && searchMatch && dateMatch;
  }), [allPayments, modeFilter, showDeleted, search, isAllBranches, selectedBranch, timeRange, customStartDate, customEndDate]);

  const timeRangeLabel = useMemo(() => {
    return timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';
  }, [timeRange]);

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
    {
      headerName: t('ACTIONS'),
      width: 170,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) =>
        params.data.status === 'valid' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => router.push(ADMIN_FINANCE_PAYMENTS_ROUTES.RECEIPT(params.data.id))}
              aria-label={t('VIEW_RECEIPT', { number: params.data.receiptNumber })}
            >
              <Receipt size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => router.push(ADMIN_FINANCE_PAYMENTS_ROUTES.INVOICE(params.data.id))}
              aria-label={t('VIEW_INVOICE', { number: params.data.receiptNumber })}
            >
              <FileText size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-success-text hover:bg-success-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Share receipt via WhatsApp"
              aria-label={`Share receipt ${params.data.receiptNumber} with ${params.data.studentName} on WhatsApp`}
              onClick={() => {
                const text = `Hello ${params.data.studentName}, thank you for your payment!\nReceipt No: ${params.data.receiptNumber}\nDate: ${formatDate(params.data.date)}\nAmount: ${formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit)}\nMode: ${params.data.mode.toUpperCase()}\nStatus: Verified & Confirmed.\nSmart Library Admin`;
                const popup = window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
              }}
            >
              <MessageSquare size={18} strokeWidth={2} />
            </button>
          </div>
        ) : null,
    },
  ], [router, t]);

  return (
    <div className="space-y-6 pb-10">
      {/* Executive Header with Global Time-Range Filter */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-info-bg px-2.5 py-0.5 text-xs font-semibold text-info-text">
                <CreditCard className="h-3.5 w-3.5" />
                Finance / Ledger
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAYMENT_TITLE')}</h1>
            <p className="text-sm text-text-secondary">
              {t('PAYMENT_SUBTITLE')} • Scope: <span className="font-semibold text-primary">{timeRangeLabel}</span>
            </p>
          </div>

          {/* Time Horizon Pill Bar */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center rounded-lg bg-surface-muted p-1 border border-border">
              {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setTimeRange(r); setUrlTablePage0(0); }}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    timeRange === r
                      ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : <><Calendar className="h-3 w-3" />Custom</>}
                </button>
              ))}
            </div>
            {timeRange === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                <span className="text-text-muted">to</span>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-sm backdrop-blur-sm">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search student, smart ID, receipt, txn ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setUrlTablePage0(0); }}
            className="min-h-9 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <label className="sr-only" htmlFor="finance-payment-mode">{t('FILTER_PAYMENT_MODE')}</label>
        <select
          id="finance-payment-mode"
          className="min-h-9 rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-36"
          value={modeFilter}
          onChange={(event) => setModeFilter(event.target.value as 'all' | AdminFinancePayment['mode'])}
        >
          <option value="all">{t('ALL_MODES')}</option>
          <option value="cash">{t('CASH')}</option>
          <option value="upi">{t('UPI')}</option>
          <option value="card">{t('CARD')}</option>
          <option value="bank">{t('BANK_TRANSFER')}</option>
          <option value="unknown">{t('UNKNOWN_UNAVAILABLE')}</option>
        </select>
        <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} className="rounded" />
          {t('SHOW_DELETED')}
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-muted">Showing {visible.length} of {allPayments.length} ({timeRangeLabel})</span>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleExport}
            disabled={isPending || Boolean(loadError)}
            aria-label={t('EXPORT_ARIA')}
          >
            <Download size={14} strokeWidth={2} />
            {t('EXPORT_CSV')}
          </button>
        </div>
      </div>

      {/* Data Grid */}
      {loadError ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center" role="alert">
          <p className="text-section-title font-semibold text-text-primary">{t('PAYMENT_UNABLE')}</p>
          <p className="text-caption text-text-secondary">{loadError}</p>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover mt-3" onClick={() => void paymentsQuery.refetch()} disabled={paymentsQuery.isFetching}>{t('RETRY')}</button>
        </div>
      ) : isPending ? (
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" role="status" aria-label={t('LOADING_PAYMENTS')}>
          <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-96 w-full" />
        </div>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-96" aria-busy={false}>
            <DataGrid
              rowData={visible}
              columnDefs={columns}
              rowHeight={56}
              pagination
              pageSize={25}
              emptyMessage={visible.length === 0 && allPayments.length > 0 ? `No payments found for ${timeRangeLabel}.` : t('PAYMENT_EMPTY')}
              page={urlTablePage0}
              onPageChange={setUrlTablePage0}
            />
          </div>
          <p className="text-caption text-text-secondary mt-2 px-4 pb-3">{t('MOBILE_PAYMENT_NOTE')}</p>
        </div>
      )}
    </div>
  );
}
