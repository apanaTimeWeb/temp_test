import { http, HttpResponse } from 'msw';
import { ADMIN_FINANCE_REFUNDS_API } from '@/app/frontend_admin/admin_finance/finance_refunds/config/admin_finance_refunds.url_config';
import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';

/** Test-only handler for the refunds endpoint using source-declared URL/envelope contracts. */
export const ADMIN_FINANCE_REFUNDS_MSW_HANDLERS = [
  http.get(ADMIN_FINANCE_REFUNDS_API.LIST, () => HttpResponse.json({ success: true, message: 'Synthetic refund fixtures returned.', data: ADMIN_FINANCE_REFUNDS_API_FIXTURE, requestId: 'mock-finance-refunds-list' })),
];

/** Synthetic refund fixtures for isolated tests only. */
export const ADMIN_FINANCE_REFUNDS_API_FIXTURE: readonly AdminFinanceRefundApiRecord[] = [
  { id: 'synthetic-refund-pending', studentName: 'Synthetic Student A', depositHeld: 10000, deductionAmount: 1000, netRefund: 9000, status: 'pending' },
  { id: 'synthetic-refund-approved', studentName: 'Synthetic Student B', depositHeld: 12000, deductionAmount: 2000, netRefund: 10000, status: 'approved' },
  { id: 'synthetic-refund-processed', studentName: 'Synthetic Student C', depositHeld: 8000, deductionAmount: 500, netRefund: 7500, status: 'processed' },
  { id: 'synthetic-refund-rejected', studentName: 'Synthetic Student D', depositHeld: 7000, deductionAmount: 0, netRefund: 7000, status: 'rejected' },
];
