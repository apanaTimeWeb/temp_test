import { http, HttpResponse } from 'msw';
import { ADMIN_FINANCE_PAYMENTS_API } from '@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.url_config';
import type { AdminFinancePaymentApiRecord } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';

/** Test-only handler for the payments endpoint using source-declared URL/envelope contracts. */
export const ADMIN_FINANCE_PAYMENTS_MSW_HANDLERS = [
  http.get(ADMIN_FINANCE_PAYMENTS_API.LIST, () => HttpResponse.json({ success: true, message: 'Synthetic payment fixtures returned.', data: ADMIN_FINANCE_PAYMENTS_API_FIXTURE, requestId: 'mock-finance-payments-list' })),
];

/** Synthetic payment fixtures for isolated tests only. */
export const ADMIN_FINANCE_PAYMENTS_API_FIXTURE: readonly AdminFinancePaymentApiRecord[] = [
  { id: 'synthetic-payment-cash', receiptNumber: 'TEST-RECEIPT-001', date: '2026-01-15', studentName: 'Synthetic Student A', amount: 12500, mode: 'cash', status: 'completed' },
  { id: 'synthetic-payment-upi', receiptNumber: 'TEST-RECEIPT-002', date: '2026-01-16', studentName: 'Synthetic Student B', amount: 8500, mode: 'upi', status: 'completed' },
  { id: 'synthetic-payment-card', receiptNumber: 'TEST-RECEIPT-003', date: '2026-01-17', studentName: 'Synthetic Student C', amount: 4500, mode: 'card', status: 'completed' },
  { id: 'synthetic-payment-bank', receiptNumber: 'TEST-RECEIPT-004', date: '2026-01-18', studentName: 'Synthetic Student D', amount: 9900, mode: 'bank', status: 'completed' },
];
