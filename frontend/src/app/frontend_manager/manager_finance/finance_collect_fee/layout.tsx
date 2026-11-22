import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collect Fee | Library OS',
  description: 'Collect student fees, generate thermal receipts, and record payment modes',
};

import '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_styles/ManagerFinanceCollectFeeManager_collect_fee.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
