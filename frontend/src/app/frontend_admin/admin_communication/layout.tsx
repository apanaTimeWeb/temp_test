'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

const SUBMODULE_NAVIGATION = [
  { href: ADMIN_ROUTES.COMMUNICATION_NOTICES, labelKey: 'SUBMODULE_COMMUNICATION_NOTICES' },
  { href: ADMIN_ROUTES.COMMUNICATION_COMPLAINTS, labelKey: 'SUBMODULE_COMMUNICATION_COMPLAINTS' },
  { href: ADMIN_ROUTES.COMMUNICATION_NOTIFICATION_CENTER, labelKey: 'SUBMODULE_COMMUNICATION_NOTIFICATION_CENTER' },
  { href: ADMIN_ROUTES.COMMUNICATION_WHATSAPP_TEMPLATES, labelKey: 'SUBMODULE_COMMUNICATION_WHATSAPP_TEMPLATES' },
  { href: ADMIN_ROUTES.COMMUNICATION_WHATSAPP_LOGS, labelKey: 'SUBMODULE_COMMUNICATION_WHATSAPP_LOGS' }
] as const;

export default function AdminCommunicationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <div className="min-w-0 space-y-4">
      <nav aria-label={t('DOMAIN_COMMUNICATION_SECTIONS')} className="border-b border-border bg-card">
        <div className="flex min-w-0 gap-1 overflow-x-auto px-3 py-2">
          {SUBMODULE_NAVIGATION.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:bg-surface-hover hover:text-primary'}`}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
