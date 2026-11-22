import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
export default function AdminFinanceSubmoduleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen min-w-0 bg-page text-text-primary">
      {children}
      <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: 'bg-overlay text-text-primary border border-border text-body' }} />
    </div>
  );
}
