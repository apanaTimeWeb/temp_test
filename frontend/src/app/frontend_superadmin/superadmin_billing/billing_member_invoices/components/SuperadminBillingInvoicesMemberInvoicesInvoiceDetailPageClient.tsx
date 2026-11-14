'use client';
import SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState';
/** Responsibility: Superadmin Finance Invoice Id Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations, useLocale } from 'next-intl';
import { SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES as __SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/config/superadmin_billing_member_invoices.url_config";
import { useRouter } from 'next/navigation';
import { formatMajorUnitPreviewCurrency, formatDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/utils/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailFormatters';
import { Printer, ArrowLeft, Send } from 'lucide-react';
import { printThermal } from '@/lib/thermalPrint';
import { SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/mocks/fixtures/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailMockFixtures';




/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBillingInvoicesMemberInvoicesInvoiceDetailPageClient({ id }: { id?: string }) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const router = useRouter();
  const requestedInvoiceId = typeof id === 'string' ? id.trim() : '';
  const isSamplePreviewRoute = requestedInvoiceId === SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.invoiceNumber;
  


  function handlePrint() {
    printThermal({
      type:         'receipt',
      shopName:     'SAMPLE PREVIEW — NOT A TAX INVOICE',
      branch:       'Main Branch',
      studentName:  SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentName,
      smartId:      SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentSmartId,
      phone:        SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentPhone,
      shift:        SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.shift,
      seat:         SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.seat,
      plan:         SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.items[0].description,
      billNumber:   requestedInvoiceId,
      date:         formatDate(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.invoiceDate, locale),
      totalPayable: SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.grandTotal,
      amountPaid:   SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentStatus === 'paid' ? SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.grandTotal : 0,
      discount:     0,
      balance:      SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentStatus === 'paid' ? 0 : SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.grandTotal,
      paymentMode:  SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentMode,
      transactionId: SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentTransactionId,
    });
  }

  if (!isSamplePreviewRoute) {
    return (
      <section className="space-y-4" aria-labelledby="invoice-unavailable-title">
      {(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.items?.length === 0) && <SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState filtered />}

        <p className="fin-info-box" role="status">
          {tCopy("COPY.INVOICE")}<strong>{requestedInvoiceId || tCopy('COPY.MISSING_ROUTE_ID_DESCRIPTION')}</strong> {tCopy("COPY.CANNOT_BE_DISPLAYED_SAFELY_THIS_SOURCE_ARCHIVE_HAS_NO_VERIFIED_INV_541C52A9")}</p>
        <h1 id="invoice-unavailable-title" className="fin-page-title">{tCopy("COPY.INVOICE_DETAILS_UNAVAILABLE")}</h1>
        <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES.SUPERADMIN_FINANCE_INVOICE_URLS.PAGE)} data-testid="superadmin-finance-finance-invoice-id-back-to-invoices-1">
          <ArrowLeft size={11} aria-hidden="true" /> {tCopy("COPY.BACK_TO_INVOICES")}</button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <p className="fin-info-box" role="status">{tCopy("COPY.SAMPLE_ONLY_THIS_IS_NOT_A_TAX_INVOICE_PAYMENT_RECORD_OR_VALID_GST__65B56885")}<strong>{requestedInvoiceId}</strong>{tCopy("COPY.NO_INVOICE_DETAIL_API_CONTRACT_IS_SUPPLIED")}</p>
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push(__SUPERADMIN_BILLING_MEMBER_INVOICES_ROUTES.SUPERADMIN_FINANCE_INVOICE_URLS.PAGE)} data-testid="superadmin-finance-finance-invoice-id-back-to-invoices-2">
          <ArrowLeft size={11} /> {tCopy("COPY.BACK_TO_INVOICES")}</button>
        <div className="flex gap-2">
          <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handlePrint} data-testid="superadmin-finance-finance-invoice-id-print-sample-preview-3">
            <Printer size={11} /> {tCopy("COPY.PRINT_SAMPLE_PREVIEW")}</button>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_SAMPLE_INVOICE_DATA")} data-testid="superadmin-finance-finance-invoice-id-sending-is-disabled-for-sample-invoice-data-4">
            <Send size={11} /> {tCopy("COPY.WHATSAPP_UNAVAILABLE")}</button>
        </div>
      </div>

      {/* A4 Invoice */}
      <div className="fin-card max-w-3xl mx-auto p-8">
        <div className="text-center mb-6">
          <h1 className="fin-invoice-title">{tCopy("COPY.SAMPLE_INVOICE_PREVIEW_NOT_VALID_FOR_TAX")}</h1>
          <p className="fin-invoice-number">{requestedInvoiceId}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="fin-invoice-section-head">{tCopy("COPY.FROM")}</p>
            <p className="fin-text-body font-bold">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.libraryName}</p>
            <p className="fin-invoice-field-label">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.libraryAddress}</p>
            <p className="fin-invoice-field-label">{tCopy("COPY.SAMPLE_GST_FIELD_NOT_VALID")}{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.libraryGstin}</p>
            <p className="fin-invoice-field-label">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.libraryPhone}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">{tCopy("COPY.BILLED_TO")}</p>
            <p className="fin-text-body font-bold">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentName}</p>
            <p className="fin-invoice-field-label">{tCopy("COPY.SMART_ID")}{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentSmartId}</p>
            <p className="fin-invoice-field-label">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.studentAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="fin-text-muted text-sm">{tCopy("COPY.INVOICE_DATE")}</span>
            <span className="fin-text-body font-medium">{formatDate(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.invoiceDate, locale)}</span>
          </div>
          <div>
            <span className="fin-text-muted text-sm">{tCopy("COPY.PAYMENT_DATE")}</span>
            <span className="fin-text-body font-medium">{formatDate(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentDate, locale)}</span>
          </div>
        </div>

        <div className="fin-divider" />

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-2 px-3">{tCopy("COPY.DESCRIPTION")}</th>
              <th className="text-left py-2 px-3">{tCopy("COPY.HSN")}</th>
              <th className="text-left py-2 px-3">{tCopy("COPY.DURATION")}</th>
              <th className="text-right py-2 px-3">{tCopy("COPY.AMOUNT")}</th>
              <th className="text-right py-2 px-3">{tCopy("COPY.GST")}</th>
              <th className="text-right py-2 px-3">{tCopy("COPY.GST_2")}</th>
              <th className="text-right py-2 px-3">{tCopy("COPY.TOTAL")}</th>
            </tr>
          </thead>
          <tbody>
            {SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.items.map((item, i) => (
              <tr key={`${item.hsnCode}-${item.description}`} className="fin-table-row">
                <td className="py-2 px-3 fin-text-body">{item.description}</td>
                <td className="py-2 px-3 fin-mono">{item.hsnCode}</td>
                <td className="py-2 px-3 fin-cell-subtext">{item.duration}</td>
                <td className="py-2 px-3 text-right fin-text-body">{formatMajorUnitPreviewCurrency(item.amount, 'INR', locale)}</td>
                <td className="py-2 px-3 text-right fin-text-body">{item.gstPercent}%</td>
                <td className="py-2 px-3 text-right fin-text-body">{formatMajorUnitPreviewCurrency(item.gstAmount, 'INR', locale)}</td>
                <td className="py-2 px-3 text-right font-semibold fin-text-body">{formatMajorUnitPreviewCurrency(item.amount + item.gstAmount, 'INR', locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-1 mb-6">
          {[
            { l: 'Subtotal:', v: formatMajorUnitPreviewCurrency(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.subtotal, 'INR', locale) },
            { l: 'GST:',      v: formatMajorUnitPreviewCurrency(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.totalGst, 'INR', locale) },
          ].map((r) => (
            <div key={r.l} className="flex justify-between w-52">
              <span className="fin-text-muted">{r.l}</span>
              <span className="fin-text-body">{r.v}</span>
            </div>
          ))}
          <div className="fin-divider fin-divider--invoice" />
          <div className="flex justify-between w-52 font-bold">
            <span className="fin-text-body">{tCopy("COPY.GRAND_TOTAL")}</span>
            <span className="fin-text-success">{formatMajorUnitPreviewCurrency(SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.grandTotal, 'INR', locale)}</span>
          </div>
        </div>

        <div className="fin-divider" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="fin-invoice-section-head">{tCopy("COPY.PAYMENT_MODE")}</p>
            <p className="fin-text-body font-medium">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentMode}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">{tCopy("COPY.TRANSACTION_ID")}</p>
            <p className="fin-mono">{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.paymentTransactionId}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">{tCopy("COPY.STATUS")}</p>
            <span className="fin-badge fin-badge--warning">{tCopy("COPY.SAMPLE_ONLY_NOT_PAID")}</span>
          </div>
        </div>

        <div className="fin-divider" />
        <div className="text-center mt-4">
          <p className="fin-text-muted text-sm">_________________________</p>
          <p className="fin-text-muted text-sm">{tCopy("COPY.AUTHORIZED_SIGNATURE")}</p>
          <p className="fin-cell-subtext mt-4">{tCopy("COPY.THANK_YOU_FOR_CHOOSING")}{SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL.libraryName}</p>
        </div>

        {/* Print/WhatsApp buttons inside card too */}
        <div className="flex gap-3 justify-center mt-6">
          <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handlePrint} data-testid="superadmin-finance-finance-invoice-id-print-thermal-receipt-5">
            <Printer size={13} /> {tCopy("COPY.PRINT_THERMAL_RECEIPT")}</button>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tCopy("COPY.SENDING_IS_DISABLED_FOR_BUNDLED_SAMPLE_INVOICE_DATA")} aria-disabled="true" data-testid="superadmin-finance-finance-invoice-id-sending-is-disabled-for-bundled-sample-invoice-data-6">
            <Send size={13} /> {tCopy("COPY.WHATSAPP_UNAVAILABLE_FOR_SAMPLE_DATA")}</button>
        </div>
      </div>
    </div>
  );
}
