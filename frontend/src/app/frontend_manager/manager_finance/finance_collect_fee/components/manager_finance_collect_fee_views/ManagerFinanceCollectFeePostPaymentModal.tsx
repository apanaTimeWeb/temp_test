'use client';

import { formatCollectFeeInr } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { ArrowRight, CheckCircle2, MessageSquare, Printer } from 'lucide-react';
import { toast } from 'sonner';

export interface FeeReceiptLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface ManagerFinanceCollectFeePostPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptNumber: string;
  studentName: string;
  smartId: string;
  phone: string;
  totalAmount: number;
  paymentMode: string;
  txnId?: string;
  billingPeriod?: string;
  lineItems?: FeeReceiptLineItem[];
}

export default function ManagerFinanceCollectFeePostPaymentModal({
  isOpen,
  onClose,
  receiptNumber,
  studentName,
  smartId,
  phone,
  totalAmount,
  paymentMode,
  txnId,
  billingPeriod,
  lineItems = [],
}: ManagerFinanceCollectFeePostPaymentModalProps) {
  if (!isOpen) return null;

  const handlePrintThermal = () => {
    toast.success(`Thermal print command dispatched for Receipt ${receiptNumber}`, { id: 'collect-fee-post-print' });
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const itemsSummary =
      lineItems.length > 0
        ? lineItems.map((item) => `  • ${item.label}: ${formatCollectFeeInr(item.amount)}`).join('\n')
        : `  • Fee Collection: ${formatCollectFeeInr(totalAmount)}`;

    const text = encodeURIComponent(
      `Hello ${studentName},\n` +
        `Thank you for your fee payment at Library!\n\n` +
        `• Receipt No: ${receiptNumber}\n` +
        `• Smart ID: ${smartId}\n` +
        `• Total Amount Paid: ${formatCollectFeeInr(totalAmount)}\n` +
        `• Items:\n${itemsSummary}\n` +
        `• Mode: ${paymentMode.toUpperCase()}${txnId ? ` (Ref: ${txnId})` : ''}\n` +
        (billingPeriod ? `• Billing Cycle: ${billingPeriod}\n` : '') +
        `• Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n\n` +
        `Official receipt verified. Thank you!\n— Library Management`
    );

    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp receipt opened for ${studentName} (+91 ${targetPhone.slice(-10)})`, {
      id: 'collect-fee-post-wa',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in fade-in motion-safe:duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-payment-title"
      data-testid="manager-finance-post-payment-modal"
    >
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-2xl space-y-5 motion-safe:animate-in zoom-in-95 motion-safe:duration-200">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={32} className="stroke-[2.5]" />
          </div>
          <h2 id="post-payment-title" className="text-xl font-black tracking-tight text-primary">
            Fee Collected Successfully!
          </h2>
          <p className="text-xs text-secondary font-medium">
            Receipt voucher issued and recorded in financial ledgers.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            <span>System API: Auto-dispatched 1x Receipt SMS &amp; WhatsApp to student</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-secondary font-medium">Receipt Number:</span>
            <span className="font-mono font-bold text-primary bg-surface px-2 py-0.5 rounded border border-border">
              {receiptNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-secondary">Student Name:</span>
            <span className="font-bold text-primary">
              {studentName} ({smartId})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-secondary">Payment Mode:</span>
            <span className="font-semibold text-primary capitalize">
              {paymentMode} {txnId ? `• Ref: ${txnId}` : ''}
            </span>
          </div>

          {lineItems.length > 0 && (
            <div className="pt-2 border-t border-border/70 space-y-1">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Line Items (Composite Bill):
              </span>
              {lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-text-primary">
                  <span>{item.label}</span>
                  <span className="font-semibold">{formatCollectFeeInr(item.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-border text-sm font-black text-emerald-600 dark:text-emerald-400">
            <span>Total Collected:</span>
            <span>{formatCollectFeeInr(totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handlePrintThermal}
            data-testid="manager-finance-post-payment-print"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-on-primary hover:opacity-90 shadow-sm motion-safe:transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Printer size={16} />
            <span>Print Thermal Receipt</span>
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            data-testid="manager-finance-post-payment-whatsapp"
            title="Share or resend receipt via WhatsApp Web (100% Free • Zero API Cost)"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm motion-safe:transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <MessageSquare size={16} />
            <span>Send WhatsApp Receipt (Free Web)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            data-testid="manager-finance-post-payment-done"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-muted motion-safe:transition-colors cursor-pointer"
          >
            <span>Done / Next Student</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
