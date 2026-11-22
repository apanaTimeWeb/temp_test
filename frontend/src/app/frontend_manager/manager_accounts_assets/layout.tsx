import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts & Assets | Library OS',
  description: 'Daily cash settlements, expense ledgers, seat gap analytics, asset registry, and maintenance logs',
};

export default function ManagerDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
