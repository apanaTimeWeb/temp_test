'use client';

import React from 'react';
import {
  X,
  Printer,
  Share2,
  Building2,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Tag,
  CreditCard,
  FileText,
} from 'lucide-react';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';

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

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Operational Expense Voucher - ${voucherNo}</title>
          <style>
            @page { size: A5 landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 8px; margin-bottom: 12px; }
            .logo { font-size: 16px; font-weight: 800; color: #be123c; text-transform: uppercase; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
            .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th { background: #be123c; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
            td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
            .net-box { background: #fff1f2; border: 2px solid #e11d48; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
            .seal-box { border: 1px dashed #cbd5e1; border-radius: 4px; padding: 10px; text-align: center; font-size: 10px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SMART LIBRARY NETWORK</div>
              <div style="font-size: 11px; color: #64748b;">Central Operations & Accounts Division · Branch: ${expense.branchName ?? 'Downtown Central'}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge" style="background:#ffe4e6; color:#9f1239;">OPERATIONAL EXPENSE VOUCHER</span>
              <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${voucherNo}</div>
              <div style="font-size: 10px; color: #64748b;">Date: ${expense.date}</div>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="box-title">Vendor / Payee Details</div>
              <div style="font-size: 13px; font-weight: bold;">${vendor}</div>
              <div style="color: #475569;">Category: <strong>${expense.category}</strong></div>
              <div style="color: #475569;">Payment Mode: <strong style="text-transform: uppercase;">${expense.mode}</strong></div>
              <div style="color: #475569;">Channel: <strong>${expense.isPettyCashRequest ? 'Petty Cash Counter Release' : 'Direct Account Disbursal'}</strong></div>
            </div>
            <div class="box">
              <div class="box-title">Claimant & Audit Trail</div>
              <div>Requested By: <strong>${claimant}</strong></div>
              <div>Status: <strong style="text-transform: uppercase;">${expense.status ?? 'APPROVED'}</strong></div>
              <div>Authorized By: <strong>${expense.approvedBy ?? (isApproved ? 'Satyam Gupta (Admin)' : 'Pending Review')}</strong></div>
              <div>Branch: <strong>${expense.branchName ?? 'Downtown Central'}</strong></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Expense Item / Purpose</th>
                <th>Category</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${expense.description}</strong>
                  ${expense.notes ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${expense.notes}</div>` : ''}
                  ${expense.rejectionReason ? `<div style="font-size: 10px; color: #dc2626; margin-top: 2px;">Rejection Audit: ${expense.rejectionReason}</div>` : ''}
                </td>
                <td>${expense.category}</td>
                <td style="text-align: right; font-weight: bold;">${formatAdminAccountingCurrency(expense.amount, 'en')}</td>
              </tr>
            </tbody>
          </table>

          <div class="net-box">
            <div style="font-size: 11px; color: #9f1239; font-weight: bold;">TOTAL DISBURSED / AUTHORIZED AMOUNT</div>
            <div style="font-size: 20px; font-weight: 800; color: #be123c;">${formatAdminAccountingCurrency(expense.amount, 'en')}</div>
          </div>

          <div class="grid" style="margin-top: 20px;">
            <div class="seal-box">
              <div style="height: 30px;"></div>
              <div>Prepared & Claimed By</div>
              <div style="font-weight: bold; color: #1e293b;">${claimant}</div>
            </div>
            <div class="seal-box">
              <div style="height: 30px;"></div>
              <div>Authorized / Approved By</div>
              <div style="font-weight: bold; color: #1e293b;">${expense.approvedBy ?? 'Satyam Gupta (Admin)'}</div>
            </div>
          </div>

          <div class="footer" style="margin-top: 15px;">
            <span>System Generated Financial Voucher · Valid with official signature</span>
            <span>Printed on: ${new Date().toLocaleString('en-IN')}</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Library Operational Expense Voucher*\n` +
      `Ref: ${voucherNo}\n` +
      `Branch: ${expense.branchName ?? 'Downtown Central'}\n` +
      `Category: ${expense.category}\n` +
      `Vendor: ${vendor}\n` +
      `Item: ${expense.description}\n` +
      `Amount: ${formatAdminAccountingCurrency(expense.amount, 'en')}\n` +
      `Claimed By: ${claimant}\n` +
      `Status: ${expense.status ?? 'APPROVED'}\n` +
      `Authorized By: ${expense.approvedBy ?? 'Satyam Gupta (Admin)'}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-border bg-surface-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Expense Audit Voucher</h3>
                <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-xs font-mono font-bold text-rose-400">
                  {voucherNo}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Central Accounting & Branch Ledger Audit Record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close voucher dialog"
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Amount Highlight Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Expense Amount
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono mt-1">
                {formatAdminAccountingCurrency(expense.amount, 'en')}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                  <CreditCard className="h-3 w-3" />
                  Mode: <strong className="uppercase">{expense.mode}</strong>
                </span>
                {expense.isPettyCashRequest && (
                  <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                    Petty Cash
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Approval Status
              </span>
              <div className="mt-1">
                {isApproved && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Approved & Disbursed
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                    <Clock className="h-4 w-4" />
                    Pending Admin Approval
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-400">
                    <XCircle className="h-4 w-4" />
                    Rejected by Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Record Date: <strong className="text-foreground">{expense.date}</strong>
              </p>
            </div>
          </div>

          {/* Details Grid: Vendor & Staff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor / Payee Card */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Vendor / Payee Information
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{vendor}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Category: <span className="font-medium text-foreground">{expense.category}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Branch: <span className="font-semibold text-foreground">{expense.branchName ?? 'Downtown Central'}</span>
                </p>
              </div>
            </div>

            {/* Claimant & Approver Card */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <User className="h-3.5 w-3.5 text-secondary" />
                Staff & Authorization Details
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">Incurred / Claimed By:</span>
                  <p className="font-bold text-foreground">{claimant}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Authorized By:</span>
                  <p className="font-bold text-foreground">{expense.approvedBy ?? (isApproved ? 'Satyam Gupta (Admin)' : 'Pending Review')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Operational Notes */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Expense Purpose & Notes
            </span>
            <p className="text-sm font-semibold text-foreground">{expense.description}</p>
            {expense.notes && (
              <div className="rounded-lg bg-surface-muted p-2.5 text-xs text-text-secondary border border-border">
                <strong className="text-foreground">Manager Notes: </strong>
                {expense.notes}
              </div>
            )}
            {expense.rejectionReason && (
              <div className="rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-300 border border-rose-500/25">
                <strong className="text-rose-400">Rejection Audit Reason: </strong>
                {expense.rejectionReason}
              </div>
            )}
            {expense.receiptUrl && (
              <div className="pt-2 flex items-center justify-between border-t border-border mt-3 text-xs">
                <span className="text-muted-foreground">Supporting Quotation / Receipt Bill:</span>
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Original Attachment
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Voucher
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isPending && onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(expense);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve & Release Cash
              </button>
            )}
            {isPending && onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(expense);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAccountsExpenseVoucherModal;
