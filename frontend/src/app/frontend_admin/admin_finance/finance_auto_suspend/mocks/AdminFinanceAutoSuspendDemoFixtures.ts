import type { AdminFinanceAutoSuspendConfig, AdminFinanceSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';

export const ADMIN_FINANCE_DEMO_AUTO_SUSPEND_CONFIG: AdminFinanceAutoSuspendConfig = { daysBeforeSuspend: 7, currentlySuspended: 4, autoRestoredThisMonth: 2, manualRestores: 1 };

export const ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS: readonly AdminFinanceSuspendedStudent[] = [
  { id: 1, studentId: 101, studentName: 'Rahul Kumar', smartId: 'STU101', seat: 'A-12', shift: 'Morning', daysOverdue: 14, suspendedSince: '2026-03-28' },
  { id: 2, studentId: 102, studentName: 'Priya Singh', smartId: 'STU102', seat: 'B-05', shift: 'Evening', daysOverdue: 9, suspendedSince: '2026-04-02' },
  { id: 3, studentId: 103, studentName: 'Aman Verma', smartId: 'STU103', seat: 'C-18', shift: 'Full Day', daysOverdue: 21, suspendedSince: '2026-03-21' },
  { id: 4, studentId: 104, studentName: 'Sneha Patel', smartId: 'STU104', seat: 'A-07', shift: 'Morning', daysOverdue: 8, suspendedSince: '2026-04-03' },
];
