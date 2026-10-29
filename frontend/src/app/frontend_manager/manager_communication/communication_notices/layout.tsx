import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notice Board | Library OS',
  description: 'Library announcements, circulars, exam schedule notices, and administrative alerts',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
