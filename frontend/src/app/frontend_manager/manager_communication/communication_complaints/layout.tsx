import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complaints & Feedback | Library OS',
  description: 'Student grievances, facility tickets, noise reports, and resolution tracking',
};

export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
