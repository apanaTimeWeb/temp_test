import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments | Library OS',
  description: 'Transaction audit ledger, online payment logs, and cash receipts',
};

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
