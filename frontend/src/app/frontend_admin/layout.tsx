import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { AdminShellRoute } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellRoute';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

/**
 * Nested role layout. The host application's root layout owns <html>/<body>,
 * document language, metadata, and the canonical next-intl provider/messages.
 * Keeping document tags here creates invalid nested document structure when this
 * role module is integrated at src/app/frontend_admin/.
 */
export default function AdminFrontendRoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
      <AdminShellRoute>{children}</AdminShellRoute>
    </div>
  );
}
