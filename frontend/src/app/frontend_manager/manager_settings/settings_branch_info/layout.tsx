import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Branch Information | Library OS',
  description: 'Library profile, branch code, capacity, amenities, and contact details',
};

export default function SettingsModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
