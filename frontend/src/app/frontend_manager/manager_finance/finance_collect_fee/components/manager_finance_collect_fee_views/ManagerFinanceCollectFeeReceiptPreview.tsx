'use client';
// RESPONSIBILITY: Render the finance collect fee receipt preview component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';
import type { ManagerFinanceCollectFeeReceiptPreviewProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { AlertCircle,BookOpen,CheckCircle,MessageSquare,X } from 'lucide-react';
import { toast } from 'sonner';

export function ManagerFinanceCollectFeeReceiptPreview({
  selectedStudent,
  mode,
  modeLabels,
  amount,
  total,
  isSubmitting,
  isCollectAvailable,
  receiptNumber,
  collectedBy = 'Branch Manager',
  feeCategory = 'Seat Monthly Fee',
  collectionTypeLabel = 'Monthly Fee / Renewal',
  billingMonth,
  billingPeriod,
  nextDueDate,
  balanceRemaining,
  paymentDate,
  txnId,
  lineItems,
  onCollect,
  onCancel,
}: ManagerFinanceCollectFeeReceiptPreviewProps) {
  const tManagerUi = useTranslations('manager.manager_collect_fee.ui');
  const { formatCurrency, toMinorUnits, formatDate } = useManagerCollectFeeFormatting();

  const handleSendReceiptWhatsApp = () => {
    if (!selectedStudent) return;
    let cleanPhone = selectedStudent.phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const formattedTotal = total > 0 ? formatCurrency(toMinorUnits(total)) : '₹0';
    const activeDate = paymentDate ? formatDate(paymentDate) : formatDate(new Date().toISOString());

    const text = encodeURIComponent(
      `Hello ${selectedStudent.name},\n` +
      `Thank you for your fee payment at Library! 🧾\n\n` +
      `• Receipt No: ${receiptNumber}\n` +
      `• Smart ID: ${selectedStudent.smartId}\n` +
      `• Collection Purpose: ${collectionTypeLabel}\n` +
      `• Fee Category: ${feeCategory}\n` +
      (billingPeriod || billingMonth ? `• Billing Cycle: ${billingPeriod || billingMonth}\n` : '') +
      (nextDueDate ? `• Next Due Date: ${nextDueDate}\n` : '') +
      `• Amount Paid: ${formattedTotal}\n` +
      `• Payment Mode: ${modeLabels[mode] || mode}${txnId ? ` (Ref: ${txnId})` : ''}\n` +
      `• Date: ${activeDate}\n` +
      (balanceRemaining && balanceRemaining > 0 ? `• Remaining Due: ${formatCurrency(balanceRemaining)}\n` : '') +
      `• Verified By: ${collectedBy || 'Branch Manager'}\n\n` +
      `Knowledge is the best investment. Please preserve this receipt for your records.\n— Library Management`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp receipt link opened for ${selectedStudent.name} (+91 ${maskManagerCollectFeePhone(cleanPhone)})`);
  };

  return (
    <div className="lg:col-span-2 flex flex-col items-center lg:items-start w-full">
      <div className="fin-receipt-preview w-full max-w-[340px] mx-auto lg:mx-0" data-testid="manager-finance-collect-preview">
        <div className="fin-receipt-thermal">
          <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
            {Array.from({ length: 20 }, (_, i) => `receipt-top-tooth-${i + 1}`).map((dotId) => (
              <div key={dotId} className="fin-receipt-zigzag-dot" />
            ))}
          </div>
          <div className="fin-receipt-body">
            <div className="fin-receipt-logo-circle">
              <BookOpen size={28} className="fin-receipt-accent-icon" />
            </div>
            <p className="fin-receipt-brand">{tManagerUi('library_os')}</p>
            <p className="fin-receipt-title">{tManagerUi('payment_receipt') || 'Fee Payment Receipt'}</p>
            <p className="text-[11px] text-secondary mt-0.5">Official Student Fee Voucher</p>
            <p className="sr-only" data-testid="manager-finance-receipt-preview-disclaimer" role="status">
              {tManagerUi('receipt_preview_not_proof_of_payment')}
            </p>
            <div className="fin-receipt-id-box mt-6">
              <p className="fin-receipt-id-label">{tManagerUi('receipt_number_37553f')}</p>
              <p className="fin-receipt-id-value" suppressHydrationWarning>{receiptNumber}</p>
            </div>
            <div className="space-y-2.5 text-left mb-6 text-xs">
              {[
                { label: tManagerUi('date'), value: paymentDate ? formatDate(paymentDate) : formatDate(new Date().toISOString().slice(0, 10)) },
                { label: tManagerUi('student'), value: selectedStudent?.name || '—' },
                { label: tManagerUi('smart_id'), value: selectedStudent?.smartId || '—' },
                { label: tManagerUi('phone_label'), value: selectedStudent ? `+91-${maskManagerCollectFeePhone(selectedStudent.phone)}` : '—' },
                { label: 'Purpose', value: collectionTypeLabel },
                { label: 'Fee Category', value: feeCategory },
                ...(billingPeriod || billingMonth ? [{ label: 'Billing Period', value: billingPeriod || billingMonth || '—' }] : []),
                ...(nextDueDate ? [{ label: 'Next Due Date', value: nextDueDate }] : []),
                { label: tManagerUi('payment_mode_23b35c'), value: `${modeLabels[mode]}${txnId ? ` (${txnId})` : ''}` },
                { label: tManagerUi('collected_by_898bb0') || 'Collected By', value: collectedBy || 'Branch Manager' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline gap-2">
                  <span className="fin-receipt-row-label shrink-0">{row.label}</span>
                  <span className="fin-receipt-row-value text-right truncate max-w-[170px]" suppressHydrationWarning title={row.value}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {lineItems && lineItems.length > 0 && (
              <div className="space-y-1 py-2 my-2 border-y border-dashed border-border/80 text-[11px]">
                <p className="font-bold text-secondary uppercase tracking-wider text-[10px]">Itemized Items</p>
                {lineItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-secondary">
                    <span>{item.label}</span>
                    <span className="font-semibold text-text-primary">₹{item.amount}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="fin-receipt-dashed-line">
              <p className="fin-receipt-total-label">{tManagerUi('total_amount')}</p>
              <p className="fin-receipt-total-amount">{total > 0 ? formatCurrency(toMinorUnits(total)) : formatCurrency(0)}</p>
            </div>
            {balanceRemaining !== undefined && balanceRemaining > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5 my-2 text-center text-xs text-amber-700 dark:text-amber-400 font-medium">
                Partial Payment · Balance Due: {formatCurrency(balanceRemaining)}
              </div>
            ) : selectedStudent && total > 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded px-2.5 py-1.5 my-2 text-center text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                ✓ Full Paid for Billing Period
              </div>
            ) : null}
            <button
              type="button"
              className={`fin-receipt-paid-badge w-full border-0 motion-safe:transition-all motion-safe:duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 ${
                (!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || (mode !== 'cash' && !txnId?.trim()) || isSubmitting)
                  ? 'fin-receipt-paid-badge--disabled cursor-not-allowed'
                  : 'bg-success text-on-success cursor-pointer'
              }`}
              data-testid="manager-finance-collect-submit"
              onClick={onCollect}
              disabled={!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || (mode !== 'cash' && !txnId?.trim()) || isSubmitting}
            >
              {isSubmitting ? (
                <ButtonLoader icon="hand-coins" />
              ) : isCollectAvailable ? (
                <CheckCircle size={16} className={(!selectedStudent || !amount || parseFloat(amount) <= 0 || (mode !== 'cash' && !txnId?.trim())) ? 'text-secondary' : 'text-on-success'} />
              ) : (
                <AlertCircle size={16} className="text-secondary" />
              )}
              <span className={`fin-receipt-paid-text ${(!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || (mode !== 'cash' && !txnId?.trim()) || isSubmitting) ? 'text-secondary' : 'text-on-success'}`}>
                {isSubmitting ? tManagerUi('processing_272bc0') : isCollectAvailable ? tManagerUi('received_by_manager') : tManagerUi('collection_unavailable')}
              </span>
            </button>
            <p className="fin-input-hint text-secondary text-center text-xs" role="status">
              Official fee collection receipt verified by Branch Manager
            </p>
            <p className="fin-receipt-footer-quote">{tManagerUi('knowledge_is_the_best_investment')}</p>
            <p className="fin-receipt-footer-thanks">{tManagerUi('thank_you_see_you_again')}</p>
          </div>
          <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
            {Array.from({ length: 20 }, (_, i) => `receipt-bottom-tooth-${i + 1}`).map((dotId) => (
              <div key={dotId} className="fin-receipt-zigzag-dot" />
            ))}
          </div>
        </div>
        <div className="space-y-3 mt-4">
          {selectedStudent && (
            <button
              type="button"
              onClick={handleSendReceiptWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              title="Send Fee Receipt via WhatsApp"
            >
              <MessageSquare size={15} />
              <span>Send Receipt via WhatsApp</span>
            </button>
          )}
          <button
            type="button"
            className="fin-receipt-btn-secondary flex items-center justify-center gap-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={onCancel}
          >
            <X size={16} /> {tManagerUi('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
