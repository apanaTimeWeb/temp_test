import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscriptions | Library OS',
  description: 'Member subscription plans, tier renewals, and plan allocations',
};

import '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_styles/ManagerFinanceSubscriptionsManager_subscriptions.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
