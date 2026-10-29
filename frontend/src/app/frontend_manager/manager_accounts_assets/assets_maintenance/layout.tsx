import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asset Maintenance | Library OS',
  description: 'Preventative servicing, repair tickets, AMC records, and downtime management',
};

export default function AccountingModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
