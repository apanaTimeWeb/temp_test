import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refunds | Library OS',
  description: 'Refund approval requests, payout receipts, and reversal logs',
};

export default function FinanceModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="finance-theme h-full">{children}</div>;
}
