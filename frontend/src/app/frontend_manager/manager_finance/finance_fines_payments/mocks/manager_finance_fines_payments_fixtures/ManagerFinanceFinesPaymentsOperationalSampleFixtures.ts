/**
 * Sample-only fixtures for layout and interaction review.
 * These records are not live business data and must never be used to confirm persisted operations.
 */

export type ManagerFinanceFinesPaymentsLateFeeConfig = { gracePeriodDays: number; penaltyPerDay: number };
export type ManagerFinanceFinesPaymentsOverdueStudent = {
  studentId: string;
  studentName: string;
  smartId: string;
  dueDate: string;
  daysOverdue: number;
  accruedFee: number;
  totalDue: number;
};

export const MANAGER_FINANCE_SAMPLE_LATE_FEE_CONFIG: ManagerFinanceFinesPaymentsLateFeeConfig = { gracePeriodDays: 5, penaltyPerDay: 5000 };
export const MANAGER_FINANCE_SAMPLE_OVERDUE_STUDENTS: ManagerFinanceFinesPaymentsOverdueStudent[] = [
  { studentId: 'STU101', studentName: 'Rahul Kumar', smartId: 'STU101', dueDate: '2026-04-05', daysOverdue: 6, accruedFee: 30000, totalDue: 4530000 },
  { studentId: 'STU102', studentName: 'Priya Singh', smartId: 'STU102', dueDate: '2026-04-01', daysOverdue: 10, accruedFee: 50000, totalDue: 3050000 },
  { studentId: 'STU103', studentName: 'Aman Verma', smartId: 'STU103', dueDate: '2026-03-28', daysOverdue: 14, accruedFee: 70000, totalDue: 6070000 },
];

export type ManagerFinanceFinesPaymentsSampleDeposit = {
  id: number; studentName: string; smartId: string; depositAmount: number; collectedBy: string;
  collectedDate: string; deductionAmount: number; deductionReason?: string;
  status: 'held' | 'refunded' | 'forfeited'; refundedDate?: string;
};
export const MANAGER_FINANCE_SAMPLE_DEPOSITS: ManagerFinanceFinesPaymentsSampleDeposit[] = [
  { id: 1, studentName: 'Rahul Kumar', smartId: 'STU101', depositAmount: 1000000, collectedBy: 'Admin', collectedDate: '2026-03-15', deductionAmount: 0, status: 'held' },
  { id: 2, studentName: 'Priya Singh', smartId: 'STU102', depositAmount: 800000, collectedBy: 'Manager', collectedDate: '2026-03-20', deductionAmount: 150000, deductionReason: 'Damaged property', status: 'held' },
  { id: 3, studentName: 'Aman Verma', smartId: 'STU103', depositAmount: 1200000, collectedBy: 'Admin', collectedDate: '2026-02-10', deductionAmount: 0, status: 'refunded', refundedDate: '2026-04-08' },
  { id: 4, studentName: 'Sneha Patel', smartId: 'STU104', depositAmount: 900000, collectedBy: 'Admin', collectedDate: '2026-03-05', deductionAmount: 900000, deductionReason: 'Multiple violations', status: 'forfeited' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', depositAmount: 1100000, collectedBy: 'Manager', collectedDate: '2026-04-01', deductionAmount: 0, status: 'held' },
];

export interface ManagerFinanceFinesPaymentsSampleDashboardStats {
  totalCollections: number; collectionsGrowth: number; activeStudents: number; expiringSoon: number;
  suspended: number; totalReferrals: number; depositsHeld: number; pendingPromises: number;
  overdueStudents: number; pendingRefunds: number; renewalsDue: number; lateFeeAccrued: number;
}
export interface ManagerFinanceFinesPaymentsSampleRecentPayment {
  id: number; studentName: string; studentSmartId: string; amount: number; mode: string; date: string;
}
export const MANAGER_FINANCE_SAMPLE_DASHBOARD_STATS: ManagerFinanceFinesPaymentsSampleDashboardStats = {
  totalCollections: 4488000, collectionsGrowth: 12.5, activeStudents: 12, expiringSoon: 3, suspended: 2,
  totalReferrals: 6, depositsHeld: 1600000, pendingPromises: 2, overdueStudents: 3, pendingRefunds: 18,
  renewalsDue: 4, lateFeeAccrued: 150000,
};
export const MANAGER_FINANCE_SAMPLE_RECENT_PAYMENTS: ManagerFinanceFinesPaymentsSampleRecentPayment[] = [
  { id: 1, studentName: 'Aarav Sharma', studentSmartId: 'STU001', amount: 149900, mode: 'cash', date: '2026-04-01' },
  { id: 2, studentName: 'Priya Patel', studentSmartId: 'STU002', amount: 104900, mode: 'upi', date: '2026-04-02' },
  { id: 3, studentName: 'Ananya Singh', studentSmartId: 'STU004', amount: 149900, mode: 'bank', date: '2026-04-05' },
  { id: 4, studentName: 'Vikram Rao', studentSmartId: 'STU005', amount: 114900, mode: 'cash', date: '2026-04-06' },
  { id: 5, studentName: 'Sneha Gupta', studentSmartId: 'STU006', amount: 219900, mode: 'upi', date: '2026-04-08' },
];
