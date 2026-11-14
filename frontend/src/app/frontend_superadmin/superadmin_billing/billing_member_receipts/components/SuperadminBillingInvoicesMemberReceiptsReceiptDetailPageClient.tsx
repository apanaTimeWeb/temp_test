'use client';
/** Responsibility: Superadmin Finance Receipt Id Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations, useLocale } from 'next-intl';
import { SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES as __SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/config/superadmin_billing_member_receipts.url_config";
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Info, Printer, Send } from 'lucide-react';
import { printThermal } from '@/lib/thermalPrint';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/utils/SuperadminBillingInvoicesMemberReceiptsReceiptDetailFormatters';
import { SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/mocks/fixtures/SuperadminBillingInvoicesMemberReceiptsReceiptDetailMockFixtures';

const RECEIPT_ZIGZAG_DOT_KEYS = Array.from({ length: 20 }, (_, position) => `receipt-zigzag-dot-${position + 1}`);




/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBillingInvoicesMemberReceiptsReceiptDetailPageClient({ id }: { id?: string }) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const router = useRouter();
  const requestedReceiptId = typeof id === 'string' ? id.trim() : '';
  const isSamplePreviewRoute = requestedReceiptId === SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.id;
  


  function handlePrint() {
    printThermal({
      type:         'receipt',
      shopName:     'SAMPLE PREVIEW — NOT A PAYMENT',
      branch:       'Main Branch',
      studentName:  SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.studentName,
      smartId:      SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.studentId,
      phone:        SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.phone,
      shift:        SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.shift,
      seat:         SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.seat,
      plan:         SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.plan,
      billNumber:   requestedReceiptId,
      date:         SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.date,
      totalPayable: SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.total,
      amountPaid:   0,
      discount:     0,
      balance:      SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.total,
      paymentMode:  'SAMPLE ONLY — NOT PAID',
      transactionId: SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.txnId,
    });
  }

  if (!isSamplePreviewRoute) {
    return (
      <section className="space-y-4" aria-labelledby="receipt-unavailable-title">
        <p className="fin-info-box" role="status">
          {tCopy("COPY.RECEIPT")}<strong>{requestedReceiptId || tCopy('COPY.MISSING_ROUTE_ID_DESCRIPTION')}</strong> {tCopy("COPY.CANNOT_BE_DISPLAYED_SAFELY_THIS_SOURCE_ARCHIVE_HAS_NO_VERIFIED_REC_B834EC25")}</p>
        <h1 id="receipt-unavailable-title" className="fin-page-title">{tCopy("COPY.RECEIPT_DETAILS_UNAVAILABLE")}</h1>
        <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS.PAGE)} data-testid="superadmin-finance-finance-receipt-id-back-to-receipts-1">
          <ArrowLeft size={11} aria-hidden="true" /> {tCopy("COPY.BACK_TO_RECEIPTS")}</button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <p className="fin-info-box" role="status">{tCopy("COPY.SAMPLE_ONLY_NO_PAYMENT_WAS_CHARGED_OR_RECORDED_ALL_FIELDS_BELOW_AR_3C91B1F5")}<strong>{requestedReceiptId}</strong>{tCopy("COPY.NO_RECEIPT_DETAIL_API_CONTRACT_IS_PRESENT_IN_THIS_ARCHIVE")}</p>
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_RECEIPTS_ROUTES.SUPERADMIN_FINANCE_MEMBER_RECEIPTS_URLS.PAGE)} data-testid="superadmin-finance-finance-receipt-id-back-to-receipts-2">
          <ArrowLeft size={11} /> {tCopy("COPY.BACK_TO_RECEIPTS")}</button>
        <div className="flex gap-2">
          <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handlePrint} data-testid="superadmin-finance-finance-receipt-id-print-sample-preview-3">
            <Printer size={11} /> {tCopy("COPY.PRINT_SAMPLE_PREVIEW")}</button>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_SAMPLE_RECEIPT_DATA")} data-testid="superadmin-finance-finance-receipt-id-sending-is-disabled-for-sample-receipt-data-4">
            <Send size={11} /> {tCopy("COPY.WHATSAPP_UNAVAILABLE")}</button>
        </div>
      </div>

      {/* Visual receipt */}
      <div className="flex flex-col items-center">
        <div className="fin-receipt-thermal">
          <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
            {RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}
          </div>
          <div className="fin-receipt-body">
            <div className="fin-receipt-logo-circle">
              <BookOpen size={28} className="fin-receipt-accent-icon" />
            </div>
            <p className="fin-receipt-brand">{tCopy("COPY.LIBRARY_OS")}</p>
            <h2 className="fin-receipt-title">{tCopy("COPY.SAMPLE_RECEIPT_PREVIEW")}</h2>
            <div className="fin-receipt-id-box">
              <p className="fin-receipt-id-label">{tCopy("COPY.RECEIPT_NO")}</p>
              <p className="fin-receipt-id-value">{requestedReceiptId}</p>
            </div>
            <div className="space-y-3 text-left mb-6">
              {[
                ['Date',       SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.date],
                ['Student',    SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.studentName],
                ['Smart ID',   SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.studentId],
                ['Phone',      '+91 ' + SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.phone],
                ['Shift',      SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.shift],
                ['Seat',       SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.seat],
                ['Plan',       SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.plan],
                ['Mode',       SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.paymentMode],
                ['Txn ID',     SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.txnId],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="fin-receipt-row-label">{l}</span>
                  <span className="fin-receipt-row-value">{v}</span>
                </div>
              ))}
            </div>
            {/* Items */}
            <div className="text-left mb-4 w-full">
              {SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.items.map((item) => (
                <div key={item.labelKey} className="flex justify-between text-sm">
                  <span className="fin-cell-subtext">{tCopy(item.labelKey)}</span>
                  <span className="fin-text-body">{formatMajorUnitPreviewCurrency(item.amount, 'INR', locale)}</span>
                </div>
              ))}
            </div>
            <div className="fin-receipt-dashed-line">
              <p className="fin-receipt-total-label">{tCopy("COPY.PREVIEW_TOTAL_NOT_PAID")}</p>
              <p className="fin-receipt-total-amount">{formatMajorUnitPreviewCurrency(SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL.total, 'INR', locale)}</p>
            </div>
            <div className="fin-receipt-paid-badge" role="note" aria-label={tCopy("COPY.SAMPLE_PREVIEW_ONLY_NO_PAYMENT_RECORDED")}>
              <Info size={16} className="fin-receipt-accent-icon" />
              <span className="fin-receipt-paid-text">{tCopy("COPY.SAMPLE_ONLY_NO_PAYMENT_RECORDED")}</span>
            </div>
            <p className="fin-receipt-footer-quote">{tCopy("COPY.KNOWLEDGE_IS_THE_BEST_INVESTMENT")}</p>
            <p className="fin-receipt-footer-thanks">{tCopy("COPY.THANK_YOU_KEEP_STUDYING")}</p>
          </div>
          <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
            {RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="w-full max-w-xs mt-6 flex flex-col gap-3">
          <button type="button" className="fin-receipt-btn-wa" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_SAMPLE_RECEIPT_DATA")} aria-disabled="true" data-testid="superadmin-finance-finance-receipt-id-sending-is-disabled-for-sample-receipt-data-5">
            <Send size={16} /> {tCopy("COPY.WHATSAPP_UNAVAILABLE_FOR_SAMPLE_DATA")}</button>
          <button type="button" className="fin-receipt-btn-secondary" onClick={handlePrint} data-testid="superadmin-finance-finance-receipt-id-print-sample-preview-80-mm-6">
            <Printer size={16} /> {tCopy("COPY.PRINT_SAMPLE_PREVIEW_80MM")}</button>
        </div>
      </div>
    </div>
  );
}
