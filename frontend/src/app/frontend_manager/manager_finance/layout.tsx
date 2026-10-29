import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance | Library OS',
  description: 'Comprehensive finance management, fee collection, subscriptions, and financial logs',
};

export default function ManagerDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
