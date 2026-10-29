import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seat Gap Analytics | Library OS',
  description: 'Underutilized seat buffers, shift vacancy gaps, and branch capacity optimization',
};

export default function AccountingModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
