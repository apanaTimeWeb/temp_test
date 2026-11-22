import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security & Authentication | Manager Settings | Library OS',
  description: 'Manager password management, two-factor authentication, active login devices, and security audit log',
};

export default function ManagerSettingsSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
