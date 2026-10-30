import type { AdminFinanceLateFeesScenario } from '@/app/frontend_admin/admin_finance/finance_late_fees/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminFinanceLateFeeConfig = { gracePeriodDays: number; penaltyPerDay: number };

export type AdminFinanceDemoOverdueStudent = {
  studentId: string;
  studentName: string;
  smartId: string;
  phone: string;
  dueDate: string;
  daysOverdue: number;
  accruedFee: number;
  totalDue: number;
};

export interface AdminFinanceLateFeesHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceLateFeesScenario;
}
