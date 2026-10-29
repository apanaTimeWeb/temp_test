import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Renewals | Library OS',
  description: 'Upcoming member renewals, expired plan follow-ups, and auto-renewals',
};

import '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_styles/ManagerFinanceRenewalsManager_renewals.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
