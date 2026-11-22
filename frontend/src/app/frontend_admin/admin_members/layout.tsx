'use client';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const SUBMODULE_NAVIGATION = [
  { href: ADMIN_ROUTES.MEMBERS_DIRECTORY, labelKey: 'SUBMODULE_MEMBERS_DIRECTORY' },
  { href: ADMIN_ROUTES.MEMBERS_ENQUIRIES, labelKey: 'SUBMODULE_MEMBERS_ENQUIRIES' },
  { href: ADMIN_ROUTES.MEMBERS_PLANS, labelKey: 'SUBMODULE_MEMBERS_PLANS' },
  { href: ADMIN_ROUTES.MEMBERS_COUPONS, labelKey: 'SUBMODULE_MEMBERS_COUPONS' },
  { href: ADMIN_ROUTES.MEMBERS_BLACKLIST, labelKey: 'SUBMODULE_MEMBERS_BLACKLIST' }
] as const;

export default function AdminMembersLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <div className="w-full space-y-4">
      <nav aria-label={t('DOMAIN_MEMBERS_SECTIONS')} className="border-b border-indigo-500/20 bg-card rounded-2xl p-1 block md:hidden mb-4">
        <div className="flex min-w-0 gap-1.5 overflow-x-auto p-1 scrollbar-none">
          {SUBMODULE_NAVIGATION.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  active ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-950/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="w-full">{children}</div>
    </div>
  );
}
