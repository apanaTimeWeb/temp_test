/**
 * Synthetic payment-promise records for isolated UI previews and tests only.
 * These records are not authoritative student or finance data.
 */
export type ManagerFinancePaymentPromisesPaymentPromiseSample = {
  id: number;
  studentName: string;
  smartId: string;
  promisedAmount: number;
  expectedDate: string;
  daysUntilDue: number;
  timesChanged: number;
  status: 'pending' | 'fulfilled' | 'overdue';
  fulfilledDate?: string;
};

export const MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES: ManagerFinancePaymentPromisesPaymentPromiseSample[] = [
  { id: 1, studentName: 'Rahul Kumar',  smartId: 'STU101', promisedAmount: 149900, expectedDate: '2026-04-20', daysUntilDue: 9,   timesChanged: 0, status: 'pending'   },
  { id: 2, studentName: 'Priya Singh',  smartId: 'STU102', promisedAmount: 99900,  expectedDate: '2026-04-05', daysUntilDue: -6,  timesChanged: 1, status: 'overdue'   },
  { id: 3, studentName: 'Aman Verma',   smartId: 'STU103', promisedAmount: 249900, expectedDate: '2026-03-15', daysUntilDue: -27, timesChanged: 0, status: 'fulfilled', fulfilledDate: '2026-04-10' },
  { id: 4, studentName: 'Sneha Patel',  smartId: 'STU104', promisedAmount: 120000, expectedDate: '2026-04-30', daysUntilDue: 19,  timesChanged: 2, status: 'pending'   },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', promisedAmount: 80000,  expectedDate: '2026-04-12', daysUntilDue: -3,  timesChanged: 3, status: 'overdue'   },
];
