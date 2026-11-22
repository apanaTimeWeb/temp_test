'use client';

import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatAdminFinanceApiAmount,formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { buildWhatsAppLink,downloadRefundVoucherPdf } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import { Building2,CheckCircle2,Clock,Download,MessageSquare,Printer,Receipt,RotateCcw,ShieldCheck,User,X,XCircle } from 'lucide-react';
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
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Security Deposit Refund Voucher - ${refund.id}</title>
          <style>
            @page { size: A5 landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
            .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
            .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th { background: #047857; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
            td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
            .net-box { background: #ecfdf5; border: 2px solid #059669; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SMART LIBRARY NETWORK</div>
              <div style="font-size: 11px; color: #64748b;">Treasury & Security Deposit Settlement Division · Branch: ${refund.branchName ?? 'Downtown Central'}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge" style="background:#dcfce7; color:#15803d;">REFUND SETTLEMENT VOUCHER</span>
              <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${refund.id}</div>
              <div style="font-size: 10px; color: #64748b;">Exit Date: ${refund.exitDate ? formatDate(refund.exitDate) : 'N/A'}</div>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="box-title">Student Information</div>
              <div style="font-size: 13px; font-weight: bold;">${refund.studentName}</div>
              <div style="color: #475569;">Smart ID: <strong>${refund.smartId}</strong></div>
              <div style="color: #475569;">Branch: ${refund.branchName ?? 'Downtown Central'}</div>
            </div>
            <div class="box">
              <div class="box-title">Settlement & Banking Details</div>
              <div>Receipt No: <strong>${refund.receiptNumber ?? 'RCT-REF-' + refund.id}</strong></div>
              <div>Transaction UTR: <strong style="font-family: monospace; color: #4338ca;">${refund.transactionUtr ?? 'Pending Transfer'}</strong></div>
              <div>Method: <strong>${refund.paymentMethod ?? 'Direct UPI Transfer'}</strong></div>
              <div>Status: <strong style="text-transform: uppercase;">${refund.status}</strong></div>
              ${refund.processedDate || refund.disbursedAt ? `<div>Settled Date: ${formatDate(refund.disbursedAt || refund.processedDate!)}</div>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Initial Security Deposit Held</td>
                <td style="text-align: right; font-weight: bold;">₹${refund.depositHeld.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Deductions (Damages / Key replacement / Dues)</td>
                <td style="text-align: right; color: ${refund.deductionAmount > 0 ? '#b91c1c' : '#64748b'};">
                  ${refund.deductionAmount > 0 ? `-₹${refund.deductionAmount.toLocaleString('en-IN')}` : '₹0 (None)'}
                </td>
              </tr>
              ${refund.rejectionReason ? `<tr><td colspan="2" style="color:#b91c1c;"><strong>Reason:</strong> ${refund.rejectionReason}</td></tr>` : ''}
            </tbody>
          </table>

          <div class="net-box">
            <span style="font-size: 12px; color: #065f46; font-weight: bold;">NET REFUND DISBURSED: </span>
            <span style="font-size: 18px; font-weight: 800; color: #047857;">₹${refund.netRefund.toLocaleString('en-IN')}</span>
          </div>

          <div class="footer">
            <span>Verified by Smart Library Branch Accounts</span>
            <span>Authorized Signature: ____________________</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const text = `*SMART LIBRARY - SECURITY DEPOSIT REFUND*\n` +
      `---------------------------------\n` +
      `Ref ID: ${refund.id}\n` +
      (refund.receiptNumber ? `Receipt No: ${refund.receiptNumber}\n` : '') +
      `Student Name: ${refund.studentName}\n` +
      `Smart ID: ${refund.smartId}\n` +
      `Branch: ${refund.branchName ?? 'Smart Library'}\n` +
      `---------------------------------\n` +
      `Deposit Held: ₹${refund.depositHeld.toLocaleString('en-IN')}\n` +
      `Deductions: ₹${refund.deductionAmount.toLocaleString('en-IN')}\n` +
      `*Net Refund: ₹${refund.netRefund.toLocaleString('en-IN')}*\n` +
      `Status: ${refund.status.toUpperCase()}\n` +
      (refund.paymentMethod ? `Disbursement Mode: ${refund.paymentMethod}\n` : '') +
      (refund.transactionUtr ? `Transaction UTR: ${refund.transactionUtr}\n` : '') +
      `---------------------------------\n` +
      `Smart Library Treasury & Accounts`;
    const waUrl = buildWhatsAppLink(refund.studentPhone, text);
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const handleSendNotification = () => {
    let msg = '';
    if (refund.status === 'approved') {
      msg = `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been APPROVED! Disbursement method: ${refund.paymentMethod || 'UPI/Bank'}. Ref: ${refund.id}.`;
    } else if (refund.status === 'rejected') {
      msg = `Dear ${refund.studentName}, your Smart Library deposit refund request has been REJECTED. Reason: ${refund.rejectionReason || 'Pending damages or dues'}. Ref: ${refund.id}.`;
    } else if (refund.status === 'processed') {
      msg = `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been DISBURSED via ${refund.paymentMethod || 'UPI/Bank'}! Transaction UTR: ${refund.transactionUtr || 'N/A'}. Receipt No: ${refund.receiptNumber || ('RCT-REF-' + refund.id)}.`;
    } else {
      msg = `Dear ${refund.studentName}, your Smart Library deposit refund request (Ref: ${refund.id}) is currently under review by Accounts.`;
    }
    const waUrl = buildWhatsAppLink(refund.studentPhone, msg);
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`Sent WhatsApp notification to ${refund.studentName}`);
  };

  const handleDownloadPdf = () => {
    downloadRefundVoucherPdf(refund);
    toast.success(`Downloaded Security Deposit Refund Voucher PDF (${refund.id})`);
  };

  const formattedDeposit = formatAdminFinanceApiAmount(refund.depositHeld, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');
  const formattedDeduction = formatAdminFinanceApiAmount(refund.deductionAmount, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');
  const formattedNet = formatAdminFinanceApiAmount(refund.netRefund, refund.currencyCode ?? 'INR', refund.amountUnit ?? 'major');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-modal-title"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Security Deposit Refund
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-100">
                  <Building2 className="h-3 w-3" />
                  {refund.branchName ?? 'Downtown Central'}
                </span>
              </div>
              <h2 id="refund-modal-title" className="text-xl font-bold tracking-tight">Deposit Refund Claim</h2>
              <p className="text-xs text-emerald-100">Claim ID: <span className="font-mono font-bold text-white">{refund.id}</span></p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status highlight */}
          <div className="flex items-center justify-between rounded-xl bg-surface-elevated border border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              {refund.status === 'processed' ? (
                <CheckCircle2 className="h-5 w-5 text-cyan-500 shrink-0" />
              ) : refund.status === 'approved' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : refund.status === 'rejected' ? (
                <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-amber-500 shrink-0" />
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
              <span className="text-xs text-text-muted block">Net Refund</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formattedNet}
              </span>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Student & Member Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-muted block flex items-center gap-1">
                  <User className="h-3 w-3" /> Student Name
                </span>
                <span className="font-semibold text-text-primary mt-0.5 block">{refund.studentName}</span>
              </div>
              <div>
                <span className="text-text-muted block">Smart ID</span>
                <span className="font-mono font-medium text-text-primary mt-0.5 block">{refund.smartId}</span>
              </div>
              <div>
                <span className="text-text-muted block">Allotted Branch</span>
                <span className="font-medium text-text-primary mt-0.5 block">{refund.branchName ?? 'Downtown Central'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Payment Method</span>
                <span className="font-medium text-text-primary mt-0.5 block">{refund.paymentMethod ?? 'Direct UPI'}</span>
              </div>
            </div>
          </div>

          {/* Deposit Breakdown */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Deposit & Deduction Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-text-secondary">Initial Security Deposit:</span>
                <span className="font-semibold text-text-primary">{formattedDeposit}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-text-secondary">Deduction (Damages/Dues):</span>
                <span className={`font-semibold ${refund.deductionAmount > 0 ? 'text-rose-500' : 'text-text-muted'}`}>
                  {refund.deductionAmount > 0 ? `-${formattedDeduction}` : '₹0'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-text-primary">Net Refund Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formattedNet}</span>
              </div>
            </div>
          </div>

          {/* Banking / Transaction UTR & Official Receipt Card */}
          {refund.status === 'processed' && (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-emerald-600" />
                  Official Payout Receipt Issued
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {refund.receiptNumber ?? `RCT-REF-${new Date().getFullYear()}-${refund.id}`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-text-muted block">Transaction UTR / Ref No</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {refund.transactionUtr ?? '412398572104'}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">Disbursement Channel</span>
                  <span className="font-medium text-text-primary">
                    {refund.paymentMethod ?? 'UPI Instant Transfer'}
                  </span>
                </div>
                {refund.beneficiaryAccount && (
                  <div className="col-span-2">
                    <span className="text-text-muted block">Beneficiary Account / UPI</span>
                    <span className="font-mono font-medium text-text-primary">
                      {refund.beneficiaryAccount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {refund.rejectionReason && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              <p className="font-bold">Rejection Reason:</p>
              <p className="mt-0.5">{refund.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-elevated px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            Close
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {refund.status === 'pending' && onApprove && (
              <button
                type="button"
                onClick={() => { onApprove(refund); onClose(); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve Refund
              </button>
            )}
            {refund.status === 'pending' && onReject && (
              <button
                type="button"
                onClick={() => { onReject(refund); onClose(); }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
              >
                <XCircle className="h-3.5 w-3.5" />
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
                title="Record transaction UTR and issue refund receipt"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Disburse & Enter UTR</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSendNotification}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all"
              title="Send WhatsApp/SMS update to student"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Notify Student
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-all"
              title="Download Refund Voucher PDF"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-contrast shadow-sm hover:opacity-95 transition-opacity"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
