import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust Scores | Library OS',
  description: 'Student payment reliability rankings and risk evaluation',
};

import '@/app/frontend_manager/manager_finance/finance_trust_scores/components/manager_finance_trust_scores_styles/ManagerFinanceTrustScoresManager_trust_scores.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
