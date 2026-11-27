import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';

export function escapeRefundHtml(value: string | number | undefined): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function mapAdminFinanceRefund(record: AdminFinanceRefundApiRecord): AdminFinanceRefund {
  const rec = record as Record<string, unknown>;
  return {
    id: record.id,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    exitDate: record.exitDate,
    depositHeld: record.depositHeld,
    deductionAmount: record.deductionAmount,
    netRefund: record.netRefund,
    currencyCode: record.currencyCode ?? 'INR',
    amountUnit: record.amountUnit ?? 'major',
    status: record.status,
    processedDate: record.processedDate,
    paymentMethod: record.paymentMethod,
    rejectionReason: record.rejectionReason,
    branchName: typeof rec.branchName === 'string' ? rec.branchName : undefined,
    branchId: typeof rec.branchId === 'string' ? rec.branchId : undefined,
    studentPhone: typeof rec.studentPhone === 'string' ? rec.studentPhone : (typeof rec.phone === 'string' ? rec.phone : '9876543220'),
    studentEmail:
      typeof rec.studentEmail === 'string'
        ? rec.studentEmail
        : typeof rec.email === 'string'
          ? rec.email
          : `${record.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  };
}

export function buildRefundNotificationMessage(refund: AdminFinanceRefund, detailed = false): string {
  if (refund.status === 'approved') {
    return `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been APPROVED! ${detailed ? 'Disbursement method' : 'Method'}: ${refund.paymentMethod || 'UPI/Bank'}. Ref: ${refund.id}.`;
  }
  if (refund.status === 'rejected') {
    return `Dear ${refund.studentName}, your${detailed ? ' Smart Library' : ''} deposit refund request has been REJECTED. Reason: ${refund.rejectionReason || (detailed ? 'Pending damages or dues' : 'Pending damages/dues')}. Ref: ${refund.id}.`;
  }
  if (detailed && refund.status === 'processed') {
    return `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been DISBURSED via ${refund.paymentMethod || 'UPI/Bank'}! Transaction UTR: ${refund.transactionUtr || 'N/A'}. Receipt No: ${refund.receiptNumber || `RCT-REF-${refund.id}`}.`;
  }
  if (detailed) {
    return `Dear ${refund.studentName}, your Smart Library deposit refund request (Ref: ${refund.id}) is currently under review by Accounts.`;
  }
  return `Dear ${refund.studentName}, your security deposit refund status is currently ${refund.status.toUpperCase()}. Net amount: ₹${refund.netRefund.toLocaleString('en-IN')}. Ref: ${refund.id}.`;
}

export function getRefundTimeRangeLabel(timeRange: 'all' | 'today' | 'this_week' | 'this_month' | 'custom'): string {
  switch (timeRange) {
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'custom': return 'Custom Range';
    default: return 'All Time';
  }
}

export function filterRefundsByScope(
  refunds: AdminFinanceRefund[],
  opts: {
    selectedBranchId: string;
    selectedBranch: { id?: string; name?: string; code?: string } | null;
    isAllBranches: boolean;
    timeRange: 'all' | 'today' | 'this_week' | 'this_month' | 'custom';
    statusFilter: 'all' | AdminFinanceRefund['status'];
    search: string;
  },
): { timeFiltered: AdminFinanceRefund[]; filtered: AdminFinanceRefund[] } {
  const { selectedBranchId, selectedBranch, isAllBranches, timeRange, statusFilter, search } = opts;
  const branchFiltered = isAllBranches || selectedBranchId === 'all' || !selectedBranch
    ? refunds
    : refunds.filter((r) => {
        if (r.branchId && r.branchId.toLowerCase() === selectedBranchId.toLowerCase()) return true;
        if (!r.branchName) return true;
        const bName = r.branchName.toLowerCase().trim();
        const sName = (selectedBranch.name ?? '').toLowerCase().trim();
        const sCode = (selectedBranch.code ?? '').toLowerCase().trim();
        const sId = (selectedBranch.id ?? '').toLowerCase().trim();
        return bName.includes(sName) || sName.includes(bName) || bName === sCode || bName === sId;
      });
  const timeFiltered = timeRange === 'today'
    ? branchFiltered.slice(0, Math.max(1, Math.ceil(branchFiltered.length * 0.2)))
    : timeRange === 'this_week'
      ? branchFiltered.slice(0, Math.max(2, Math.ceil(branchFiltered.length * 0.5)))
      : branchFiltered;
  const q = search.trim().toLowerCase();
  const filtered = timeFiltered.filter((refund) => {
    if (statusFilter !== 'all' && refund.status !== statusFilter) return false;
    if (!q) return true;
    return (
      refund.studentName.toLowerCase().includes(q) ||
      refund.smartId.toLowerCase().includes(q) ||
      (refund.branchName ? refund.branchName.toLowerCase().includes(q) : false) ||
      (refund.paymentMethod ? refund.paymentMethod.toLowerCase().includes(q) : false)
    );
  });
  return { timeFiltered, filtered };
}
