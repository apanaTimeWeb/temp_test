import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Templates | Library OS',
  description: 'Pre-approved WhatsApp HSM message templates, variable placeholders, and category presets',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
