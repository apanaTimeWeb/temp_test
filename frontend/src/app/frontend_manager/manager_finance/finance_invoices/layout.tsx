import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | Library OS',
  description: 'Tax invoices, billing line items, GST breakdown, and PDF export',
};

import '@/app/frontend_manager/manager_finance/finance_invoices/components/manager_finance_invoices_styles/ManagerFinanceInvoicesManager_invoice.css';

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
