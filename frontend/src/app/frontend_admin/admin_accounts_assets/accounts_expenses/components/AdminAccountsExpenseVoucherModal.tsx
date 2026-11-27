'use client';

import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { buildExpenseVoucherPrintHtml } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/adminAccountsExpensesExports';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import {
  Building2, CheckCircle2, Clock, CreditCard, ExternalLink, FileText,
  Printer, Receipt, Share2, Tag, User, X, XCircle,
} from 'lucide-react';

interface AdminAccountsExpenseVoucherModalProps {
  expense: AdminAccountingExpense | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (expense: AdminAccountingExpense) => void;
  onReject?: (expense: AdminAccountingExpense) => void;
}

export function AdminAccountsExpenseVoucherModal({
  expense,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: AdminAccountsExpenseVoucherModalProps) {
  if (!isOpen || !expense) return null;

  const voucherNo = expense.voucherNo ?? `EXP-${expense.branchName?.slice(0, 3).toUpperCase() ?? 'DEL'}-26-${String(expense.id).padStart(3, '0')}`;
  const isPending = expense.status === 'PENDING_APPROVAL';
  const isApproved = expense.status === 'APPROVED' || !expense.status;
  const isRejected = expense.status === 'REJECTED';
  const vendor = expense.vendorName ?? (expense.category === 'Electricity' ? 'BSES Rajdhani Power Ltd.' : 'Authorized Local Vendor');
  const claimant = expense.requestedBy ?? expense.paidBy ?? 'Branch Manager';

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(buildExpenseVoucherPrintHtml(expense, voucherNo, vendor, claimant, isApproved));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Library Operational Expense Voucher*\nRef: ${voucherNo}\nBranch: ${expense.branchName ?? 'Downtown Central'}\nCategory: ${expense.category}\nVendor: ${vendor}\nItem: ${expense.description}\nAmount: ${formatAdminAccountingCurrency(expense.amount, 'en')}\nClaimed By: ${claimant}\nStatus: ${expense.status ?? 'APPROVED'}\nAuthorized By: ${expense.approvedBy ?? 'Satyam Gupta (Admin)'}`
    );
    const popup = window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-2xl rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-surface-highlight px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-danger bg-danger-bg text-danger-text">
              <Receipt className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-text-primary">Expense Audit Voucher</DialogTitle>
                <span className="rounded bg-danger-bg border border-danger px-2 py-0.5 text-xs font-mono font-bold text-danger-text">
                  {voucherNo}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">Central Accounting &amp; Branch Ledger Audit Record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close voucher dialog"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Total Expense Amount</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-text-primary font-mono mt-1">
                {formatAdminAccountingCurrency(expense.amount, 'en')}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                  <CreditCard className="h-3 w-3" aria-hidden="true" />
                  Mode: <strong className="uppercase">{expense.mode}</strong>
                </span>
                {expense.isPettyCashRequest && (
                  <span className="rounded bg-warning-bg border border-warning px-2 py-0.5 text-[11px] font-semibold text-warning-text">
                    Petty Cash
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Approval Status</span>
              <div className="mt-1">
                {isApproved && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-3 py-1 text-xs font-bold text-success-text">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Approved &amp; Disbursed
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-warning bg-warning-bg px-3 py-1 text-xs font-bold text-warning-text">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Pending Admin Approval
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-3 py-1 text-xs font-bold text-danger-text">
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    Rejected by Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Record Date: <strong className="text-text-primary">{expense.date}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Vendor / Payee Information
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{vendor}</p>
                <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  Category: <span className="font-medium text-text-primary">{expense.category}</span>
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Branch: <span className="font-semibold text-text-primary">{expense.branchName ?? 'Downtown Central'}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <User className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                Staff &amp; Authorization Details
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-text-secondary">Incurred / Claimed By:</span>
                  <p className="font-bold text-text-primary">{claimant}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Authorized By:</span>
                  <p className="font-bold text-text-primary">{expense.approvedBy ?? (isApproved ? 'Satyam Gupta (Admin)' : 'Pending Review')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Expense Purpose &amp; Notes</span>
            <p className="text-sm font-semibold text-text-primary">{expense.description}</p>
            {expense.notes && (
              <div className="rounded-lg bg-surface-highlight p-2.5 text-xs text-text-secondary border border-border">
                <strong className="text-text-primary">Manager Notes: </strong>
                {expense.notes}
              </div>
            )}
            {expense.rejectionReason && (
              <div className="rounded-lg bg-danger-bg p-2.5 text-xs text-danger-text border border-danger">
                <strong>Rejection Audit Reason: </strong>
                {expense.rejectionReason}
              </div>
            )}
            {expense.receiptUrl && (
              <div className="pt-2 flex items-center justify-between border-t border-border mt-3 text-xs">
                <span className="text-text-secondary">Supporting Quotation / Receipt Bill:</span>
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  View Original Attachment
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-highlight px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print Voucher
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isPending && onApprove && (
              <button
                type="button"
                onClick={() => { onApprove(expense); onClose(); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-on-primary hover:opacity-90 motion-safe:transition-opacity shadow-card"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Approve &amp; Release Cash
              </button>
            )}
            {isPending && onReject && (
              <button
                type="button"
                onClick={() => { onReject(expense); onClose(); }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger bg-danger-bg px-3 py-2 text-xs font-semibold text-danger-text hover:opacity-90 motion-safe:transition-opacity"
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Reject
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsExpenseVoucherModal;
