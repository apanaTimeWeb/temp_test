import type { z } from 'zod';
import { managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';

/** Synthetic fixtures only; they are not live backend records. */
export const MANAGER_FINANCE_API_REFUND_FIXTURES = [
  { id: 'test-refund-001', name: 'Test Student C', amount: 80000, status: 'pending', date: '2026-10-15', smartId: 'TEST-003', depositHeld: 100000, deductionAmount: 20000, requestedDate: '2026-10-15', currency: 'INR' },
  { id: 'test-refund-002', name: 'Test Student D', amount: 0, status: 'unknown-status-for-test', date: '2026-10-16' },
  { id: 'test-refund-003', name: 'Test Student G', amount: 25000, status: 'approved', date: '2026-10-17', smartId: 'TEST-007', depositHeld: 30000, deductionAmount: 5000, requestedDate: '2026-10-16', currency: 'INR' },
  { id: 'test-refund-004', name: 'Test Student H', amount: 10000, status: 'rejected', date: '2026-10-18', smartId: 'TEST-008', depositHeld: 10000, deductionAmount: 0, requestedDate: '2026-10-17', currency: 'USD' },
] satisfies Array<z.infer<typeof managerFinanceRefundApiSchema>>;
export const MANAGER_FINANCE_EMPTY_REFUND_FIXTURE: typeof MANAGER_FINANCE_API_REFUND_FIXTURES = [];
