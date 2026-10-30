'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

const SUBMODULE_NAVIGATION = [
  { href: ADMIN_ROUTES.SYSTEM_SETTINGS, labelKey: 'SUBMODULE_SYSTEM_SETTINGS' },
  { href: ADMIN_ROUTES.SYSTEM_BRANDING, labelKey: 'SUBMODULE_SYSTEM_BRANDING' },
  { href: ADMIN_ROUTES.SYSTEM_BACKUPS, labelKey: 'SUBMODULE_SYSTEM_BACKUPS' },
  { href: ADMIN_ROUTES.SYSTEM_SMART_ID, labelKey: 'SUBMODULE_SYSTEM_SMART_ID' },
  { href: ADMIN_ROUTES.SYSTEM_BULK_IMPORT, labelKey: 'SUBMODULE_SYSTEM_BULK_IMPORT' },
  { href: ADMIN_ROUTES.SYSTEM_DATA_EXPORT, labelKey: 'SUBMODULE_SYSTEM_DATA_EXPORT' },
  { href: ADMIN_ROUTES.SYSTEM_AUTO_SCALE, labelKey: 'SUBMODULE_SYSTEM_AUTO_SCALE' },
  { href: ADMIN_ROUTES.SYSTEM_MAINTENANCE, labelKey: 'SUBMODULE_SYSTEM_MAINTENANCE' },
  { href: ADMIN_ROUTES.SYSTEM_OFFLINE, labelKey: 'SUBMODULE_SYSTEM_OFFLINE' },
  { href: ADMIN_ROUTES.SYSTEM_POWER_SAVING, labelKey: 'SUBMODULE_SYSTEM_POWER_SAVING' },
  { href: ADMIN_ROUTES.SYSTEM_GAP_FILLING, labelKey: 'SUBMODULE_SYSTEM_GAP_FILLING' },
  { href: ADMIN_ROUTES.SYSTEM_WAITLIST_AUTOMATION, labelKey: 'SUBMODULE_SYSTEM_WAITLIST_AUTOMATION' },
  { href: ADMIN_ROUTES.SYSTEM_WHATSAPP_INTEGRATION, labelKey: 'SUBMODULE_SYSTEM_WHATSAPP_INTEGRATION' },
  { href: ADMIN_ROUTES.SYSTEM_AUDIT_LOGS, labelKey: 'SUBMODULE_SYSTEM_AUDIT_LOGS' }
] as const;

export default function AdminSystemLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <div className="min-w-0 space-y-4">
      <nav aria-label={t('DOMAIN_SYSTEM_SECTIONS')} className="border-b border-border bg-card">
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
