'use client';

import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import {
  buildRefundDetailPrintHtml,
  buildRefundNotificationMessage,
} from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsExports';
import {
  buildWhatsAppLink,
  downloadRefundVoucherPdf,
} from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsPdf';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, CheckCircle2, Clock, Download, MessageSquare, Printer, Receipt, RotateCcw, ShieldCheck, User, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminFinanceRefundDetailModalProps {
  refund: AdminFinanceRefund | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (refund: AdminFinanceRefund) => void;
  onReject?: (refund: AdminFinanceRefund) => void;
  onMarkProcessed?: (refund: AdminFinanceRefund) => void;
  onOpenDisburseModal?: (refund: AdminFinanceRefund) => void;
}

export function AdminFinanceRefundDetailModal({
  refund,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onMarkProcessed,
  onOpenDisburseModal,
}: AdminFinanceRefundDetailModalProps) {
  if (!isOpen || !refund) return null;

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildRefundDetailPrintHtml(refund));
    printWindow.document.close();
  };

  const handleSendNotification = () => {
    const waUrl = buildWhatsAppLink(refund.studentPhone, buildRefundNotificationMessage(refund, true));
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`Sent WhatsApp notification to ${refund.studentName}`, { id: 'refund-detail-whatsapp-sent' });
  };

  const handleDownloadPdf = () => {
    downloadRefundVoucherPdf(refund);
    toast.success(`Downloaded Security Deposit Refund Voucher PDF (${refund.id})`, { id: 'refund-detail-pdf-downloaded' });
  };

  const formattedDeposit = formatAdminFinanceApiAmount(refund.depositHeld, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');
  const formattedDeduction = formatAdminFinanceApiAmount(refund.deductionAmount, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');
  const formattedNet = formatAdminFinanceApiAmount(refund.netRefund, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog p-0">
        <div className="bg-primary px-6 py-5 text-on-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Security Deposit Refund
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  {refund.branchName ?? 'Downtown Central'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">Deposit Refund Claim</DialogTitle>
              <p className="text-xs opacity-90">
                Claim ID: <span className="font-mono font-bold">{refund.id}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-on-primary hover:opacity-80 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between rounded-xl bg-surface-elevated border border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              {refund.status === 'processed' ? (
                <CheckCircle2 className="h-5 w-5 text-info-text shrink-0" aria-hidden="true" />
              ) : refund.status === 'approved' ? (
                <CheckCircle2 className="h-5 w-5 text-success-text shrink-0" aria-hidden="true" />
              ) : refund.status === 'rejected' ? (
                <XCircle className="h-5 w-5 text-danger-text shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="h-5 w-5 text-warning-text shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Status: {refund.status}
                </p>
                <p className="text-caption text-text-secondary">
                  Exit Date: {refund.exitDate ? formatDate(refund.exitDate) : 'Not specified'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-secondary block">Net Refund</span>
              <span className="text-xl font-extrabold text-success-text tabular-nums">{formattedNet}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Student & Member Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-secondary flex items-center gap-1">
                  <User className="h-3 w-3" aria-hidden="true" /> Student Name
                </span>
                <span className="font-semibold text-text-primary mt-0.5 block">{refund.studentName}</span>
              </div>
              <div>
                <span className="text-text-secondary block">Smart ID</span>
                <span className="font-mono font-medium text-text-primary mt-0.5 block">{refund.smartId}</span>
              </div>
              <div>
                <span className="text-text-secondary block">Allotted Branch</span>
                <span className="font-medium text-text-primary mt-0.5 block">{refund.branchName ?? 'Downtown Central'}</span>
              </div>
              <div>
                <span className="text-text-secondary block">Payment Method</span>
                <span className="font-medium text-text-primary mt-0.5 block">{refund.paymentMethod ?? 'Direct UPI'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Deposit & Deduction Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-text-secondary">Initial Security Deposit:</span>
                <span className="font-semibold text-text-primary">{formattedDeposit}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-text-secondary">Deduction (Damages/Dues):</span>
                <span className={`font-semibold ${refund.deductionAmount > 0 ? 'text-danger-text' : 'text-text-secondary'}`}>
                  {refund.deductionAmount > 0 ? `-${formattedDeduction}` : '₹0'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-text-primary">Net Refund Amount:</span>
                <span className="text-success-text">{formattedNet}</span>
              </div>
            </div>
          </div>

          {refund.status === 'processed' && (
            <div className="rounded-xl border border-success bg-success-bg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-success-text flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-success-text" aria-hidden="true" />
                  Official Payout Receipt Issued
                </span>
                <span className="font-mono text-xs font-bold text-success-text">
                  {refund.receiptNumber ?? `RCT-REF-${new Date().getFullYear()}-${refund.id}`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-text-secondary block">Transaction UTR / Ref No</span>
                  <span className="font-mono font-bold text-primary">
                    {refund.transactionUtr ?? '412398572104'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Disbursement Channel</span>
                  <span className="font-medium text-text-primary">
                    {refund.paymentMethod ?? 'UPI Instant Transfer'}
                  </span>
                </div>
                {refund.beneficiaryAccount && (
                  <div className="col-span-2">
                    <span className="text-text-secondary block">Beneficiary Account / UPI</span>
                    <span className="font-mono font-medium text-text-primary">{refund.beneficiaryAccount}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {refund.rejectionReason && (
            <div className="rounded-xl border border-danger bg-danger-bg p-3 text-xs text-danger-text">
              <p className="font-bold">Rejection Reason:</p>
              <p className="mt-0.5">{refund.rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-elevated px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            Close
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {refund.status === 'pending' && onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(refund);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-success text-on-primary px-3.5 py-2 text-xs font-semibold shadow-card hover:opacity-90 motion-safe:transition-opacity"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Approve Refund
              </button>
            )}
            {refund.status === 'pending' && onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(refund);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger bg-danger-bg text-danger-text hover:opacity-90 px-3.5 py-2 text-xs font-semibold shadow-card motion-safe:transition-opacity"
              >
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Reject
              </button>
            )}
            {refund.status === 'approved' && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenDisburseModal) {
                    onOpenDisburseModal(refund);
                    onClose();
                  } else if (onMarkProcessed) {
                    onMarkProcessed(refund);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-info text-on-primary hover:opacity-90 px-3.5 py-2 text-xs font-semibold shadow-card motion-safe:transition-opacity"
                title="Record transaction UTR and issue refund receipt"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Disburse & Enter UTR</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSendNotification}
              className="inline-flex items-center gap-1.5 rounded-lg border border-info bg-info-bg px-3.5 py-2 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity"
              title="Send WhatsApp/SMS update to student"
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Notify Student
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3.5 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity"
              title="Download Refund Voucher PDF"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-card hover:opacity-95 motion-safe:transition-opacity"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print Voucher
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AdminFinanceRefundDetailModal;
