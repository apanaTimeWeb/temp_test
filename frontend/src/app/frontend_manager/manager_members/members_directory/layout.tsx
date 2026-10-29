import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members Directory | Library OS',
  description: 'Manage admissions, seating, billing, and member profiles for all active learners',
};

export default function ManagerFeatureLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-members-directory-theme">{children}</div>;
}
