import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Late Fees | Library OS',
  description: 'Accrued overdue penalties, grace periods, and late fee waiver requests',
};

import '@/app/frontend_manager/manager_finance/finance_late_fees/components/manager_finance_late_fees_styles/ManagerFinanceLateFeesManager_late_fees.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
