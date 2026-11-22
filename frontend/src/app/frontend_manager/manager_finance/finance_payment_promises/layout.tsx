import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Promises | Library OS',
  description: 'Pledged future fee payments, promise dates, and fulfillment status',
};

import '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_styles/ManagerFinancePaymentPromisesManager_payment_promises.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
