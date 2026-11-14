'use client';
/** Responsibility: Superadmin Finance Sample Receipt Modal; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning feature event -> local dialog/confirmation state -> typed callback to the owning component; API writes remain contract-gated. */

import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, CheckCircle, MessageSquare, Printer, X } from 'lucide-react';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionFormatters';
import { SUPERADMIN_FINANCE_MODE_LABELS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';
import type { SuperadminFinanceSampleReceiptModalProps } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModalComponentTypes';
import { useSuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptDialog } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/hooks/useSuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptDialog';

const RECEIPT_ZIGZAG_DOT_KEYS = Array.from({ length: 20 }, (_, position) => `receipt-zigzag-dot-${position + 1}`);


/**
 * Performs the superadmin billing overview member payments collection sample receipt modal operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminFinanceSampleReceiptModalProps.
 */
export default function SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModal({ receiptData, onClose, onPrint }: SuperadminFinanceSampleReceiptModalProps) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const dialogRef = useSuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptDialog(onClose);
  return (
    <div className="fin-receipt-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="superadmin-superadmin-finance-collect-fee-sample-receipt-modal-div-line-15">
      <section ref={dialogRef} tabIndex={-1} className="fin-receipt-modal" role="dialog" aria-modal="true" aria-labelledby="sample-receipt-modal-title" onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-finance-collect-fee-sample-receipt-modal-section-line-16">
        <div className="fin-receipt-modal-header">
          <div>
            <h2 id="sample-receipt-modal-title" className="fin-receipt-modal-title">{tCopy("COPY.SAMPLE_RECEIPT_PREVIEW_NO_PAYMENT_RECORDED")}</h2>
            <span className="fin-receipt-modal-badge"><CheckCircle size={11} /> {receiptData.receiptNo}</span>
          </div>
          <button type="button" className="fin-receipt-modal-close" onClick={onClose} aria-label={tCopy("COPY.CLOSE_SAMPLE_RECEIPT")} data-testid="superadmin-finance-finance-sample-receipt-close-sample-receipt-1"><X size={15} /></button>
        </div>
        <div className="fin-receipt-modal-body">
          <div className="fin-receipt-thermal fin-receipt-modal-card">
            <div className="fin-receipt-zigzag fin-receipt-zigzag--top">{RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}</div>
            <div className="fin-receipt-body">
              <div className="fin-receipt-logo-circle"><BookOpen size={28} className="fin-receipt-accent-icon" /></div>
              <p className="fin-receipt-brand">{tCopy("COPY.LIBRARY_OS")}</p>
              <p className="fin-receipt-title">{tCopy("COPY.SAMPLE_RECEIPT")}</p>
              <p className="fin-info-box" role="status">{tCopy("COPY.SAMPLE_ONLY_NO_PAYMENT_WAS_CHARGED_OR_RECORDED")}</p>
              <div className="fin-receipt-id-box mt-6"><p className="fin-receipt-id-label">{tCopy("COPY.RECEIPT_NUMBER")}</p><p className="fin-receipt-id-value">{receiptData.receiptNo}</p></div>
              <div className="fin-receipt-modal-details">
                {[
                  ['Date', receiptData.date], ['Student', receiptData.studentName], ['Sample ID', receiptData.studentId],
                  ['Phone', `+91-${receiptData.phone.replace(/\d(?=\d{4})/g, '*')}`], ['Mode', SUPERADMIN_FINANCE_MODE_LABELS[receiptData.mode]],
                ].map(([label, value]) => <div key={label} className="fin-receipt-modal-row"><span className="fin-receipt-row-label">{label}</span><span className="fin-receipt-row-value">{value}</span></div>)}
              </div>
              <div className="fin-receipt-dashed-line"><p className="fin-receipt-total-label">{tCopy("COPY.PREVIEW_TOTAL")}</p><p className="fin-receipt-total-amount">{formatMajorUnitPreviewCurrency(receiptData.total, 'INR', locale)}</p></div>
              <p className="fin-receipt-footer-quote">{tCopy("COPY.PREVIEW_ONLY_NOT_A_PROOF_OF_PAYMENT")}</p>
              <p className="fin-receipt-footer-thanks">{tCopy("COPY.NO_ACCOUNT_OR_PAYMENT_STATE_WAS_CHANGED")}</p>
            </div>
            <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">{RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}</div>
          </div>
          <div className="fin-receipt-modal-actions">
            <p className="fin-receipt-modal-actions-title">{tCopy("COPY.PRINT_OR_CLOSE_SAMPLE_PREVIEW")}</p>
            <button type="button" className="fin-receipt-btn-wa fin-receipt-btn-wa--full" disabled title={tCopy("COPY.UNAVAILABLE_SAMPLE_RECIPIENT_IS_SYNTHETIC_AND_NO_MESSAGING_CONTRACT_IS_SUPPLIED")} data-testid="superadmin-finance-finance-sample-receipt-unavailable-sample-recipient-is-synthetic-and-no-messaging-contract-is-supplied-2"><MessageSquare size={16} /> {tCopy("COPY.WHATSAPP_SEND_UNAVAILABLE_FOR_SYNTHETIC_SAMPLE")}</button>
            <div className="fin-divider" />
            <button type="button" className="fin-receipt-btn-secondary w-full" onClick={onPrint} data-testid="superadmin-finance-finance-sample-receipt-print-sample-preview-3"><Printer size={15} /> {tCopy("COPY.PRINT_SAMPLE_PREVIEW")}</button>
            <button type="button" className="fin-receipt-btn-download w-full mt-0" onClick={onClose} data-testid="superadmin-finance-finance-sample-receipt-close-preview-4">{tCopy("COPY.CLOSE_PREVIEW")}</button>
            <div className="fin-receipt-modal-info"><div className="fin-receipt-modal-info-row"><span className="fin-cell-subtext">{tCopy("COPY.SAMPLE_RECEIPT_2")}</span><span className="fin-cell-name">{receiptData.receiptNo}</span></div><div className="fin-receipt-modal-info-row"><span className="fin-cell-subtext">{tCopy("COPY.PREVIEW_AMOUNT")}</span><span className="fin-cell-name">{formatMajorUnitPreviewCurrency(receiptData.total, 'INR', locale)}</span></div><div className="fin-receipt-modal-info-row"><span className="fin-cell-subtext">{tCopy("COPY.PAYMENT_MODE_2")}</span><span className="fin-cell-name">{SUPERADMIN_FINANCE_MODE_LABELS[receiptData.mode]}</span></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
