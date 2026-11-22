import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assets Register | Library OS',
  description: 'Furniture, electrical fixtures, study cubicles, and physical library hardware registry',
};

export default function AccountingModuleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
