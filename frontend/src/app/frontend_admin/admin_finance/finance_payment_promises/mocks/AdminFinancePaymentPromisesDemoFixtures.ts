import type { AdminFinancePromiseItem } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';

export const ADMIN_FINANCE_DEMO_PAYMENT_PROMISES: readonly AdminFinancePromiseItem[] = [
  { id: 1, studentName: 'Rahul Kumar', smartId: 'STU101', promisedAmount: 149900, expectedDate: '2026-04-20', daysUntilDue: 9, timesChanged: 0, status: 'pending' },
  { id: 2, studentName: 'Priya Singh', smartId: 'STU102', promisedAmount: 99900, expectedDate: '2026-04-05', daysUntilDue: -6, timesChanged: 1, status: 'overdue' },
  { id: 3, studentName: 'Aman Verma', smartId: 'STU103', promisedAmount: 249900, expectedDate: '2026-03-15', daysUntilDue: -27, timesChanged: 0, status: 'fulfilled', fulfilledDate: '2026-04-10' },
  { id: 4, studentName: 'Sneha Patel', smartId: 'STU104', promisedAmount: 120000, expectedDate: '2026-04-30', daysUntilDue: 19, timesChanged: 2, status: 'pending' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', promisedAmount: 80000, expectedDate: '2026-04-12', daysUntilDue: -3, timesChanged: 3, status: 'overdue' },
];
