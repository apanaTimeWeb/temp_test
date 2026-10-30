export type AdminFinanceCanonicalRefundStatus = 'pending' | 'approved' | 'processed' | 'rejected';

const ADMIN_FINANCE_REFUND_STATUS_LABEL_KEYS: Record<AdminFinanceCanonicalRefundStatus, string> = {
  pending: 'PENDING', approved: 'APPROVED', processed: 'PROCESSED', rejected: 'REJECTED',
};

export function getAdminFinanceRefundStatusLabelKey(status: string): string {
  return status in ADMIN_FINANCE_REFUND_STATUS_LABEL_KEYS
    ? ADMIN_FINANCE_REFUND_STATUS_LABEL_KEYS[status as AdminFinanceCanonicalRefundStatus]
    : 'STATUS';
}
