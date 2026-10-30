import type { AdminFinanceLateFeeConfig, AdminFinanceDemoOverdueStudent } from '@/app/frontend_admin/admin_finance/finance_late_fees/types/AdminFinanceLateFeesTypes';

export const ADMIN_FINANCE_DEMO_LATE_FEE_CONFIG: AdminFinanceLateFeeConfig = { gracePeriodDays: 5, penaltyPerDay: 5000 };

export const ADMIN_FINANCE_DEMO_OVERDUE_STUDENTS: AdminFinanceDemoOverdueStudent[] = [
  { studentId: 'STU101', studentName: 'Rahul Kumar', smartId: 'STU101', phone: '8084350824', dueDate: '2026-04-05', daysOverdue: 6,  accruedFee: 30000, totalDue: 4.53e+06 },
  { studentId: 'STU102', studentName: 'Priya Singh', smartId: 'STU102', phone: '8084350824', dueDate: '2026-04-01', daysOverdue: 10, accruedFee: 50000, totalDue: 3.05e+06 },
  { studentId: 'STU103', studentName: 'Aman Verma',  smartId: 'STU103', phone: '8084350824', dueDate: '2026-03-28', daysOverdue: 14, accruedFee: 70000, totalDue: 6.07e+06 },
];
