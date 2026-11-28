'use client';
// RESPONSIBILITY: AdminFinancePaymentsPage component owned by admin_finance; responsibility folder: components.

import { AdminFinancePaymentInvoiceModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentInvoiceModal';
import { AdminFinancePaymentReceiptModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentReceiptModal';
import { AdminFinancePaymentsKpiGrid } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentsKpiGrid';
import useAdminFinancePaymentsQuery, { FALLBACK_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_payments/hooks/useAdminFinancePaymentsQuery';
import type { AdminFinancePaymentApiRecord } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { buildAdminFinancePaymentsCsv } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsCsvUtils';
import { exportFinancePaymentsExcel, openFinanceMailtoClient, printFinancePaymentsLedger } from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsExports';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { buildWhatsAppLink, downloadPaymentInvoicePdf } from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsPdf';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid, type DataGridCellParams, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Calendar, CreditCard, Download, FileSpreadsheet, FileText, Mail, MessageSquare, Printer, Receipt, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ADMIN_FINANCE_MODE_BADGE: Record<AdminFinancePayment['mode'], string> = {
  cash: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-success-text',
  upi: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-primary',
  card: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-purple-text bg-purple-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-purple-text',
  bank: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-info bg-info-bg px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-info-text',
  unknown: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-text-secondary',
};

const MODE_OPTIONS = ['all', 'cash', 'upi', 'card', 'bank', 'unknown'] as const;
const parseModeFilter = (val: string): (typeof MODE_OPTIONS)[number] =>
  MODE_OPTIONS.find((item) => item === val) ?? 'all';

function mapAdminFinancePayment(record: AdminFinancePaymentApiRecord): AdminFinancePayment {
  const norm = record.status?.trim().toLowerCase();
  const status: AdminFinancePayment['status'] = ['completed', 'valid', 'paid'].includes(norm ?? '') ? 'valid' : ['deleted', 'void', 'reversed'].includes(norm ?? '') ? 'deleted' : 'unknown';
  const rec = record as Record<string, unknown>;
  return {
    id: record.id,
    receiptNumber: record.receiptNumber ?? '—',
    date: record.date,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    amount: record.amount,
    currencyCode: record.currencyCode ?? 'INR',
    amountUnit: record.amountUnit ?? 'major',
    mode: record.mode ?? 'unknown',
    txnId: record.txnId,
    lateFee: record.lateFee,
    receivedBy: record.receivedBy ?? '—',
    status,
    deletionReason: record.deletionReason,
    branch: rec.branch as string | undefined,
    studentPhone: (rec.studentPhone as string) || (rec.phone as string) || '9876543210',
    studentEmail: (rec.studentEmail as string) || (rec.email as string) || `${record.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  };
}

export function AdminFinancePaymentsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-finance-admin-finance-payments-page-1-page', 0);

  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const [modeFilter, setModeFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinancePayment['mode']>('modeFilter', 'all', { validValues: ['all', 'cash', 'upi', 'card', 'bank', 'unknown'] });
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [receiptModalPayment, setReceiptModalPayment] = useState<AdminFinancePayment | null>(null);
  const [invoiceModalPayment, setInvoiceModalPayment] = useState<AdminFinancePayment | null>(null);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const paymentsQuery = useAdminFinancePaymentsQuery();

  const rawPayments = useMemo(() => {
    if (paymentsQuery.data && paymentsQuery.data.length > 0) return paymentsQuery.data;
    return FALLBACK_PAYMENTS;
  }, [paymentsQuery.data]);

  const allPayments = useMemo(() => rawPayments.map(mapAdminFinancePayment), [rawPayments]);
  const isPending = paymentsQuery.isPending && !rawPayments.length;
  const loadError = paymentsQuery.isError && !rawPayments.length ? t('PAYMENT_LOAD_ERROR') : null;

  const visible = useMemo(() => allPayments.filter((payment) => {
    let branchMatch = true;
    if (!isAllBranches && selectedBranchId !== 'all' && selectedBranch && payment.branch) {
      const pBranch = payment.branch.toLowerCase().trim();
      const sName = (selectedBranch.name ?? '').toLowerCase().trim();
      const sId = (selectedBranch.id ?? '').toLowerCase().trim();
      const sCode = (selectedBranch.code ?? '').toLowerCase().trim();
      branchMatch = pBranch.includes(sName) || sName.includes(pBranch) || pBranch === sId || pBranch === sCode;
    }
    const modeMatch = modeFilter === 'all' || payment.mode === modeFilter;
    const deletedMatch = showDeleted || payment.status !== 'deleted';
    const q = search.trim().toLowerCase();
    const searchMatch = !q || payment.studentName.toLowerCase().includes(q) || payment.smartId.toLowerCase().includes(q) || payment.receiptNumber.toLowerCase().includes(q) || Boolean(payment.txnId && payment.txnId.toLowerCase().includes(q));

    let dateMatch = true;
    if (timeRange !== 'all' && payment.date) {
      const payDate = new Date(payment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') {
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        dateMatch = payDate >= today && payDate <= todayEnd;
      } else if (timeRange === 'this_week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        dateMatch = payDate >= weekStart;
      } else if (timeRange === 'this_month') {
        dateMatch = payDate >= new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (timeRange === 'custom') {
        if (customStartDate) dateMatch = dateMatch && payDate >= new Date(customStartDate);
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && payDate <= end;
        }
      }
    }
    return branchMatch && modeMatch && deletedMatch && searchMatch && dateMatch;
  }), [allPayments, modeFilter, showDeleted, search, isAllBranches, selectedBranchId, selectedBranch, timeRange, customStartDate, customEndDate]);

  const hasActiveFilters = search.trim() !== '' || modeFilter !== 'all' || showDeleted || timeRange !== 'all' || customStartDate !== '' || customEndDate !== '';

  const timeRangeLabel = timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';

  const kpiStats = useMemo(() => {
    const validPayments = visible.filter((p) => p.status === 'valid');
    const totalCollected = validPayments.reduce((acc, p) => acc + p.amount, 0);
    const digitalCount = validPayments.filter((p) => p.mode === 'upi' || p.mode === 'card' || p.mode === 'bank').length;
    const digitalShare = validPayments.length > 0 ? Math.round((digitalCount / validPayments.length) * 100) : 0;
    const totalLateFee = validPayments.reduce((acc, p) => acc + (p.lateFee ?? 0), 0);
    const currency = validPayments[0]?.currencyCode ?? 'INR';
    const unit = validPayments[0]?.amountUnit ?? 'major';
    return {
      totalCollected: formatAdminFinanceApiAmount(totalCollected, currency, unit),
      validCount: validPayments.length,
      digitalShare,
      totalLateFee: formatAdminFinanceApiAmount(totalLateFee, currency, unit),
    };
  }, [visible]);

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
    { field: 'lateFee', headerName: t('LATE_FEE'), width: 110, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => { const amount = typeof params.value === 'number' ? params.value : null; return <span className={amount !== null && amount > 0 ? 'text-warning-text font-bold' : 'text-text-secondary'}>{amount === null ? '—' : formatAdminFinanceApiAmount(amount, params.data.currencyCode, params.data.amountUnit)}</span>; } },
    { field: 'status', headerName: t('STATUS'), width: 130, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap ${params.data.status === 'valid' ? 'border-success bg-success-bg text-success-text' : 'border-danger bg-danger-bg text-danger-text'}`}>{params.data.status === 'valid' ? t('VALID') : params.data.status === 'deleted' ? t('DELETED') : t('UNKNOWN')}</span> },
    {
      headerName: t('ACTIONS'),
      width: 230,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) =>
        params.data.status === 'valid' ? (
          <div className="flex items-center gap-1.5">
            <button type="button" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-border-focus bg-primary-subtle text-primary hover:opacity-90 motion-safe:transition-opacity shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={(e) => { e.stopPropagation(); setReceiptModalPayment(params.data); }} aria-label={t('VIEW_RECEIPT', { number: params.data.receiptNumber })} title="View receipt (80mm)">
              <Receipt size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-info bg-info-bg text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={(e) => { e.stopPropagation(); setInvoiceModalPayment(params.data); }} aria-label={t('VIEW_INVOICE', { number: params.data.receiptNumber })} title="View Tax Invoice">
              <FileText size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Direct PDF Download" aria-label={`Download PDF invoice for ${params.data.receiptNumber}`} onClick={(e) => { e.stopPropagation(); downloadPaymentInvoicePdf(params.data); toast.success(`Downloading Tax Invoice PDF (${params.data.receiptNumber})`, { id: 'admin-finance-payments-row-pdf' }); }}>
              <Download size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-info bg-info-bg text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Email Receipt to Student" aria-label={`Email receipt ${params.data.receiptNumber} to ${params.data.studentName}`} onClick={(e) => { e.stopPropagation(); const email = params.data.studentEmail || `${params.data.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`; openFinanceMailtoClient(email, `Fee Payment Receipt - ${params.data.receiptNumber} - Smart Library`, `Dear ${params.data.studentName},\n\nThank you for your fee payment!\n\nReceipt No: ${params.data.receiptNumber}\nDate: ${formatDate(params.data.date)}\nAmount: ${formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit)}\nPayment Mode: ${params.data.mode.toUpperCase()}\nStatus: Verified & Confirmed.\n\nSmart Library Accounts Division`); }}>
              <Mail size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button type="button" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Share receipt via WhatsApp (auto phone prefilled)" aria-label={`Share receipt ${params.data.receiptNumber} with ${params.data.studentName} on WhatsApp`} onClick={(e) => { e.stopPropagation(); const text = `Hello ${params.data.studentName}, thank you for your payment!\nReceipt No: ${params.data.receiptNumber}\nDate: ${formatDate(params.data.date)}\nAmount: ${formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit)}\nMode: ${params.data.mode.toUpperCase()}\nStatus: Verified & Confirmed.\nSmart Library Admin`; const waUrl = buildWhatsAppLink(params.data.studentPhone, text); const popup = window.open(waUrl, '_blank', 'noopener,noreferrer'); if (popup) popup.opener = null; }}>
              <MessageSquare size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        ) : null,
    },
  ], [t]);

  return (
    <div className="space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
                <CreditCard className="h-3.5 w-3.5" aria-hidden="true" /> Library Fee Collections
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2.5 py-0.5 text-[11px] font-mono text-text-secondary">
                Scope: <span className="text-primary font-semibold">{timeRangeLabel}</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAYMENT_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">{t('PAYMENT_SUBTITLE')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface-highlight p-2 shadow-card">
            <div className="flex items-center rounded-lg bg-card p-1 border border-border">
              {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
                <button key={r} type="button" onClick={() => { setTimeRange(r); setUrlTablePage0(0); }} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors ${timeRange === r ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
                  {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : <><Calendar className="h-3 w-3" aria-hidden="true" />Custom</>}
                </button>
              ))}
            </div>
            {timeRange === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                <span className="text-text-secondary">to</span>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminFinancePaymentsKpiGrid {...kpiStats} timeRangeLabel={timeRangeLabel} />

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true" />
          <input maxLength={30} type="text" placeholder="Search student, smart ID, receipt, txn ID..." value={search} onChange={(e) => { setSearch(e.target.value); setUrlTablePage0(0); }} className="min-h-9 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>
        <label className="sr-only" htmlFor="finance-payment-mode">{t('FILTER_PAYMENT_MODE')}</label>
        <select id="finance-payment-mode" className="min-h-9 rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-36" value={modeFilter} onChange={(event) => setModeFilter(parseModeFilter(event.target.value))}>
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
        {hasActiveFilters && (
          <button type="button" onClick={() => { setSearch(''); setModeFilter('all'); setShowDeleted(false); setTimeRange('all'); setCustomStartDate(''); setCustomEndDate(''); setUrlTablePage0(0); }} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-border bg-surface-highlight px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Reset all filters">
            Reset
          </button>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-secondary">Showing {visible.length} of {allPayments.length} ({timeRangeLabel})</span>
          <button type="button" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleExport} disabled={isPending || Boolean(loadError) || visible.length === 0} aria-label={t('EXPORT_ARIA')} title="Export Payments to CSV">
            <Download size={14} strokeWidth={2} className="text-info-text" aria-hidden="true" />{t('EXPORT_CSV')}
          </button>
          <button type="button" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => exportFinancePaymentsExcel(visible)} disabled={isPending || Boolean(loadError) || visible.length === 0} title="Export Payments to Excel (.xls)">
            <FileSpreadsheet size={14} strokeWidth={2} className="text-success-text" aria-hidden="true" /><span>Excel</span>
          </button>
          <button type="button" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => printFinancePaymentsLedger(visible, selectedBranch ? selectedBranch.name : 'All Branches', timeRangeLabel, kpiStats.totalCollected)} disabled={isPending || Boolean(loadError) || visible.length === 0} title="Print Payments Ledger">
            <Printer size={14} strokeWidth={2} className="text-info-text" aria-hidden="true" /><span>Print</span>
          </button>
        </div>
      </div>

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
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="min-w-0 rounded-lg border border-border bg-card overflow-hidden" aria-busy={false}>
            <DataGrid rowData={visible} columnDefs={columns} rowHeight={56} pagination pageSize={25} emptyMessage={visible.length === 0 && allPayments.length > 0 ? `No payments found for ${timeRangeLabel} in ${selectedBranch?.name ?? 'the selected view'}.` : t('PAYMENT_EMPTY')} page={urlTablePage0} onPageChange={setUrlTablePage0} />
          </div>
          <p className="text-caption text-text-secondary mt-2 px-4 pb-3">{t('MOBILE_PAYMENT_NOTE')}</p>
        </div>
      )}

      <AdminFinancePaymentReceiptModal payment={receiptModalPayment} isOpen={Boolean(receiptModalPayment)} onClose={() => setReceiptModalPayment(null)} />
      <AdminFinancePaymentInvoiceModal payment={invoiceModalPayment} isOpen={Boolean(invoiceModalPayment)} onClose={() => setInvoiceModalPayment(null)} />
    </div>
  );
}
