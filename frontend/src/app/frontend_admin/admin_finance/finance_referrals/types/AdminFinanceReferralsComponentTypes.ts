import type { AdminFinanceReferralsScenario } from '@/app/frontend_admin/admin_finance/finance_referrals/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminFinanceReferralsHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceReferralsScenario;
}
