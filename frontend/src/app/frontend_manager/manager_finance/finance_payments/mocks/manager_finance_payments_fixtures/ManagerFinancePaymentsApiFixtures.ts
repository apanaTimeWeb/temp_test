import type { z } from 'zod';
import { managerFinancePaymentApiSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';

/** Synthetic fixtures only; they are not live backend records. */
export const MANAGER_FINANCE_API_PAYMENT_FIXTURES = [
  { id: 'test-payment-001', date: '2026-10-14', studentName: 'Test Student A', amount: 125000, status: 'valid', mode: 'upi', txnId: 'TEST-TXN-001', smartId: 'TEST-001', currency: 'INR' },
  { id: 'test-payment-002', date: '2026-10-15', studentName: 'Test Student B', amount: 45000, status: 'unknown-status-for-test', smartId: 'TEST-002' },
  { id: 'test-payment-003', date: '2026-10-16', studentName: 'Test Student E', amount: 9900, status: 'valid', mode: 'cash', txnId: 'TEST-TXN-003', smartId: 'TEST-005', currency: 'INR' },
  { id: 'test-payment-004', date: '2026-10-17', studentName: 'Test Student F', amount: 0, status: 'pending', mode: 'card', smartId: 'TEST-006', currency: 'USD' },
] satisfies Array<z.infer<typeof managerFinancePaymentApiSchema>>;
export const MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE: typeof MANAGER_FINANCE_API_PAYMENT_FIXTURES = [];
