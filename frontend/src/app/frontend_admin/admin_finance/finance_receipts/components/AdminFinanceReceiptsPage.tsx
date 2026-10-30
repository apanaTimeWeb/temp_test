'use client';
// Responsibility: AdminFinanceReceiptsPage component owned by admin_finance; responsibility folder: components.
// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useState } from 'react';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatAdminFinanceCurrency, formatDate, getAdminFinanceLocalMonthString } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsFormat';
import { Search, Receipt, Eye, Printer, Send } from 'lucide-react';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsWhatsApp';
import { AdminFinanceThermalPrint } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsThermalPrint';
import { ADMIN_FINANCE_RECEIPTS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_receipts/config/admin_finance_receipts.url_config';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminFinanceEmptyState from '@/app/frontend_admin/admin_finance/finance_receipts/components/AdminFinanceReceiptsEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { ADMIN_FINANCE_DEMO_RECEIPTS } from '@/app/frontend_admin/admin_finance/finance_receipts/mocks/scenarios/admin_finance_receipts.scenarios';
import type { AdminFinanceDemoReceipt } from '@/app/frontend_admin/admin_finance/finance_receipts/types/AdminFinanceReceiptsTypes';
import type { FilterMode } from '@/app/frontend_admin/admin_finance/finance_receipts/types/AdminFinanceReceiptsTypes';


const MODE_BADGE: Record<string, string> = {
  upi: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-upi-bg text-pay-upi border-border', cash: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-cash-bg text-pay-cash border-border',
  card: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-card-bg text-pay-card border-border', 'bank transfer': 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-bank-bg text-pay-bank border-border',
};

export function AdminFinanceReceiptsPage() {
  const t = useTranslations('ADMIN_FINANCE_RECEIPTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [search, setSearch]           = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  useEffect(() => { const timer = window.setTimeout(() => setSearch(searchDraft), 300); return () => window.clearTimeout(timer); }, [searchDraft]);

  const [modeFilter, setModeFilter]   = useState<FilterMode>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const receiptRecords = isDemoMode ? ADMIN_FINANCE_DEMO_RECEIPTS : [];
  const filtered = receiptRecords.filter(r => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const mm = modeFilter === 'all' || r.paymentMode.toLowerCase() === modeFilter;
    return ms && mm;
  });

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const totalCollected = receiptRecords.reduce((s, r) => s + r.amount, 0);

  function handleWhatsApp(r: AdminFinanceDemoReceipt) {
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const msg = [
      c(`★ ${ADMIN_BRAND_CONFIG.displayName} ★`),
      c(t('MESSAGE_BRANCH')),
      line,
      c(t('MESSAGE_RECEIPT_TITLE')),
      line,
      row(`${t('MESSAGE_RECEIPT')} :`, r.receiptNumber),
      row(`${t('TH_DATE')} :`, formatDate(r.date)),
      '',
      row(`${t('TH_STUDENT')} :`, r.studentName),
      row(`${t('MESSAGE_SMART_ID')}:`, r.studentId),
      '',
      line,
      row(`${t('MESSAGE_PLAN')} :`, r.planName),
      line,
      row(`${t('MESSAGE_AMOUNT')} :`, `${formatAdminFinanceCurrency(r.amount)}`),
      row(`${t('TH_MODE')} :`, r.paymentMode),
      '',
      c(t('PAYMENT_CONFIRMED')),
      c(t('MESSAGE_THANKS')),
      line,
    ].join('\n');
    try { openAdminFinanceWhatsApp(r.phone, msg); } catch { toast.error(t('WHATSAPP_POPUP_BLOCKED'), { id: 'finance-receipts-whatsapp-popup-blocked' }); }
  }

  function handlePrint(r: AdminFinanceDemoReceipt) {
    try { AdminFinanceThermalPrint({
      type: 'receipt', shopName: ADMIN_BRAND_CONFIG.displayName, branch: t('MESSAGE_BRANCH'),
      studentName: r.studentName, smartId: r.studentId, phone: r.phone,
      shift: r.shift, seat: r.seat, plan: r.planName,
      billNumber: r.receiptNumber, date: formatDate(r.date),
      totalPayable: r.amount, amountPaid: r.amount, discount: 0,
      balance: 0, paymentMode: r.paymentMode,
      labels: { bill: t('TH_RECEIPT_NO'), date: t('TH_DATE'), student: t('TH_STUDENT'), smartId: t('MESSAGE_SMART_ID'), phone: t('MESSAGE_PHONE'), shift: t('SHIFT'), seat: t('SEAT'), plan: t('MESSAGE_PLAN'), payment: t('TH_MODE'), transaction: t('TXN_ID'), total: t('TH_AMOUNT'), paid: t('PAID'), discount: t('DISCOUNT'), balance: t('BALANCE') },
    }); } catch { toast.error(t('PRINT_POPUP_BLOCKED'), { id: 'finance-receipts-print-popup-blocked' }); }
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
          { label: t('KPI_TOTAL_RECEIPTS'), value: isDemoMode ? receiptRecords.length.toString() : '—' },
          { label: t('KPI_TOTAL_COLLECTED'), value: isDemoMode ? formatAdminFinanceCurrency(totalCollected) : '—', success: true },
          { label: t('KPI_THIS_MONTH'), value: isDemoMode ? receiptRecords.filter(r => r.date.startsWith(getAdminFinanceLocalMonthString())).length.toString() : '—' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between gap-3 text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{k.label}</p><Receipt size={18} className="text-text-secondary"  strokeWidth={2}/></div>
            <p className={`mt-2 text-kpi font-bold text-text-primary${k.success ? ' text-success-text' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={18} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pl-9" aria-label={t('SEARCH_ARIA')} placeholder={t('SEARCH_PLACEHOLDER')} value={searchDraft} onChange={e => setSearchDraft(e.target.value)} />
        </div>
        <select data-testid="admin_finance-page-control-001" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_MODE_ARIA')} value={modeFilter} onChange={e => setModeFilter(e.target.value as FilterMode)}>
          <option value="all">{t('FILTER_ALL')}</option>
          <option value="upi">{t('FILTER_UPI')}</option>
          <option value="cash">{t('FILTER_CASH')}</option>
          <option value="card">{t('FILTER_CARD')}</option>
          <option value="bank transfer">{t('FILTER_BANK_TRANSFER')}</option>
        </select>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-highlight uppercase text-xs text-text-secondary font-semibold h-12">
              <th className="text-left py-3 px-4">{t('TH_RECEIPT_NO')}</th>
              <th className="text-left py-3 px-4">{t('TH_STUDENT')}</th>
              <th className="text-left py-3 px-4">{t('PLAN')}</th>
              <th className="text-left py-3 px-4">{t('TH_DATE')}</th>
              <th className="text-right py-3 px-4">{t('TH_AMOUNT')}</th>
              <th className="text-left py-3 px-4">{t('TH_MODE')}</th>
              <th className="text-right py-3 px-4">{t('TH_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><AdminFinanceEmptyState title={t('EMPTY')} description={t('EMPTY_DESCRIPTION')} /></td></tr>
            ) : paginated.map(r => (
              <tr key={r.id} className="border-b border-border hover:bg-surface-hover even:bg-surface-zebra/30 h-12 text-text-primary motion-safe:transition-colors">
                <td className="py-3 px-4 font-mono text-caption text-text-secondary"><span className="font-mono text-caption text-text-secondary">{r.receiptNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="text-body font-semibold text-text-primary">{r.studentName}</p>
                  <p className="text-caption text-text-secondary">{r.studentId}</p>
                </td>
                <td className="py-3 px-4 text-caption text-text-secondary max-w-44" >{r.planName}</td>
                <td className="py-3 px-4 text-caption text-text-secondary">{formatDate(r.date)}</td>
                <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(r.amount)}</td>
                <td className="py-3 px-4">
                  <span data-testid="admin_finance-page-state-005" className={MODE_BADGE[r.paymentMode.toLowerCase()] || 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-info-bg text-info-text border-info-bg'}>{r.paymentMode}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link data-testid="admin_finance-page-control-007" href={ADMIN_FINANCE_RECEIPTS_ROUTES.DETAIL(r.id)} aria-label={t('VIEW_RECEIPT', { receiptNumber: r.receiptNumber })} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer">
                      <Eye size={18} strokeWidth={2}/> {t('VIEW')}
                    </Link>
                    <button data-testid="admin_finance-page-control-008" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={() => handlePrint(r)} title={t('PRINT', { receiptNumber: r.receiptNumber })} aria-label={t('PRINT', { receiptNumber: r.receiptNumber })}>
                      <Printer size={18}  strokeWidth={2}/>
                    </button>
                    <button data-testid="admin_finance-page-control-009" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={() => handleWhatsApp(r)} title={t('SEND_WHATSAPP', { receiptNumber: r.receiptNumber })} aria-label={t('SEND_WHATSAPP', { receiptNumber: r.receiptNumber })}>
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
            id="rows-per-page-finance-receipts"
          />
        )}
      </div>
    </div>
  );
}
