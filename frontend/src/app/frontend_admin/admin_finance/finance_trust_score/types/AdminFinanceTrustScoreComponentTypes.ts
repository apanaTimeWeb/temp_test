import type { AdminFinanceTrustScoreScenario } from '@/app/frontend_admin/admin_finance/finance_trust_score/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminFinanceTrustScoreHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceTrustScoreScenario;
}
