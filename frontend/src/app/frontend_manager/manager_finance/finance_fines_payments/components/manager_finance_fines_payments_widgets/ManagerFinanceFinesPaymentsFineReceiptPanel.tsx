'use client';
// RESPONSIBILITY: Render the finance fines payments fine receipt panel component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useManagerFinesPaymentsFormatting } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsFormattingHook';
import { FileText, Printer, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerFinanceFinesPaymentsFineReceiptPanelProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsTypes';

export function ManagerFinanceFinesPaymentsFineReceiptPanel({ receipt, onCreateNew }: ManagerFinanceFinesPaymentsFineReceiptPanelProps) {
  const tManagerUi = useTranslations('manager.manager_fines_payments.ui');
  const { formatCurrency, formatDateTime } = useManagerFinesPaymentsFormatting();
  if (!receipt) return null;

  const normalizedPaymentMode = receipt.mode.trim().toLowerCase();
  const localizedPaymentMode = normalizedPaymentMode === 'cash'
    ? tManagerUi('cash')
    : normalizedPaymentMode === 'upi'
      ? tManagerUi('upi')
      : normalizedPaymentMode === 'card'
        ? tManagerUi('card')
        : normalizedPaymentMode === 'bank' || normalizedPaymentMode === 'bank transfer'
          ? tManagerUi('bank')
          : receipt.mode;
  const localizedFineType = receipt.fineType === 'Overdue Book'
    ? tManagerUi('overdue_book')
    : receipt.fineType === 'Lost Book Charge'
      ? tManagerUi('lost_book_charge')
      : receipt.fineType === 'Damage Charge'
        ? tManagerUi('damage_charge')
        : receipt.fineType === 'Late Fee'
          ? tManagerUi('late_fee')
          : receipt.fineType;

  const copyReceipt = async () => {
    const text = [
      tManagerUi('receipt_preview_not_proof_of_payment'),
      `${tManagerUi('receipt_number')} ${receipt.receiptNo}`,
      `${tManagerUi('member')}: ${receipt.member}`,
      `${tManagerUi('fine_type_a173d3')} ${localizedFineType}`,
      `${tManagerUi('amount_in_preview')}: ${formatCurrency(Number(receipt.amount), 'INR')}`,
      `${tManagerUi('payment_mode_23b35c')}: ${localizedPaymentMode}`,
      ...(receipt.txnId ? [`${tManagerUi('txn_id')}: ${receipt.txnId}`] : []),
      `${tManagerUi('date_time')}: ${formatDateTime(receipt.date)}`,
      `${tManagerUi('collected_by_898bb0')}: ${receipt.collectedBy}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tManagerUi('receipt_details_copied'), { id: `manager-finance-receipt-copy-success-${receipt.receiptNo}` });
    } catch {
      toast.error(tManagerUi('unable_to_copy_receipt_details'), { id: `manager-finance-receipt-copy-error-${receipt.receiptNo}` });
    }
  };

  return (
    <div className="p-6 rounded-xl border border-primary bg-primary-subtle motion-safe:animate-scale-up">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-black text-warning flex items-center gap-2">
            <FileText size={24} /> {tManagerUi('receipt_preview_only')}
          </h3>
          <p className="text-sm text-warning mt-1" role="status" data-testid="manager-finance-receipt-preview-disclaimer">{tManagerUi('receipt_preview_not_proof_of_payment')}</p>
        </div>
        <button type="button" onClick={onCreateNew} className="mgr-btn-secondary mgr-btn-sm">{tManagerUi('create_new')}</button>
      </div>

      <div className="space-y-3 bg-floating p-5 rounded-lg border border-border font-mono text-sm">
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('receipt_number')}</span> <span className="font-bold text-primary">{receipt.receiptNo}</span></div>
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('member')}</span> <span className="text-primary">{receipt.member}</span></div>
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('fine_type_a173d3')}</span> <span className="text-primary">{localizedFineType}</span></div>
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('amount_in_preview')}</span> <span className="font-bold text-primary">{formatCurrency(Number(receipt.amount), 'INR')}</span></div>
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('payment_mode')}</span> <span className="text-primary">{localizedPaymentMode}</span></div>
        {receipt.txnId && <div className="flex justify-between"><span className="text-secondary">{tManagerUi('txn_id')}</span> <span className="text-primary">{receipt.txnId}</span></div>}
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('date_time')}</span> <span className="text-primary">{formatDateTime(receipt.date)}</span></div>
        <div className="flex justify-between"><span className="text-secondary">{tManagerUi('collected_by')}</span> <span className="text-primary">{receipt.collectedBy}</span></div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button type="button" className="mgr-btn-primary flex-1" onClick={() => window.print()}><Printer size={16} className="mr-2 inline" /> {tManagerUi('print_receipt')}</button>
        <button type="button" className="mgr-btn-secondary flex-1" onClick={copyReceipt}><Copy size={16} className="mr-2 inline" /> {tManagerUi('copy_receipt')}</button>
      </div>
    </div>
  );
}
