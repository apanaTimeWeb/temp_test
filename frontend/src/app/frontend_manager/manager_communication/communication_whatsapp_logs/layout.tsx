import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Logs | Library OS',
  description: 'Automated WhatsApp message delivery logs, webhook receipts, and failure diagnostics',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
