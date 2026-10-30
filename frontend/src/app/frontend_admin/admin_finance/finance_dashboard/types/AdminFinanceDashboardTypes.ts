import type { AdminFinanceDashboardScenario } from '@/app/frontend_admin/admin_finance/finance_dashboard/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** Domain-local types for the finance dashboard screen only. */

export interface AdminFinanceDemoDashboardStats {
  totalCollections: number; collectionsGrowth: number; activeStudents: number;
  expiringSoon: number; suspended: number; totalReferrals: number;
  depositsHeld: number; pendingPromises: number; overdueStudents: number;
  pendingRefunds: number; renewalsDue: number; lateFeeAccrued: number;
}

export interface AdminFinanceDemoRecentPayment {
  id: number; studentName: string; studentSmartId: string;
  amount: number; mode: string; date: string;
}

export interface AdminFinanceDashboardHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceDashboardScenario;
}
