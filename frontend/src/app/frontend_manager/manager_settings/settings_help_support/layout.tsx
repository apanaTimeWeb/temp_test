import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support | Library OS',
  description: 'Knowledge base, support tickets, help desk, and technical assistance',
};

export default function SettingsModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
