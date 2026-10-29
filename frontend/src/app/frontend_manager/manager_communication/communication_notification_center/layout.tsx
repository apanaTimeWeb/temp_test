import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification Center | Library OS',
  description: 'Omnichannel message composer, SMS/WhatsApp broadcast, and push campaign center',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
