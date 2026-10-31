import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates | Library OS',
  description: 'Pre-approved message templates, variable placeholders, and category presets',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
