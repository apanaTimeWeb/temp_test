import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Settlement | Library OS',
  description: 'End-of-day cash and UPI reconciliation, fee collections, and closing drawer balances',
};

export default function AccountingModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
