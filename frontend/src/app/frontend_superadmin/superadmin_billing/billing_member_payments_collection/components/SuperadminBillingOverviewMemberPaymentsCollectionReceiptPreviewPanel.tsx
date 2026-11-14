'use client';
/** Responsibility: Superadmin Finance Receipt Preview Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, CheckCircle, X } from 'lucide-react';
import { SUPERADMIN_FINANCE_MODE_LABELS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';
import { formatDate, formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionFormatters';
import type { SuperadminFinanceReceiptPreviewPanelProps } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanelComponentTypes';

const RECEIPT_ZIGZAG_DOT_KEYS = Array.from({ length: 20 }, (_, position) => `receipt-zigzag-dot-${position + 1}`);


/**
 * Performs the superadmin billing overview member payments collection receipt preview panel operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @param props Input required by the declared feature contract. Declared type: SuperadminFinanceReceiptPreviewPanelProps.
 */
export default function SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanel(props: SuperadminFinanceReceiptPreviewPanelProps) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const { selectedStudent, mode, total, nextReceiptNumber, canGenerate, onCancel } = props;
  return (
    <div className="lg:col-span-2"><div className="fin-receipt-preview"><div className="fin-receipt-thermal">
      <div className="fin-receipt-zigzag fin-receipt-zigzag--top">{RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}</div>
      <div className="fin-receipt-body">
        <div className="fin-receipt-logo-circle"><BookOpen size={28} className="fin-receipt-accent-icon" /></div>
        <p className="fin-receipt-brand">{tCopy("COPY.LIBRARY_OS")}</p><p className="fin-receipt-title">{tCopy("COPY.SAMPLE_RECEIPT_PREVIEW")}</p>
        <p className="fin-info-box" role="status">{tCopy("COPY.NO_PAYMENT_IS_CHARGED_OR_RECORDED_BY_THIS_DEMO")}</p>
        <div className="fin-receipt-id-box mt-6"><p className="fin-receipt-id-label">{tCopy("COPY.PREVIEW_REFERENCE")}</p><p className="fin-receipt-id-value">{tCopy("COPY.SAMPLE_REC")}{nextReceiptNumber}</p></div>
        <div className="space-y-3 text-left mb-6">{[
          ['Date', formatDate(new Date().toISOString(), locale)], ['Student', selectedStudent?.name || '—'],
          [tCopy('COPY.SAMPLE_ID'), selectedStudent?.smartId || '—'], [tCopy('COPY.MODE'), tCopy(`COPY.${SUPERADMIN_FINANCE_MODE_LABELS[mode].toUpperCase().replace(/\s+/g, '_')}`)],
        ].map(([label, value]) => <div key={label} className="flex justify-between"><span className="fin-receipt-row-label">{label}</span><span className="fin-receipt-row-value">{value}</span></div>)}</div>
        <div className="fin-receipt-dashed-line"><p className="fin-receipt-total-label">{tCopy("COPY.PREVIEW_TOTAL")}</p><p className="fin-receipt-total-amount">{formatMajorUnitPreviewCurrency(total, 'INR', locale)}</p></div>
        <button type="submit" className={`fin-receipt-paid-badge w-full ${canGenerate ? 'fin-receipt-paid-badge--ready' : 'fin-receipt-paid-badge--disabled'}`} disabled={!canGenerate} data-testid="superadmin-finance-finance-receipt-preview-generate-sample-receipt-preview-1"><CheckCircle size={16} aria-hidden="true" /><span className="fin-receipt-paid-text">{tCopy("COPY.GENERATE_SAMPLE_RECEIPT_PREVIEW")}</span></button>
        <p className="fin-receipt-footer-quote">{tCopy("COPY.KNOWLEDGE_IS_THE_BEST_INVESTMENT")}</p><p className="fin-receipt-footer-thanks">{tCopy("COPY.PREVIEW_ONLY_NOT_A_RECEIPT_FOR_PAYMENT")}</p>
      </div>
      <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">{RECEIPT_ZIGZAG_DOT_KEYS.map((dotKey) => <div key={dotKey} className="fin-receipt-zigzag-dot" />)}</div>
    </div><div className="space-y-3 mt-4"><button type="button" className="fin-receipt-btn-secondary w-full flex items-center justify-center gap-2" onClick={onCancel} data-testid="superadmin-finance-finance-receipt-preview-reset-preview-form-2"><X size={16} /> {tCopy("COPY.RESET_PREVIEW_FORM")}</button></div></div></div>
  );
}
