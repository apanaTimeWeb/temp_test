import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
export default function AdminFinanceSubmoduleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0">
      {children}
      <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: 'bg-overlay text-text-primary border border-border text-body' }} />
    </div>
  );
}
