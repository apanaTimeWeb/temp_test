'use client';

import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import {
  buildRefundPdfBlob,
  buildWhatsAppLink,
  downloadRefundPdfBlob,
} from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsPdfCore';

export { buildWhatsAppLink };

export function downloadRefundVoucherPdf(refund: AdminFinanceRefund): void {
  const blob = buildRefundPdfBlob({
    title: 'SMART LIBRARY - SECURITY DEPOSIT REFUND VOUCHER',
    subtitle: `Branch: ${refund.branchName ?? 'Downtown Central'} | Treasury Clearance Division`,
    themeColor: [0.05, 0.4, 0.3],
    meta: [
      { label: 'Voucher Ref ID', value: String(refund.id) },
      { label: 'Student Name', value: refund.studentName },
      { label: 'Student Smart ID', value: refund.smartId },
      { label: 'Exit Clearance Date', value: refund.exitDate ?? 'Current Session' },
      { label: 'Refund Status', value: refund.status.toUpperCase() },
      { label: 'Disbursement Method', value: refund.paymentMethod ?? 'Direct UPI / Bank Transfer' },
    ],
    items: [
      { desc: 'Caution / Security Deposit Held on Admission', amount: `INR ${refund.depositHeld.toLocaleString('en-IN')}` },
      {
        desc: refund.deductionAmount > 0
          ? `Deductions (Damages/Dues): ${refund.rejectionReason ?? 'Key/Book/Asset recovery'}`
          : 'Deductions (Damages / Key / Asset Dues)',
        amount: refund.deductionAmount > 0 ? `-INR ${refund.deductionAmount.toLocaleString('en-IN')}` : 'INR 0',
      },
    ],
    totals: { label: 'NET REFUND DISBURSED', value: `INR ${refund.netRefund.toLocaleString('en-IN')}` },
    footer: 'Clearance Voucher verified by Library Manager. Subject to desk handover & key return audit.',
  });

  downloadRefundPdfBlob(blob, `refund-voucher-${refund.id}.pdf`);
}
