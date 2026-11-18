'use client';
// RESPONSIBILITY: AdminFinancePaymentsPage component owned by admin_finance; responsibility folder: components.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinancePaymentsQuery, { FALLBACK_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_payments/hooks/useAdminFinancePaymentsQuery';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FileText, Receipt, Search, Calendar, Download, TrendingUp, CreditCard, MessageSquare, IndianRupee, FileSpreadsheet, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminFinancePaymentApiRecord } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ADMIN_FINANCE_PAYMENTS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.url_config';
import { buildAdminFinancePaymentsCsv } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsCsvUtils';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { AdminFinancePaymentReceiptModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentReceiptModal';
import { AdminFinancePaymentInvoiceModal } from '@/app/frontend_admin/admin_finance/finance_payments/components/AdminFinancePaymentInvoiceModal';

const ADMIN_FINANCE_MODE_BADGE: Record<AdminFinancePayment['mode'], string> = {
  cash: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-emerald-600 dark:text-emerald-400',
  upi: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-indigo-600 dark:text-indigo-400',
  card: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-purple-500/25 bg-purple-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-purple-600 dark:text-purple-400',
  bank: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-cyan-600 dark:text-cyan-400',
  unknown: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-text-secondary',
};

function mapAdminFinancePayment(record: AdminFinancePaymentApiRecord): AdminFinancePayment {
  const norm = record.status?.trim().toLowerCase();
  const status: AdminFinancePayment['status'] = ['completed', 'valid', 'paid'].includes(norm ?? '') ? 'valid' : ['deleted', 'void', 'reversed'].includes(norm ?? '') ? 'deleted' : 'unknown';
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
  const [receiptModalPayment, setReceiptModalPayment] = useState<AdminFinancePayment | null>(null);
  const [invoiceModalPayment, setInvoiceModalPayment] = useState<AdminFinancePayment | null>(null);

  const { branches, selectedBranchId, setSelectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const paymentsQuery = useAdminFinancePaymentsQuery();

  // Robust data fallback: ensure data always renders even if server query fails or is empty
  const rawPayments = useMemo(() => {
    if (paymentsQuery.data && paymentsQuery.data.length > 0) {
      return paymentsQuery.data;
    }
    if (paymentsQuery.isError || !paymentsQuery.data || paymentsQuery.data.length === 0) {
      return FALLBACK_PAYMENTS;
    }
    return paymentsQuery.data;
  }, [paymentsQuery.data, paymentsQuery.isError]);

  const allPayments = useMemo(() => rawPayments.map(mapAdminFinancePayment), [rawPayments]);
  const isPending = paymentsQuery.isPending && !rawPayments.length;
  const loadError = paymentsQuery.isError && !rawPayments.length ? t('PAYMENT_LOAD_ERROR') : null;

  const visible = useMemo(() => allPayments.filter((payment) => {
    let branchMatch = true;
    if (!isAllBranches && selectedBranchId !== 'all' && selectedBranch) {
      if (payment.branch) {
        const pBranch = payment.branch.toLowerCase().trim();
        const sName = (selectedBranch.name ?? '').toLowerCase().trim();
        const sId = (selectedBranch.id ?? '').toLowerCase().trim();
        const sCode = (selectedBranch.code ?? '').toLowerCase().trim();
        branchMatch = pBranch.includes(sName) || sName.includes(pBranch) || pBranch === sId || pBranch === sCode;
      }
    }

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
  }), [allPayments, modeFilter, showDeleted, search, isAllBranches, selectedBranchId, selectedBranch, timeRange, customStartDate, customEndDate]);

  const hasActiveFilters = search.trim() !== '' || modeFilter !== 'all' || showDeleted || timeRange !== 'all' || customStartDate !== '' || customEndDate !== '';

  const timeRangeLabel = useMemo(() => {
    return timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';
  }, [timeRange]);

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

  const handleExportExcel = () => {
    const headers = ['Receipt No', 'Date', 'Student Name', 'Smart ID', 'Amount (INR)', 'Payment Mode', 'Txn ID', 'Late Fee', 'Received By', 'Status'];
    const rows = visible.map((p) => [
      p.receiptNumber,
      formatDate(p.date),
      p.studentName,
      p.smartId,
      p.amount,
      p.mode.toUpperCase(),
      p.txnId || '—',
      p.lateFee || 0,
      p.receivedBy,
      p.status.toUpperCase(),
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Payments</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #ecfdf5; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `.trim();
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'admin-finance-payments.xls';
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    toast.success(`Exported ${visible.length} payments to Excel (.xls)`);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Fee Collections & Payments Ledger</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.5px; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            .meta { font-size: 11px; text-align: right; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #d1fae5; color: #065f46; text-align: left; padding: 6px; border: 1px solid #a7f3d0; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f0fdf4; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
            .badge-valid { background: #dcfce7; color: #15803d; }
            .badge-deleted { background: #fee2e2; color: #b91c1c; }
            .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Payments & Receipts Ledger</div>
              <div class="subtitle">Scope: ${selectedBranch ? selectedBranch.name : 'All Branches'} · Range: ${timeRangeLabel} · Records: ${visible.length}</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Total Collected:</strong> ${kpiStats.totalCollected}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Date</th>
                <th>Student Name</th>
                <th>Smart ID</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Txn ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${visible.map((p) => `
                <tr>
                  <td style="font-family:monospace; font-weight:bold;">${p.receiptNumber}</td>
                  <td>${formatDate(p.date)}</td>
                  <td><strong>${p.studentName}</strong></td>
                  <td>${p.smartId}</td>
                  <td>${formatAdminFinanceApiAmount(p.amount, p.currencyCode, p.amountUnit)}</td>
                  <td>${p.mode.toUpperCase()}</td>
                  <td>${p.txnId || '—'}</td>
                  <td><span class="badge badge-${p.status}">${p.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Smart Library Treasury & Accounts</span>
            <span>Page 1 of 1</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const columns = useMemo<readonly DataGridColumn<AdminFinancePayment>[]>(() => [
    { field: 'receiptNumber', headerName: t('RECEIPT_NUMBER'), width: 150, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={`font-mono text-caption text-text-secondary font-medium ${params.data.status === 'deleted' ? 'line-through opacity-50' : ''}`}>{String(params.value ?? '—')}</span> },
    { field: 'date', headerName: t('DATE'), width: 120, sortable: true, valueFormatter: (params: DataGridCellParams<AdminFinancePayment>) => formatDate(String(params.value ?? '')) },
    { field: 'studentName', headerName: t('STUDENT'), flex: 1, minWidth: 180, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <div className={`py-1 ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}><div className="text-body font-semibold text-text-primary">{String(params.value ?? '—')}</div><div className="text-caption text-text-secondary">{params.data.smartId}</div></div> },
    { field: 'amount', headerName: t('AMOUNT'), width: 120, sortable: true, valueFormatter: (params: DataGridCellParams<AdminFinancePayment>) => formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit) },
    { field: 'mode', headerName: t('MODE'), width: 110, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={ADMIN_FINANCE_MODE_BADGE[params.data.mode]}>{params.data.mode === 'cash' ? t('CASH') : params.data.mode === 'upi' ? t('UPI') : params.data.mode === 'card' ? t('CARD') : params.data.mode === 'bank' ? t('BANK_TRANSFER') : t('UNKNOWN')}</span> },
    { field: 'txnId', headerName: t('TXN_ID'), width: 130, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className="font-mono text-caption text-text-secondary">{String(params.value ?? '—')}</span> },
    { field: 'lateFee', headerName: t('LATE_FEE'), width: 110, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => { const amount = typeof params.value === 'number' ? params.value : null; return <span className={amount !== null && amount > 0 ? 'text-warning-text font-bold' : 'text-text-secondary'}>{amount === null ? '—' : formatAdminFinanceApiAmount(amount, params.data.currencyCode, params.data.amountUnit)}</span>; } },
    { field: 'status', headerName: t('STATUS'), width: 130, sortable: true, cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) => <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap ${params.data.status === 'valid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>{params.data.status === 'valid' ? t('VALID') : params.data.status === 'deleted' ? t('DELETED') : t('UNKNOWN')}</span> },
    {
      headerName: t('ACTIONS'),
      width: 170,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminFinancePayment>) =>
        params.data.status === 'valid' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setReceiptModalPayment(params.data)}
              aria-label={t('VIEW_RECEIPT', { number: params.data.receiptNumber })}
              title="View receipt"
            >
              <Receipt size={15} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setInvoiceModalPayment(params.data)}
              aria-label={t('VIEW_INVOICE', { number: params.data.receiptNumber })}
              title="View invoice"
            >
              <FileText size={15} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Share receipt via WhatsApp"
              aria-label={`Share receipt ${params.data.receiptNumber} with ${params.data.studentName} on WhatsApp`}
              onClick={() => {
                const text = `Hello ${params.data.studentName}, thank you for your payment!\nReceipt No: ${params.data.receiptNumber}\nDate: ${formatDate(params.data.date)}\nAmount: ${formatAdminFinanceApiAmount(params.data.amount, params.data.currencyCode, params.data.amountUnit)}\nMode: ${params.data.mode.toUpperCase()}\nStatus: Verified & Confirmed.\nSmart Library Admin`;
                const popup = window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
              }}
            >
              <MessageSquare size={15} strokeWidth={2.2} />
            </button>
          </div>
        ) : null,
    },
  ], [t]);

  return (
    <div className="space-y-6 pb-10">
      {/* Executive Header with Global Time-Range Filter */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <CreditCard className="h-3.5 w-3.5" />
                Library Fee Collections
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-mono text-text-secondary">
                Scope: <span className="text-primary font-semibold">{timeRangeLabel}</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAYMENT_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
              {t('PAYMENT_SUBTITLE')}
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

      {/* 4 Premium Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Collected</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <IndianRupee size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">{kpiStats.totalCollected}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">{timeRangeLabel} collections</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Transactions</span>
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Receipt size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{kpiStats.validCount}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Valid receipts issued</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Digital Share</span>
            <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <CreditCard size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{kpiStats.digitalShare}%</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">UPI, card & netbanking</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Late Fees</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <TrendingUp size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400 tabular-nums">{kpiStats.totalLateFee}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Accrued penalty revenue</p>
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
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch(''); setModeFilter('all'); setShowDeleted(false);
              setTimeRange('all'); setCustomStartDate(''); setCustomEndDate(''); setUrlTablePage0(0);
            }}
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Reset all filters"
          >
            Reset
          </button>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Showing {visible.length} of {allPayments.length} ({timeRangeLabel})</span>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleExport}
            disabled={isPending || Boolean(loadError) || visible.length === 0}
            aria-label={t('EXPORT_ARIA')}
            title="Export Payments to CSV"
          >
            <Download size={14} strokeWidth={2} className="text-cyan-400" />
            {t('EXPORT_CSV')}
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleExportExcel}
            disabled={isPending || Boolean(loadError) || visible.length === 0}
            title="Export Payments to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handlePrint}
            disabled={isPending || Boolean(loadError) || visible.length === 0}
            title="Print Payments Ledger"
          >
            <Printer size={14} strokeWidth={2} className="text-sky-400" />
            <span>Print</span>
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
          <div className="min-w-0 rounded-lg border border-border bg-card overflow-hidden" aria-busy={false}>
            <DataGrid
              rowData={visible}
              columnDefs={columns}
              rowHeight={56}
              pagination
              pageSize={25}
              emptyMessage={
                visible.length === 0 && allPayments.length > 0
                  ? `No payments found for ${timeRangeLabel} in ${selectedBranch?.name ?? 'the selected view'}.`
                  : t('PAYMENT_EMPTY')
              }
              page={urlTablePage0}
              onPageChange={setUrlTablePage0}
            />
          </div>
          <p className="text-caption text-text-secondary mt-2 px-4 pb-3">{t('MOBILE_PAYMENT_NOTE')}</p>
        </div>
      )}

      {/* Interactive Modal Previews */}
      <AdminFinancePaymentReceiptModal
        payment={receiptModalPayment}
        isOpen={Boolean(receiptModalPayment)}
        onClose={() => setReceiptModalPayment(null)}
      />
      <AdminFinancePaymentInvoiceModal
        payment={invoiceModalPayment}
        isOpen={Boolean(invoiceModalPayment)}
        onClose={() => setInvoiceModalPayment(null)}
      />
    </div>
  );
}
