import type { AdminFinanceRenewalsScenario } from '@/app/frontend_admin/admin_finance/finance_renewals/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminFinanceRenewalsHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceRenewalsScenario;
}
