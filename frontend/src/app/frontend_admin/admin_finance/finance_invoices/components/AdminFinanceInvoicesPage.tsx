'use client';
// Responsibility: AdminFinanceInvoicesPage component owned by admin_finance; responsibility folder: components.
import { useEffect, useState } from 'react';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatAdminFinanceCurrency, formatDate } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesFormat';
import { Search, FileText, Printer, Download, Eye, Send } from 'lucide-react';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesWhatsApp';
import { AdminFinanceThermalPrint } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesThermalPrint';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminFinanceEmptyState from '@/app/frontend_admin/admin_finance/finance_invoices/components/AdminFinanceInvoicesEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { ADMIN_FINANCE_INVOICES_ROUTES } from '@/app/frontend_admin/admin_finance/finance_invoices/config/admin_finance_invoices.url_config';
import { ADMIN_FINANCE_DEMO_INVOICES } from '@/app/frontend_admin/admin_finance/finance_invoices/mocks/scenarios/admin_finance_invoices.scenarios';
import type { AdminFinanceDemoInvoice } from '@/app/frontend_admin/admin_finance/finance_invoices/types/AdminFinanceInvoicesTypes';
import type { FilterStatus } from '@/app/frontend_admin/admin_finance/finance_invoices/types/AdminFinanceInvoicesTypes';


const STATUS_BADGE: Record<string, string> = {
  paid: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg', pending: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg', overdue: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
};

export function AdminFinanceInvoicesPage() {
  const t = useTranslations('ADMIN_FINANCE_INVOICES');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [search, setSearch]           = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchDraft, setSearchDraft] = useState(search);
  useEffect(() => { setSearchDraft(search); }, [search]);
  useEffect(() => { const timer = window.setTimeout(() => setSearch(searchDraft), 300); return () => window.clearTimeout(timer); }, [searchDraft, setSearch]);

  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<FilterStatus>('statusFilter', 'all', { validValues: ['all', 'paid', 'pending', 'overdue'] });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const invoiceRecords = isDemoMode ? ADMIN_FINANCE_DEMO_INVOICES : [];
  const filtered = invoiceRecords.filter(inv => {
    const ms = !search || inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return ms && mst;
  });

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  function handleWhatsApp(inv: AdminFinanceDemoInvoice) {
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const statusEmoji = inv.paymentStatus === 'paid' ? '✅' : inv.paymentStatus === 'pending' ? '⏳' : '⚠️';
    const msg = [
      c(`★ ${ADMIN_BRAND_CONFIG.displayName} ★`),
      c(t('MESSAGE_BRANCH')),
      line,
      c(t('MESSAGE_TITLE')),
      line,
      row(`${t('MESSAGE_INVOICE')} :`, inv.invoiceNumber),
      row(`${t('TH_DATE')} :`, formatDate(inv.invoiceDate)),
      '',
      row(`${t('TH_STUDENT')} :`, inv.studentName),
      row(`${t('MESSAGE_SMART_ID')}:`, inv.studentId),
      '',
      line,
      row(`${t('MESSAGE_PLAN')} :`, inv.planName),
      row(`${t('MESSAGE_AMOUNT')} :`, `${formatAdminFinanceCurrency(inv.grandTotal)}`),
      ...(inv.paymentMode ? [row(`${t('TH_MODE')} :`, inv.paymentMode)] : []),
      line,
      row(`${t('MESSAGE_STATUS')} :`, `${statusEmoji} ${inv.paymentStatus.toUpperCase()}`),
      '',
      c(`${ADMIN_BRAND_CONFIG.displayName} | ${t('MESSAGE_BRANCH')}`),
      line,
    ].join('\n');
    try { openAdminFinanceWhatsApp(inv.phone, msg); } catch { toast.error(t('WHATSAPP_POPUP_BLOCKED'), { id: 'finance-invoices-whatsapp-popup-blocked' }); }
  }

  function handlePrint(inv: AdminFinanceDemoInvoice) {
    try { AdminFinanceThermalPrint({
      type: 'receipt', shopName: ADMIN_BRAND_CONFIG.displayName, branch: t('MESSAGE_BRANCH'),
      studentName: inv.studentName, smartId: inv.studentId, phone: inv.phone,
      shift: inv.shift, seat: inv.seat, plan: inv.planName,
      billNumber: inv.invoiceNumber, date: formatDate(inv.invoiceDate),
      totalPayable: inv.grandTotal,
      amountPaid: inv.paymentStatus === 'paid' ? inv.grandTotal: 0,
      discount: 0, balance: inv.paymentStatus === 'paid' ? 0 : inv.grandTotal,
      paymentMode: inv.paymentMode || t('PAYMENT_MODE_PENDING'),
      labels: { bill: t('TH_INVOICE_NO'), date: t('TH_DATE'), student: t('TH_STUDENT'), smartId: t('MESSAGE_SMART_ID'), phone: t('MESSAGE_PHONE'), shift: t('SHIFT'), seat: t('SEAT'), plan: t('MESSAGE_PLAN'), payment: t('TH_MODE'), transaction: t('TRANSACTION_ID'), total: t('TH_AMOUNT'), paid: t('PAID'), discount: t('DISCOUNT'), balance: t('BALANCE') },
    }); } catch { toast.error(t('PRINT_POPUP_BLOCKED'), { id: 'finance-invoices-print-popup-blocked' }); }
  }

  return (
    <div className="space-y-6">
      {!isDemoMode && <p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('LIVE_UNAVAILABLE')}</p>}
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: t('KPI_TOTAL_INVOICES'), value: isDemoMode ? invoiceRecords.length.toString() : '—' },
          { label: t('KPI_TOTAL_BILLED'), value: isDemoMode ? formatAdminFinanceCurrency(invoiceRecords.reduce((s, i) => s + i.grandTotal, 0)) : '—', success: true },
          { label: t('KPI_PENDING_OVERDUE'), value: isDemoMode ? invoiceRecords.filter(i => i.paymentStatus !== 'paid').length.toString() : '—', warning: true },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border border-border bg-card p-5 shadow-card${k.warning ? ' border-warning-bg bg-warning-bg' : ''}`}>
            <div className="mb-2 flex items-center justify-between gap-3"><p className={`text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary${k.warning ? ' text-warning-text' : ''}`}>{k.label}</p><FileText size={18} className={k.warning ? 'text-warning-text' : 'text-text-secondary'}  strokeWidth={2}/></div>
            <p className={`mt-2 text-kpi font-bold text-text-primary${k.success ? ' text-success-text' : k.warning ? ' text-warning-text' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={18} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pl-9" aria-label={t('SEARCH_ARIA')} placeholder={t('SEARCH_PLACEHOLDER')} value={searchDraft} onChange={e => setSearchDraft(e.target.value)} />
        </div>
        <select data-testid="admin_finance-page-control-001" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_STATUS_ARIA')} value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)}>
          <option value="all">{t('FILTER_ALL')}</option>
          <option value="paid">{t('FILTER_PAID')}</option>
          <option value="pending">{t('FILTER_PENDING')}</option>
          <option value="overdue">{t('FILTER_OVERDUE')}</option>
        </select>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-highlight uppercase text-xs text-text-secondary font-semibold h-12">
              <th className="text-left py-3 px-4">{t('TH_INVOICE_NO')}</th>
              <th className="text-left py-3 px-4">{t('TH_STUDENT')}</th>
              <th className="text-left py-3 px-4">{t('TH_DATE')}</th>
              <th className="text-right py-3 px-4">{t('TH_AMOUNT')}</th>
              <th className="text-left py-3 px-4">{t('TH_MODE')}</th>
              <th className="text-left py-3 px-4">{t('TH_STATUS')}</th>
              <th className="text-right py-3 px-4">{t('TH_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><AdminFinanceEmptyState title={t('EMPTY')} description={t('EMPTY_DESCRIPTION')} /></td></tr>
            ) : paginated.map(inv => (
              <tr key={inv.id} className="border-b border-border hover:bg-surface-hover even:bg-surface-zebra/30 h-12 text-text-primary motion-safe:transition-colors">
                <td className="py-3 px-4 font-mono text-caption text-text-secondary"><span className="font-mono text-caption text-text-secondary">{inv.invoiceNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="text-body font-semibold text-text-primary">{inv.studentName}</p>
                  <p className="text-caption text-text-secondary">{inv.studentId}</p>
                </td>
                <td className="py-3 px-4 text-caption text-text-secondary">{formatDate(inv.invoiceDate)}</td>
                <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(inv.grandTotal)}</td>
                <td className="py-3 px-4">
                  {inv.paymentMode
                    ? <span data-testid="admin_finance-page-state-005" className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-badge font-semibold capitalize whitespace-nowrap ${inv.paymentMode.toLowerCase() === 'cash' ? 'bg-pay-cash-bg text-pay-cash' : inv.paymentMode.toLowerCase() === 'upi' ? 'bg-pay-upi-bg text-pay-upi' : inv.paymentMode.toLowerCase() === 'card' ? 'bg-pay-card-bg text-pay-card' : ['bank transfer', 'bank-transfer'].includes(inv.paymentMode.toLowerCase()) ? 'bg-pay-bank-bg text-pay-bank' : 'bg-info-bg text-info-text'}`}>{inv.paymentMode}</span>
                    : <span className="text-text-secondary">—</span>}
                </td>
                <td className="py-3 px-4">
                  <span data-testid="admin_finance-page-state-006" className={STATUS_BADGE[inv.paymentStatus] || 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border'}>{inv.paymentStatus}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link data-testid="admin_finance-page-control-008" href={ADMIN_FINANCE_INVOICES_ROUTES.DETAIL(inv.id)} aria-label={t('VIEW_INVOICE', { invoiceNumber: inv.invoiceNumber })} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer">
                      <Eye size={18} strokeWidth={2}/> {t('VIEW')}
                    </Link>
                    <button data-testid="admin_finance-page-control-009" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={() => handlePrint(inv)} title={t('PRINT', { invoiceNumber: inv.invoiceNumber })} aria-label={t('PRINT', { invoiceNumber: inv.invoiceNumber })}>
                      <Printer size={18}  strokeWidth={2}/>
                    </button>
                    <button data-testid="admin_finance-page-control-010" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={() => handleWhatsApp(inv)} title={t('SEND_WHATSAPP', { invoiceNumber: inv.invoiceNumber })} aria-label={t('SEND_WHATSAPP', { invoiceNumber: inv.invoiceNumber })}>
                      <Send size={18}  strokeWidth={2}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <AdminTablePagination
            page={effectivePage}
            pageSize={pageSize}
            totalRows={totalRows}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            id="rows-per-page-finance-invoices"
          />
        )}
      </div>
    </div>
  );
}
