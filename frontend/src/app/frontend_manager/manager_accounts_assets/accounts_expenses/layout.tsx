import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Ledger | Library OS',
  description: 'Operating expenses, category breakdowns, vendor receipts, and cash outflows',
};

export default function AccountingModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
