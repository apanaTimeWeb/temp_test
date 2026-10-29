import type { z } from 'zod';
import {
  managerFinancePaymentApiSchema,
  managerFinanceRefundApiSchema,
} from '@/app/frontend_manager/manager_finance/finance_invoices/schemas/ManagerFinanceInvoicesSchema';

/** Synthetic test data only; amounts use the module's integer minor-unit convention. */
export const MANAGER_FINANCE_API_PAYMENT_FIXTURES = [
  { id: 'test-payment-001', date: '2026-10-14', studentName: 'Test Student A', amount: 125000, status: 'valid', mode: 'upi', txnId: 'TEST-TXN-001', smartId: 'TEST-001', currency: 'INR' },
  { id: 'test-payment-002', date: '2026-10-15', studentName: 'Test Student B', amount: 45000, status: 'unknown-status-for-test', smartId: 'TEST-002' },
  { id: 'test-payment-003', date: '2026-10-16', studentName: 'Test Student E', amount: 9900, status: 'valid', mode: 'cash', txnId: 'TEST-TXN-003', smartId: 'TEST-005', currency: 'INR' },
  { id: 'test-payment-004', date: '2026-10-17', studentName: 'Test Student F', amount: 0, status: 'pending', mode: 'card', smartId: 'TEST-006', currency: 'USD' },
] satisfies Array<z.infer<typeof managerFinancePaymentApiSchema>>;

export const MANAGER_FINANCE_API_REFUND_FIXTURES = [
  { id: 'test-refund-001', name: 'Test Student C', amount: 80000, status: 'pending', date: '2026-10-15', smartId: 'TEST-003', depositHeld: 100000, deductionAmount: 20000, requestedDate: '2026-10-15', currency: 'INR' },
  { id: 'test-refund-002', name: 'Test Student D', amount: 0, status: 'unknown-status-for-test', date: '2026-10-16' },
  { id: 'test-refund-003', name: 'Test Student G', amount: 25000, status: 'approved', date: '2026-10-17', smartId: 'TEST-007', depositHeld: 30000, deductionAmount: 5000, requestedDate: '2026-10-16', currency: 'INR' },
  { id: 'test-refund-004', name: 'Test Student H', amount: 10000, status: 'rejected', date: '2026-10-18', smartId: 'TEST-008', depositHeld: 10000, deductionAmount: 0, requestedDate: '2026-10-17', currency: 'USD' },
] satisfies Array<z.infer<typeof managerFinanceRefundApiSchema>>;

export const MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE: typeof MANAGER_FINANCE_API_PAYMENT_FIXTURES = [];
export const MANAGER_FINANCE_EMPTY_REFUND_FIXTURE: typeof MANAGER_FINANCE_API_REFUND_FIXTURES = [];
