'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

const SUBMODULE_NAVIGATION = [
  { href: ADMIN_ROUTES.FINANCE_COLLECT_FEE, labelKey: 'SUBMODULE_FINANCE_COLLECT_FEE' },
  { href: ADMIN_ROUTES.FINANCE_SUBSCRIPTIONS, labelKey: 'SUBMODULE_FINANCE_SUBSCRIPTIONS' },
  { href: ADMIN_ROUTES.FINANCE_RENEWALS, labelKey: 'SUBMODULE_FINANCE_RENEWALS' },
  { href: ADMIN_ROUTES.FINANCE_PAYMENTS, labelKey: 'SUBMODULE_FINANCE_PAYMENTS' },
  { href: ADMIN_ROUTES.FINANCE_PAYMENT_PROMISES, labelKey: 'SUBMODULE_FINANCE_PAYMENT_PROMISES' },
  { href: ADMIN_ROUTES.FINANCE_SECURITY_DEPOSITS, labelKey: 'SUBMODULE_FINANCE_SECURITY_DEPOSITS' },
  { href: ADMIN_ROUTES.FINANCE_LATE_FEES, labelKey: 'SUBMODULE_FINANCE_LATE_FEES' },
  { href: ADMIN_ROUTES.FINANCE_AUTO_SUSPEND, labelKey: 'SUBMODULE_FINANCE_AUTO_SUSPEND' },
  { href: ADMIN_ROUTES.FINANCE_INVOICES, labelKey: 'SUBMODULE_FINANCE_INVOICES' },
  { href: ADMIN_ROUTES.FINANCE_RECEIPTS, labelKey: 'SUBMODULE_FINANCE_RECEIPTS' },
  { href: ADMIN_ROUTES.FINANCE_REFUNDS, labelKey: 'SUBMODULE_FINANCE_REFUNDS' },
  { href: ADMIN_ROUTES.FINANCE_TRUST_SCORE, labelKey: 'SUBMODULE_FINANCE_TRUST_SCORE' },
  { href: ADMIN_ROUTES.FINANCE_REFERRALS, labelKey: 'SUBMODULE_FINANCE_REFERRALS' },
  { href: ADMIN_ROUTES.FINANCE_DASHBOARD, labelKey: 'SUBMODULE_FINANCE_DASHBOARD' }
] as const;

export default function AdminFinanceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <div className="min-w-0 space-y-4">
      <nav aria-label={t('DOMAIN_FINANCE_SECTIONS')} className="border-b border-border bg-card">
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
