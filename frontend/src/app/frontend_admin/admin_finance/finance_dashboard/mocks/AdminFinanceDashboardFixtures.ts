import type { AdminFinanceDemoDashboardStats, AdminFinanceDemoRecentPayment } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';

export const ADMIN_FINANCE_DEMO_DASHBOARD_STATS: AdminFinanceDemoDashboardStats = {
  totalCollections: 4.488e+06, collectionsGrowth: 12.5, activeStudents: 12,
  expiringSoon: 3, suspended: 2, totalReferrals: 6, depositsHeld: 1.6e+06,
  pendingPromises: 2, overdueStudents: 3, pendingRefunds: 18, renewalsDue: 4, lateFeeAccrued: 150000,
};

export const ADMIN_FINANCE_DEMO_RECENT_PAYMENTS: AdminFinanceDemoRecentPayment[] = [
  { id: 1, studentName: 'Aarav Sharma',  studentSmartId: 'STU001', amount: 149900, mode: 'cash', date: '2026-04-01' },
  { id: 2, studentName: 'Priya Patel',   studentSmartId: 'STU002', amount: 104900, mode: 'upi',  date: '2026-04-02' },
  { id: 3, studentName: 'Ananya Singh',  studentSmartId: 'STU004', amount: 149900, mode: 'bank', date: '2026-04-05' },
  { id: 4, studentName: 'Vikram Rao',    studentSmartId: 'STU005', amount: 114900, mode: 'cash', date: '2026-04-06' },
  { id: 5, studentName: 'Sneha Gupta',   studentSmartId: 'STU006', amount: 219900, mode: 'upi',  date: '2026-04-08' },
];

/** Demo-only invoice records; never use as live invoice data. */
