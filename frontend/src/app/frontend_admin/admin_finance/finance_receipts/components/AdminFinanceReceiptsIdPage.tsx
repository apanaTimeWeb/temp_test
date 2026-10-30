'use client';
// Responsibility: AdminFinanceReceiptsIdPage component owned by admin_finance; responsibility folder: components.
import { ADMIN_FINANCE_RECEIPTS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_receipts/config/admin_finance_receipts.url_config';
import { formatAdminFinanceCurrency, formatDate } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsFormat';
// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { ArrowLeft, BookOpen, CheckCircle, Printer, Send } from 'lucide-react';
import { toast } from 'sonner';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsWhatsApp';
import { AdminFinanceThermalPrint } from '@/app/frontend_admin/admin_finance/finance_receipts/utils/AdminFinanceReceiptsThermalPrint';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_DEMO_RECEIPT_DETAIL, ADMIN_FINANCE_DEMO_RECEIPTS } from '@/app/frontend_admin/admin_finance/finance_receipts/mocks/scenarios/admin_finance_receipts.scenarios';

const RECEIPT_DATA = ADMIN_FINANCE_DEMO_RECEIPT_DETAIL;

export function AdminFinanceReceiptsIdPage({ routeId: requestedRouteId }: { routeId?: string } = {}) {
  const t = useTranslations('ADMIN_FINANCE_RECEIPTS_DETAIL');
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const routeId = requestedRouteId ?? (Array.isArray(params.id) ? params.id[0] : params.id) ?? '';
  const isDemoMode = isFrontendDemoModeEnabled();

  function handleWhatsApp() {
    if (!isDemoMode || routeId !== RECEIPT_DATA.id) return;
    const W = 42;
    const ln = '-'.repeat(W);
    const dln = '='.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const r = (l: string, v: string) => l.slice(0,10).padEnd(10) + ' ' + v;

    const msg = [
      dln, c(ADMIN_BRAND_CONFIG.displayName), c(t('BRANCH_LABEL')), dln,
      c(t('FEE_RECEIPT')), ln,
      r(`${t('RECEIPT_LABEL')} :`, RECEIPT_DATA.receiptNo),
      r(`${t('DATE')} :`, formatDate(RECEIPT_DATA.date)), ln,
      r(`${t('NAME')} :`, RECEIPT_DATA.studentName),
      r(`${t('SMART_ID_LABEL')}:`, RECEIPT_DATA.studentId),
      r(`${t('PHONE_LABEL')}:`, RECEIPT_DATA.phone), ln,
      r(`${t('PLAN_LABEL')}:`, RECEIPT_DATA.plan), ln,
      ...RECEIPT_DATA.items.map(i => r(i.label.slice(0,9)+':', `${formatAdminFinanceCurrency(i.amount)}`)),
      dln,
      r(`${t('TOTAL')} :`, `${formatAdminFinanceCurrency(RECEIPT_DATA.total)}`),
      dln,
      r(`${t('MODE')} :`, RECEIPT_DATA.paymentMode),
      r(`${t('TXN_ID_LABEL')} :`, RECEIPT_DATA.txnId), '',
      c(t('DEMO_PREVIEW_MESSAGE')),
      c(t('THANK_YOU_MESSAGE')),
      dln,
    ].join('\n');

    try {
      openAdminFinanceWhatsApp(RECEIPT_DATA.phone, msg);
    } catch {
      toast.error(t('UNABLE_WHATSAPP'), { id: 'admin_finance-finance_receipts-components-AdminFinanceReceiptsIdPage-toast-58-1' });
    }
  }

  function handlePrint() {
    if (!isDemoMode || routeId !== RECEIPT_DATA.id) return;
    try {
      AdminFinanceThermalPrint({
      type:         'receipt',
      shopName:     ADMIN_BRAND_CONFIG.displayName,
      branch:       t('BRANCH_LABEL'),
      studentName:  RECEIPT_DATA.studentName,
      smartId:      RECEIPT_DATA.studentId,
      phone:        RECEIPT_DATA.phone,
      shift:        RECEIPT_DATA.shift,
      seat:         RECEIPT_DATA.seat,
      plan:         RECEIPT_DATA.plan,
      billNumber:   RECEIPT_DATA.receiptNo,
      date:         formatDate(RECEIPT_DATA.date),
      totalPayable: RECEIPT_DATA.total,
      amountPaid:   RECEIPT_DATA.total,
      discount: 0,
      balance: 0,
      paymentMode:  RECEIPT_DATA.paymentMode,
      transactionId: RECEIPT_DATA.txnId,
        labels: { bill: t('PRINT_BILL'), date: t('PRINT_DATE'), student: t('PRINT_STUDENT'), smartId: t('PRINT_SMART_ID'), phone: t('PRINT_PHONE'), shift: t('PRINT_SHIFT'), seat: t('PRINT_SEAT'), plan: t('PRINT_PLAN'), payment: t('PRINT_PAYMENT'), transaction: t('PRINT_TRANSACTION'), total: t('PRINT_TOTAL'), paid: t('PRINT_PAID'), discount: t('PRINT_DISCOUNT'), balance: t('PRINT_BALANCE') },
      });
      toast.info(t('PRINT_PREVIEW'), { id: 'admin_finance-finance_receipts-components-AdminFinanceReceiptsIdPage-toast-84-2' });
    } catch {
      toast.error(t('PRINT_WINDOW_ERROR'), { id: 'admin_finance-finance_receipts-components-AdminFinanceReceiptsIdPage-toast-86-3' });
    }
  }

  if (!isDemoMode) {
    return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('UNAVAILABLE_DESC')}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" onClick={() => router.push(ADMIN_FINANCE_RECEIPTS_ROUTES.ROOT)}>{t('BACK')}</button></section>;
  }
  const listOnlyReceipt = ADMIN_FINANCE_DEMO_RECEIPTS.find((receipt) => receipt.id === routeId);
  if (routeId !== RECEIPT_DATA.id && listOnlyReceipt) {
    return <section className="space-y-4">
      <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_BANNER')}</p>
      <button type="button" className="min-h-11 rounded-md border border-border px-4" onClick={() => router.push(ADMIN_FINANCE_RECEIPTS_ROUTES.ROOT)}><ArrowLeft size={18} className="inline" /> {t('BACK')}</button>
      <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card max-w-3xl space-y-4 p-6">
        <h1 className="text-section-title font-semibold text-text-primary">{t('PAYMENT_RECEIPT')} · {listOnlyReceipt.receiptNumber}</h1>
        <p className="text-text-secondary">{t('LIST_ONLY_DETAIL_NOTICE')}</p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><dt className="text-text-secondary">{t('STUDENT')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.studentName}</dd></div>
          <div><dt className="text-text-secondary">{t('SMART_ID')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.studentId}</dd></div>
          <div><dt className="text-text-secondary">{t('DATE')}</dt><dd className="text-body text-text-primary">{formatDate(listOnlyReceipt.date)}</dd></div>
          <div><dt className="text-text-secondary">{t('TOTAL_PAID')}</dt><dd className="text-body text-text-primary font-semibold">{formatAdminFinanceCurrency(listOnlyReceipt.amount)}</dd></div>
          <div><dt className="text-text-secondary">{t('MODE')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.paymentMode}</dd></div>
          <div><dt className="text-text-secondary">{t('PLAN')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.planName}</dd></div>
          <div><dt className="text-text-secondary">{t('SHIFT')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.shift}</dd></div>
          <div><dt className="text-text-secondary">{t('SEAT')}</dt><dd className="text-body text-text-primary">{listOnlyReceipt.seat}</dd></div>
        </dl>
      </article>
    </section>;
  }
  if (routeId !== RECEIPT_DATA.id) {
    return <section className="space-y-3 rounded-lg border border-border bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('NOT_FOUND_TITLE')}</h1><p role="status" className="text-text-secondary">{t('NOT_FOUND_DESC')}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" onClick={() => router.push(ADMIN_FINANCE_RECEIPTS_ROUTES.ROOT)}>{t('BACK')}</button></section>;
  }

  return (
    <div className="space-y-4">
      <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_BANNER')}</p>
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button data-testid="admin_finance-page-control-001" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={() => router.push(ADMIN_FINANCE_RECEIPTS_ROUTES.ROOT)}>
          <ArrowLeft size={18} strokeWidth={2} /> {t('BACK')}
        </button>
        <div className="flex gap-2">
          <button data-testid="admin_finance-page-control-002" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={handlePrint}>
            <Printer size={18}  strokeWidth={2}/> {t('PRINT_THERMAL')}
          </button>
          <button data-testid="admin_finance-page-control-003" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={handleWhatsApp}>
            <Send size={18}  strokeWidth={2}/> {t('WHATSAPP')}
          </button>
        </div>
      </div>

      {/* Visual receipt */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-border bg-card shadow-dialog">
          <div className="flex h-4 justify-center gap-1 overflow-hidden bg-card">
            {Array.from({ length: 20 }).map((_, i) => <div key={`skeleton-${i + 1}`} className="-mt-1 h-3 w-3 rounded-full bg-surface-zebra" />)}
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-floating">
              <BookOpen size={18} className="text-primary"  strokeWidth={2}/>
            </div>
            <p className="mt-3 text-badge font-semibold uppercase tracking-wide text-text-primary">{t('BRAND')}</p>
            <h2 className="mt-1 text-xl font-bold text-text-primary">{t('PAYMENT_RECEIPT')}</h2>
            <div className="mb-8 rounded-xl bg-surface-zebra px-4 py-3">
              <p className="text-micro uppercase tracking-widest text-text-secondary">{t('RECEIPT_NO')}</p>
              <p className="mt-0.5 font-mono text-ui tracking-wider text-text-primary">{RECEIPT_DATA.receiptNo}</p>
            </div>
            <div className="space-y-3 text-left mb-6">
              {[
                [t('DATE'),       formatDate(RECEIPT_DATA.date)],
                [t('STUDENT'),    RECEIPT_DATA.studentName],
                [t('SMART_ID'),   RECEIPT_DATA.studentId],
                [t('PHONE'),      '+91 ' + RECEIPT_DATA.phone],
                [t('SHIFT'),      RECEIPT_DATA.shift],
                [t('SEAT'),       RECEIPT_DATA.seat],
                [t('PLAN'),       RECEIPT_DATA.plan],
                [t('MODE'),       RECEIPT_DATA.paymentMode],
                [t('TXN_ID'),     RECEIPT_DATA.txnId],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-badge uppercase text-text-secondary">{l}</span>
                  <span className="text-body font-bold text-text-primary">{v}</span>
                </div>
              ))}
            </div>
            {/* Items */}
            <div className="text-left mb-4 w-full">
              {RECEIPT_DATA.items.map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-caption text-text-secondary">{item.label}</span>
                  <span className="text-body text-text-primary">{formatAdminFinanceCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mb-8 border-t-2 border-dashed border-border pt-6">
              <p className="text-badge font-bold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_PAID')}</p>
              <p className="text-[40px] font-black tracking-tight text-text-primary">{formatAdminFinanceCurrency(RECEIPT_DATA.total)}</p>
            </div>
            <div data-testid="admin_finance-page-state-004" className="mb-10 flex items-center justify-center gap-2 rounded-xl bg-purple-bg p-3">
              <CheckCircle size={18} className="text-primary"  strokeWidth={2}/>
              <span className="text-badge font-bold uppercase tracking-wider text-purple-text">{t('DEMO_SAMPLE_PAYMENT')}</span>
            </div>
            <p className="text-badge italic text-text-secondary">&quot;{t('FOOTER_QUOTE')}&quot;</p>
            <p className="mt-2 text-body font-bold text-text-primary">{t('THANKS')}</p>
          </div>
          <div className="flex h-4 justify-center gap-1 overflow-hidden bg-card">
            {Array.from({ length: 20 }).map((_, i) => <div key={`skeleton-${i + 1}`} className="mt-1 h-3 w-3 rounded-full bg-surface-zebra" />)}
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="w-full max-w-xs mt-6 flex flex-col gap-3">
          <button data-testid="admin_finance-page-control-005" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-floating text-body font-semibold text-pay-upi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={handleWhatsApp}>
            <Send size={18}  strokeWidth={2}/> {t('SEND_WHATSAPP')}
          </button>
          <button data-testid="admin_finance-page-control-006" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-floating text-body font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={handlePrint}>
            <Printer size={18}  strokeWidth={2}/> {t('PRINT_80MM')}
          </button>
        </div>
      </div>
    </div>
  );
}
