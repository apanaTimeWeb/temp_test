import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals | Library OS',
  description: 'Member referral credits, commission payouts, and referral ledger',
};

import '@/app/frontend_manager/manager_finance/finance_referrals/components/manager_finance_referrals_styles/ManagerFinanceReferralsManager_referrals.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
