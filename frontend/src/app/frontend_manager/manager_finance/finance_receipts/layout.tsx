import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Receipts | Library OS',
  description: 'Payment receipts, 80mm thermal receipts, and proof of payment',
};

import '@/app/frontend_manager/manager_finance/finance_receipts/components/manager_finance_receipts_styles/ManagerFinanceReceiptsManager_receipt.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
