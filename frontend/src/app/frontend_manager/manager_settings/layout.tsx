import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Library OS',
  description: 'Branch operational settings, facilities configuration, and support ticket management',
};

export default function ManagerDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
