import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communication | Library OS',
  description: 'Notice broadcasts, member complaints, notification center, and WhatsApp messaging logs',
};

export default function ManagerDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
