import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Attendance | Library OS',
  description: 'Daily attendance tracking, absentee reports, contactless QR scanning, and holiday calendars',
};

export default function ManagerDomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
