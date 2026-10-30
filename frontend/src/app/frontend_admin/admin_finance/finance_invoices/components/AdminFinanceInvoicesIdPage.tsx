'use client';
// Responsibility: AdminFinanceInvoicesIdPage component owned by admin_finance; responsibility folder: components.
import { ADMIN_FINANCE_INVOICES_ROUTES } from '@/app/frontend_admin/admin_finance/finance_invoices/config/admin_finance_invoices.url_config';
// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { formatAdminFinanceCurrency, formatDate } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesFormat';
import { Printer, ArrowLeft, Send } from 'lucide-react';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesWhatsApp';
import { AdminFinanceThermalPrint } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesThermalPrint';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_DEMO_INVOICE_DETAIL, ADMIN_FINANCE_DEMO_INVOICES } from '@/app/frontend_admin/admin_finance/finance_invoices/mocks/scenarios/admin_finance_invoices.scenarios';

const INV = ADMIN_FINANCE_DEMO_INVOICE_DETAIL;

export function AdminFinanceInvoicesIdPage({ routeId: requestedRouteId }: { routeId?: string } = {}) {
  const t = useTranslations('ADMIN_FINANCE_INVOICES_DETAIL');
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const routeId = requestedRouteId ?? (Array.isArray(params.id) ? params.id[0] : params.id) ?? '';
  const isDemoMode = isFrontendDemoModeEnabled();
  const DEMO_INVOICE_ID = ADMIN_FINANCE_DEMO_INVOICE_DETAIL.id;
  if (!isDemoMode) {
    return <div className="rounded-lg border border-border bg-card p-6" role="status"><h1 className="text-lg font-semibold text-text-primary">{t('UNAVAILABLE_TITLE')}</h1><p className="mt-2 text-text-secondary">{t('UNAVAILABLE_DESC')}</p><button type="button" className="mt-4 rounded-md border border-border px-4 py-2" onClick={() => router.push(ADMIN_FINANCE_INVOICES_ROUTES.ROOT)}>{t('BACK')}</button></div>;
  }

  function handleWhatsApp() {
    if (!isDemoMode || routeId !== DEMO_INVOICE_ID) return;
    const W = 42;
    const ln = '-'.repeat(W);
    const dln = '='.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const r = (l: string, v: string) => l.slice(0, 10).padEnd(10) + ' ' + v;

    const msg = [
      dln, c(ADMIN_BRAND_CONFIG.displayName), c(t('BRANCH_LABEL')), dln,
      c(t('TAX_INVOICE')), ln,
      r(`${t('TAX_INVOICE_SHORT')} :`, INV.invoiceNumber),
      r(`${t('DATE')} :`, formatDate(INV.invoiceDate)), ln,
      r(`${t('NAME')} :`, INV.studentName),
      r(`${t('SMART_ID_LABEL')}:`, INV.studentSmartId), ln,
      ...INV.items.map(i => r(i.description.slice(0, 9) + ':', `${formatAdminFinanceCurrency(i.amount)}`)),
      r(`${t('GST')} :`, `${formatAdminFinanceCurrency(INV.totalGst)}`),
      dln,
      r(`${t('TOTAL')} :`, `${formatAdminFinanceCurrency(INV.grandTotal)}`),
      dln,
      r(`${t('PAYMENT_MODE')} :`, INV.paymentMode),
      r(`${t('TRANSACTION_ID')} :`, INV.paymentTransactionId),
      r(`${t('STATUS')} :`, INV.paymentStatus.toUpperCase()), '',
      c(t('THANK_YOU_MESSAGE')),
      c(t('BRAND')),
      dln,
    ].join('\n');

    try { openAdminFinanceWhatsApp(INV.studentPhone, msg); } catch { toast.error(t('WHATSAPP_POPUP_BLOCKED'), { id: 'finance-invoice-detail-whatsapp-blocked' }); }
  }

  function handlePrint() {
    if (!isDemoMode || routeId !== DEMO_INVOICE_ID) return;
    try { AdminFinanceThermalPrint({
      type:         'receipt',
      shopName:     INV.libraryName,
      branch:       t('BRANCH_LABEL'),
      studentName:  INV.studentName,
      smartId:      INV.studentSmartId,
      phone:        INV.studentPhone,
      shift:        INV.shift,
      seat:         INV.seat,
      plan:         INV.items[0]?.description ?? t('PLAN'),
      billNumber:   INV.invoiceNumber,
      date:         formatDate(INV.invoiceDate),
      totalPayable: INV.grandTotal,
      amountPaid:   INV.paymentStatus === 'paid' ? INV.grandTotal: 0,
      discount: 0,
      balance:      INV.paymentStatus === 'paid' ? 0 : INV.grandTotal,
      paymentMode:  INV.paymentMode,
      transactionId: INV.paymentTransactionId,
      labels: { bill: t('PRINT_BILL'), date: t('PRINT_DATE'), student: t('PRINT_STUDENT'), smartId: t('PRINT_SMART_ID'), phone: t('PRINT_PHONE'), shift: t('PRINT_SHIFT'), seat: t('PRINT_SEAT'), plan: t('PRINT_PLAN'), payment: t('PRINT_PAYMENT'), transaction: t('PRINT_TRANSACTION'), total: t('PRINT_TOTAL'), paid: t('PRINT_PAID'), discount: t('PRINT_DISCOUNT'), balance: t('PRINT_BALANCE') },
    }); } catch { toast.error(t('PRINT_POPUP_BLOCKED'), { id: 'finance-invoice-detail-print-blocked' }); }
  }

  const listOnlyInvoice = ADMIN_FINANCE_DEMO_INVOICES.find((invoice) => invoice.id === routeId);
  if (routeId !== DEMO_INVOICE_ID && listOnlyInvoice) {
    return <section className="space-y-4">
      <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_BANNER')}</p>
      <button type="button" className="min-h-11 rounded-md border border-border px-4" onClick={() => router.push(ADMIN_FINANCE_INVOICES_ROUTES.ROOT)}><ArrowLeft size={18} className="inline" /> {t('BACK_BUTTON')}</button>
      <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card max-w-3xl space-y-4 p-6">
        <h1 className="text-section-title font-semibold text-text-primary">{t('TAX_INVOICE')} · {listOnlyInvoice.invoiceNumber}</h1>
        <p className="text-text-secondary">{t('LIST_ONLY_DETAIL_NOTICE')}</p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><dt className="text-text-secondary">{t('NAME')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.studentName}</dd></div>
          <div><dt className="text-text-secondary">{t('SMART_ID')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.studentId}</dd></div>
          <div><dt className="text-text-secondary">{t('INVOICE_DATE')}</dt><dd className="text-body text-text-primary">{formatDate(listOnlyInvoice.invoiceDate)}</dd></div>
          <div><dt className="text-text-secondary">{t('GRAND_TOTAL')}</dt><dd className="text-body text-text-primary font-semibold">{formatAdminFinanceCurrency(listOnlyInvoice.grandTotal)}</dd></div>
          <div><dt className="text-text-secondary">{t('PAYMENT_MODE')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.paymentMode || '—'}</dd></div>
          <div><dt className="text-text-secondary">{t('STATUS')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.paymentStatus}</dd></div>
          <div><dt className="text-text-secondary">{t('PLAN')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.planName}</dd></div>
          <div><dt className="text-text-secondary">{t('SHIFT')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.shift}</dd></div>
          <div><dt className="text-text-secondary">{t('SEAT')}</dt><dd className="text-body text-text-primary">{listOnlyInvoice.seat}</dd></div>
        </dl>
      </article>
    </section>;
  }
  if (routeId !== DEMO_INVOICE_ID) {
    return <section className="space-y-3 rounded-lg border border-border bg-card p-6"><h1 className="text-lg font-semibold text-text-primary">{t('NOT_FOUND_TITLE')}</h1><p role="status" className="text-text-secondary">{t('NOT_FOUND_DESC')}</p><button type="button" className="mt-2 rounded-md border border-border px-4 py-2" onClick={() => router.push(ADMIN_FINANCE_INVOICES_ROUTES.ROOT)}>{t('BACK')}</button></section>;
  }

  return (
    <div className="space-y-4">
      <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_BANNER')}</p>
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <button data-testid="admin_finance-page-control-001" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={() => router.push(ADMIN_FINANCE_INVOICES_ROUTES.ROOT)}>
          <ArrowLeft size={18}  strokeWidth={2}/> {t('BACK_BUTTON')}
        </button>
        <div className="flex gap-2">
          <button data-testid="admin_finance-page-control-002" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={handlePrint}>
            <Printer size={18} strokeWidth={2} /> {t('PRINT_THERMAL')}
          </button>
          <button data-testid="admin_finance-page-control-003" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={handleWhatsApp}>
            <Send size={18}  strokeWidth={2}/> {t('WHATSAPP')}
          </button>
        </div>
      </div>

      {/* A4 Invoice */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card max-w-3xl mx-auto p-8">
        <div className="text-center mb-6">
          <h1 className="text-center text-page-title font-bold text-text-primary">{t('TAX_INVOICE')}</h1>
          <p className="text-center text-caption text-text-secondary">{INV.invoiceNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="mb-1 text-badge font-semibold uppercase tracking-wider text-text-secondary">{t('FROM')}</p>
            <p className="text-body text-text-primary font-bold">{INV.libraryName}</p>
            <p className="text-caption text-text-secondary">{INV.libraryAddress}</p>
            <p className="text-caption text-text-secondary">{t('GSTIN')}: {INV.libraryGstin}</p>
            <p className="text-caption text-text-secondary">{INV.libraryPhone}</p>
          </div>
          <div>
            <p className="mb-1 text-badge font-semibold uppercase tracking-wider text-text-secondary">{t('BILLED_TO')}</p>
            <p className="text-body text-text-primary font-bold">{INV.studentName}</p>
            <p className="text-caption text-text-secondary">{t('SMART_ID')}: {INV.studentSmartId}</p>
            <p className="text-caption text-text-secondary">{INV.studentAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-text-secondary text-sm">{t('INVOICE_DATE')}: </span>
            <span className="text-body text-text-primary font-medium">{formatDate(INV.invoiceDate)}</span>
          </div>
          <div>
            <span className="text-text-secondary text-sm">{t('PAYMENT_DATE')}: </span>
            <span className="text-body text-text-primary font-medium">{formatDate(INV.paymentDate)}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-surface-highlight text-caption text-text-secondary">
              <th className="text-left py-2 px-3">{t('DESCRIPTION')}</th>
              <th className="text-left py-2 px-3">{t('HSN')}</th>
              <th className="text-left py-2 px-3">{t('DURATION')}</th>
              <th className="text-right py-2 px-3">{t('AMOUNT')}</th>
              <th className="text-right py-2 px-3">{t('GST_PERCENT')}</th>
              <th className="text-right py-2 px-3">{t('GST')}</th>
              <th className="text-right py-2 px-3">{t('TOTAL')}</th>
            </tr>
          </thead>
          <tbody>
            {INV.items.map((item) => (
              <tr key={`${item.description}-${item.hsnCode}`} className="border-b border-border text-text-primary">
                <td className="py-2 px-3 text-body text-text-primary">{item.description}</td>
                <td className="py-2 px-3 font-mono text-caption text-text-secondary">{item.hsnCode}</td>
                <td className="py-2 px-3 text-caption text-text-secondary">{item.duration}</td>
                <td className="py-2 px-3 text-right text-body text-text-primary">{formatAdminFinanceCurrency(item.amount)}</td>
                <td className="py-2 px-3 text-right text-body text-text-primary">{item.gstPercent}%</td>
                <td className="py-2 px-3 text-right text-body text-text-primary">{formatAdminFinanceCurrency(item.gstAmount)}</td>
                <td className="py-2 px-3 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(item.amount + item.gstAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-1 mb-6">
          {[
            { l: t('SUBTOTAL'), v: formatAdminFinanceCurrency(INV.subtotal) },
            { l: `${t('GST')}:`, v: formatAdminFinanceCurrency(INV.totalGst) },
          ].map(r => (
            <div key={r.l} className="flex justify-between w-52">
              <span className="text-text-secondary">{r.l}</span>
              <span className="text-body text-text-primary">{r.v}</span>
            </div>
          ))}
          <div className="my-4 h-px bg-border w-52"  />
          <div className="flex justify-between w-52 font-bold">
            <span className="text-body text-text-primary">{t('GRAND_TOTAL')}</span>
            <span className="text-success-text">{formatAdminFinanceCurrency(INV.grandTotal)}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="mb-1 text-badge font-semibold uppercase tracking-wider text-text-secondary">{t('PAYMENT_MODE')}</p>
            <p className="text-body text-text-primary font-medium">{INV.paymentMode}</p>
          </div>
          <div>
            <p className="mb-1 text-badge font-semibold uppercase tracking-wider text-text-secondary">{t('TRANSACTION_ID')}</p>
            <p className="font-mono text-caption text-text-secondary">{INV.paymentTransactionId}</p>
          </div>
          <div>
            <p className="mb-1 text-badge font-semibold uppercase tracking-wider text-text-secondary">{t('STATUS')}</p>
            <span data-testid="admin_finance-page-state-004" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg">{INV.paymentStatus}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />
        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">_________________________</p>
          <p className="text-text-secondary text-sm">{t('AUTHORIZED_SIGNATURE')}</p>
          <p className="text-caption text-text-secondary mt-4">{t('THANK_YOU', { name: INV.libraryName })}</p>
        </div>

        {/* Print/WhatsApp buttons inside card too */}
        <div className="flex gap-3 justify-center mt-6">
          <button data-testid="admin_finance-page-control-005" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={handlePrint}>
            <Printer size={18} strokeWidth={2} /> {t('PRINT_THERMAL_RECEIPT')}
          </button>
          <button data-testid="admin_finance-page-control-006" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={handleWhatsApp}>
            <Send size={18}  strokeWidth={2}/> {t('SEND_WHATSAPP')}
          </button>
        </div>
      </div>
    </div>
  );
}
